import ctypes
import json
import os
import subprocess
import sys
import threading
import time
from pathlib import Path

import requests

from audio_judge import GuitarAudioJudge
from coach_assistant import (
    answer_offline_coach,
    build_strict_system_prompt,
    check_off_topic_guardrail,
)

APP_VERSION = "1.0.0"
IS_FROZEN = bool(getattr(sys, "frozen", False))
RESOURCE_DIR = Path(getattr(sys, "_MEIPASS", Path(__file__).resolve().parent))
EXE_DIR = Path(sys.executable).resolve().parent if IS_FROZEN else Path(__file__).resolve().parent

if IS_FROZEN:
    if (EXE_DIR / "portable.txt").exists() or "--portable" in sys.argv:
        DATA_DIR = EXE_DIR / "data"
    else:
        local_appdata = Path(os.environ.get("LOCALAPPDATA") or (Path.home() / "AppData" / "Local"))
        DATA_DIR = local_appdata / "JazzGuitarPracticeStudio" / "data"
else:
    DATA_DIR = EXE_DIR / "data"

BASE_DIR = EXE_DIR
UI_ENTRY = RESOURCE_DIR / "ui" / "index.html"
ICON_FILE = RESOURCE_DIR / "assets" / "studio_icon.ico"
STATE_FILE = DATA_DIR / "progress.json"
AI_CONFIG_FILE = DATA_DIR / "ai_config.json"
LOG_FILE = DATA_DIR / "app.log"


def ensure_stdio_for_pythonw() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if sys.stdout is None:
        sys.stdout = open(LOG_FILE, "a", encoding="utf-8", buffering=1)
    if sys.stderr is None:
        sys.stderr = open(LOG_FILE, "a", encoding="utf-8", buffering=1)


def enable_windows_hidpi() -> None:
    if sys.platform != "win32":
        return
    try:
        ctypes.windll.shell32.SetCurrentProcessExplicitAppUserModelID(
            "AntmenStudio.JazzGuitarPracticeStudio.1"
        )
    except Exception:
        pass
    try:
        ctypes.windll.shcore.SetProcessDpiAwareness(2)
    except Exception:
        try:
            ctypes.windll.user32.SetProcessDPIAware()
        except Exception:
            pass


def _read_dotenv_key(var_name: str) -> str:
    for env_path in [BASE_DIR / ".env", Path.home() / ".env"]:
        if env_path.exists():
            try:
                for line in env_path.read_text(encoding="utf-8").splitlines():
                    s = line.strip()
                    if s.startswith(f"{var_name}="):
                        return s.split("=", 1)[1].strip().strip('"').strip("'")
            except Exception:
                pass
    return os.environ.get(var_name, "").strip()


class StudioApi:
    def __init__(self, read_only: bool = False) -> None:
        self._window = None
        self._lock = threading.Lock()
        self._read_only = read_only
        self._judge = GuitarAudioJudge()
        DATA_DIR.mkdir(parents=True, exist_ok=True)

    def attach_window(self, window) -> None:
        self._window = window

    def shutdown(self) -> None:
        self._judge.stop_listening()

    # --- Live Guitar Audio Judge Endpoints ---
    def list_audio_inputs(self) -> list[dict]:
        return self._judge.list_input_devices()

    def start_guitar_listener(self, device_index=None, channel_mode: str = "sum") -> dict:
        idx = int(device_index) if device_index not in (None, "", "default") else None
        return self._judge.start_listening(device_index=idx, channel_mode=str(channel_mode or "sum"))

    def stop_guitar_listener(self) -> dict:
        return self._judge.stop_listening()

    def set_guitar_channel(self, mode: str) -> dict:
        return self._judge.set_channel_mode(str(mode or "sum"))

    def set_judge_settings(self, latency_ms=None, pass_threshold=None) -> dict:
        return self._judge.set_judge_params(latency_ms=latency_ms, pass_threshold=pass_threshold)

    def get_guitar_level(self) -> dict:
        return self._judge.get_level()

    def evaluate_chorus(self, payload: dict) -> dict:
        if not isinstance(payload, dict):
            return {"ok": False, "status": "idle", "score": 0, "summary": "Invalid payload."}
        return self._judge.evaluate_live_chorus(payload)

    def calibrate_guitar_latency(self, click_agos_sec: list) -> dict:
        if not isinstance(click_agos_sec, list):
            return {"ok": False, "error": "Invalid click list."}
        return self._judge.calibrate_from_clicks([float(x) for x in click_agos_sec])

    def replay_last_chorus(self) -> dict:
        return self._judge.replay_last_take()

    def load_state(self) -> dict:
        with self._lock:
            if not STATE_FILE.exists():
                return {}
            try:
                return json.loads(STATE_FILE.read_text(encoding="utf-8"))
            except Exception:
                return {}

    def save_state(self, state: dict) -> bool:
        if self._read_only or not isinstance(state, dict):
            return True
        with self._lock:
            DATA_DIR.mkdir(parents=True, exist_ok=True)
            tmp_path = STATE_FILE.with_suffix(".tmp")
            tmp_path.write_text(
                json.dumps(state, ensure_ascii=False, indent=2),
                encoding="utf-8",
            )
            tmp_path.replace(STATE_FILE)
        return True

    def toggle_fullscreen(self) -> bool:
        if self._window is not None:
            self._window.toggle_fullscreen()
            return True
        return False

    def open_external_url(self, url: str) -> bool:
        if isinstance(url, str) and url.startswith("https://"):
            try:
                os.startfile(url)  # type: ignore[attr-defined]
                return True
            except Exception:
                return False
        return False

    def _load_ai_config_raw(self) -> dict:
        cfg = {
            "provider": "gemini",
            "api_key": "",
            "model": "gemini-2.5-flash",
            "base_url": "http://localhost:11434",
        }
        if AI_CONFIG_FILE.exists():
            try:
                disk = json.loads(AI_CONFIG_FILE.read_text(encoding="utf-8"))
                if isinstance(disk, dict):
                    cfg.update(disk)
            except Exception:
                pass

        if not cfg["api_key"]:
            if cfg["provider"] == "gemini":
                cfg["api_key"] = _read_dotenv_key("GEMINI_API_KEY") or _read_dotenv_key("GOOGLE_API_KEY")
            elif cfg["provider"] == "openai":
                cfg["api_key"] = _read_dotenv_key("OPENAI_API_KEY")
        return cfg

    def get_ai_status(self) -> dict:
        cfg = self._load_ai_config_raw()
        key = cfg.get("api_key", "")
        provider = cfg.get("provider", "gemini")
        configured = bool(key) if provider in ("gemini", "openai") else True
        masked = f"{key[:4]}...{key[-4:]}" if len(key) >= 10 else ("Tanımlı" if key else "")
        return {
            "configured": configured,
            "provider": provider,
            "model": cfg.get("model", "gemini-2.5-flash"),
            "base_url": cfg.get("base_url", "http://localhost:11434"),
            "masked_key": masked,
        }

    def save_ai_config(self, payload: dict) -> dict:
        if self._read_only or not isinstance(payload, dict):
            return self.get_ai_status()
        with self._lock:
            existing = self._load_ai_config_raw()
            provider = payload.get("provider") or existing.get("provider", "gemini")
            new_key = (payload.get("api_key") or "").strip()
            # Keep existing key if user left password box blank while changing model
            final_key = new_key if new_key else existing.get("api_key", "")
            default_model = (
                "gemini-2.5-flash"
                if provider == "gemini"
                else ("gpt-4o-mini" if provider == "openai" else "llama3.1")
            )
            model = (payload.get("model") or "").strip() or default_model
            base_url = (payload.get("base_url") or "http://localhost:11434").strip()
            saved = {
                "provider": provider,
                "api_key": final_key,
                "model": model,
                "base_url": base_url,
            }
            DATA_DIR.mkdir(parents=True, exist_ok=True)
            AI_CONFIG_FILE.write_text(
                json.dumps(saved, ensure_ascii=False, indent=2),
                encoding="utf-8",
            )
        return self.get_ai_status()

    def ask_ai_coach(self, question: str, studio_context: dict, history: list) -> dict:
        question = (question or "").strip()
        if not question:
            return {"ok": False, "answer": "Please enter a question."}

        cfg = self._load_ai_config_raw()
        provider = cfg.get("provider", "gemini")
        api_key = cfg.get("api_key", "")
        model = cfg.get("model", "gemini-2.5-flash")

        # When no API key is configured, answer using the built-in Offline App Help & Theory Assistant!
        if provider in ("gemini", "openai") and not api_key:
            return answer_offline_coach(question, studio_context if isinstance(studio_context, dict) else {})

        # When API key (or Ollama) IS active, enforce strict off-topic / prompt-injection guardrail!
        refusal = check_off_topic_guardrail(question)
        if refusal:
            return {"ok": True, "answer": refusal}

        system_prompt = build_strict_system_prompt(
            studio_context if isinstance(studio_context, dict) else {}
        )

        try:
            if provider == "gemini":
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
                contents = []
                if isinstance(history, list):
                    for msg in history[-8:]:
                        role = "user" if msg.get("role") == "user" else "model"
                        txt = str(msg.get("text", "")).strip()
                        if txt:
                            contents.append({"role": role, "parts": [{"text": txt}]})
                contents.append({"role": "user", "parts": [{"text": question}]})
                body = {
                    "systemInstruction": {"parts": [{"text": system_prompt}]},
                    "contents": contents,
                    "generationConfig": {"temperature": 0.45, "maxOutputTokens": 900},
                }
                resp = requests.post(
                    url,
                    params={"key": api_key},
                    json=body,
                    timeout=30,
                )
                if resp.status_code != 200:
                    err_msg = resp.json().get("error", {}).get("message", resp.text[:200])
                    return {"ok": False, "answer": f"Gemini API hatası ({resp.status_code}): {err_msg}"}
                data = resp.json()
                parts = (
                    data.get("candidates", [{}])[0]
                    .get("content", {})
                    .get("parts", [])
                )
                answer = "".join(p.get("text", "") for p in parts).strip()
                return {"ok": True, "answer": answer or "Yanıt boş döndü."}

            elif provider == "openai":
                messages = [{"role": "system", "content": system_prompt}]
                if isinstance(history, list):
                    for msg in history[-8:]:
                        r = "user" if msg.get("role") == "user" else "assistant"
                        txt = str(msg.get("text", "")).strip()
                        if txt:
                            messages.append({"role": r, "content": txt})
                messages.append({"role": "user", "content": question})
                resp = requests.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {api_key}"},
                    json={"model": model, "messages": messages, "temperature": 0.45},
                    timeout=30,
                )
                if resp.status_code != 200:
                    return {"ok": False, "answer": f"OpenAI API hatası ({resp.status_code}): {resp.text[:200]}"}
                answer = resp.json()["choices"][0]["message"]["content"].strip()
                return {"ok": True, "answer": answer}

            else:
                # Local Ollama
                base_url = cfg.get("base_url", "http://localhost:11434").rstrip("/")
                messages = [{"role": "system", "content": system_prompt}]
                if isinstance(history, list):
                    for msg in history[-8:]:
                        r = "user" if msg.get("role") == "user" else "assistant"
                        txt = str(msg.get("text", "")).strip()
                        if txt:
                            messages.append({"role": r, "content": txt})
                messages.append({"role": "user", "content": question})
                resp = requests.post(
                    f"{base_url}/api/chat",
                    json={"model": model, "messages": messages, "stream": False},
                    timeout=45,
                )
                if resp.status_code != 200:
                    return {"ok": False, "answer": f"Ollama bağlantı hatası ({resp.status_code}): {resp.text[:200]}"}
                answer = resp.json().get("message", {}).get("content", "").strip()
                return {"ok": True, "answer": answer or "Ollama yanıt döndürmedi."}

        except Exception as exc:
            return {"ok": False, "answer": f"Bağlantı hatası: {exc}"}


def launch_edge_app_fallback() -> int:
    url = UI_ENTRY.as_uri()
    candidates = [
        Path(os.environ.get("ProgramFiles(x86)", "")) / "Microsoft/Edge/Application/msedge.exe",
        Path(os.environ.get("ProgramFiles", "")) / "Microsoft/Edge/Application/msedge.exe",
        Path(os.environ.get("ProgramFiles", "")) / "Google/Chrome/Application/chrome.exe",
    ]
    profile_dir = DATA_DIR / "browser_profile"
    profile_dir.mkdir(parents=True, exist_ok=True)
    for exe in candidates:
        if exe.exists():
            subprocess.Popen(
                [
                    str(exe),
                    f"--app={url}",
                    f"--user-data-dir={profile_dir}",
                    "--window-size=1620,980",
                ]
            )
            return 0
    os.startfile(str(UI_ENTRY))  # type: ignore[attr-defined]
    return 0


def main() -> int:
    ensure_stdio_for_pythonw()
    enable_windows_hidpi()
    smoke_test = "--smoke-test" in sys.argv
    force_browser = "--browser" in sys.argv

    if force_browser:
        return launch_edge_app_fallback()

    try:
        import webview
    except ImportError:
        return launch_edge_app_fallback()

    api = StudioApi(read_only=smoke_test)
    window = webview.create_window(
        title="Jazz Guitar Practice Studio — 8-Module Curriculum & AI Jazz Coach",
        url=UI_ENTRY.as_uri(),
        js_api=api,
        width=1620,
        height=980,
        min_size=(1060, 700),
        resizable=True,
        background_color="#0b0f17",
    )
    api.attach_window(window)

    smoke_result = {"ok": False, "error": None}

    def run_smoke_check():
        try:
            time.sleep(1.2)
            js_ok = window.evaluate_js(
                """
                (function() {
                  if (typeof togglePlay !== 'function' ||
                      typeof toggleMetroOnly !== 'function' ||
                      typeof tapTempo !== 'function' ||
                      typeof selectModule !== 'function' ||
                      typeof toggleRoadmapModal !== 'function' ||
                      typeof toggleAiDrawer !== 'function' ||
                      typeof toggleAutoJudge !== 'function' ||
                      typeof calibrateLatency !== 'function' ||
                      typeof replayLastTake !== 'function') return false;
                  if (!document.getElementById('beat-pad-4')) return false;
                  if (!document.getElementById('judge-panel') || !document.getElementById('judge-bar-4')) return false;
                  if (document.querySelectorAll('.fret-string-row').length !== 6) return false;
                  if (document.querySelectorAll('.block-tab').length !== 4) return false;
                  if (document.querySelectorAll('.key-node').length !== 12) return false;

                  // Verify top dropdown dynamically changes per Block (b1=Chord, b2=Arp, b3=Mode, b4=Solo)!
                  selectBlock('b1');
                  if (!document.getElementById('select-module').options[0].text.includes('Chord 1.1')) return false;
                  selectBlock('b2');
                  if (!document.getElementById('select-module').options[0].text.includes('Arp 2.1')) return false;
                  selectBlock('b3');
                  if (!document.getElementById('select-module').options[0].text.includes('Mode 3.1')) return false;
                  selectBlock('b4');
                  if (!document.getElementById('select-module').options[0].text.includes('Solo 4.1')) return false;

                  // Test all 4 playable modules (m1, m2, m3, m4) across all 12 keys & 4 blocks (192 tables)!
                  for (const modId of ['m1', 'm2', 'm3', 'm4']) {
                    selectModule(modId);
                    for (const k of KEYS) {
                      for (const b of ['b1', 'b2', 'b3', 'b4']) {
                        activeBlockId = b;
                        const evs = buildEventsForKey(k);
                        if (!evs || evs.length < 4) return false;
                        for (const ev of evs) {
                          for (const n of ev.notes) {
                            if (n.f < 0 || n.f > 15) return false;
                          }
                        }
                      }
                    }
                  }
                  toggleRoadmapModal();
                  if (document.querySelectorAll('.roadmap-card').length !== 8) return false;
                  toggleRoadmapModal();
                  toggleAiDrawer();
                  toggleAiDrawer();

                  // Verify Modül 1 F Major still starts at 3rd fret Gm7!
                  selectModule('m1');
                  posMode = 'slide';
                  activeBlockId = 'b1';
                  const fEvs = buildEventsForKey(KEYS.find(x => x.id === 'F'));
                  if (!fEvs[0].notes.every(n => n.f === 3)) return false;

                  // Verify Circle auto key-switch
                  masterVol = 0;
                  currentKeyId = 'C';
                  practiceLoopMode = 'circle';
                  circleOrderMode = 'fourths';
                  circleUnitMode = 'chorus';
                  circleChorusesPerKey = 1;
                  circleBreathBar = false;
                  countInEnabled = false;
                  schedBpm = 600;
                  bpm = 600;
                  startPlayback();
                  nextSubTime = audioCtx.currentTime - 5.0;
                  schedulerTick();
                  const movedPastC = (schedKeyIdx >= 1 && schedOrder[1] === 'F');
                  stopPlayback();
                  return movedPastC;
                })()
                """
            )
            smoke_result["ok"] = bool(js_ok)
        except Exception as exc:
            smoke_result["error"] = str(exc)
        finally:
            window.destroy()

    icon_arg = str(ICON_FILE) if ICON_FILE.exists() else None
    try:
        if smoke_test:
            webview.start(run_smoke_check, gui="edgechromium", icon=icon_arg)
            if not smoke_result["ok"]:
                print(f"SMOKE_TEST_FAILED: {smoke_result['error']}", file=sys.stderr)
                return 1
            print("SMOKE_TEST_PASSED")
            return 0

        webview.start(gui="edgechromium", icon=icon_arg)
        return 0
    finally:
        api.shutdown()


if __name__ == "__main__":
    raise SystemExit(main())
