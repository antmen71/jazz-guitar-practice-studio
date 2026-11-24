import math
import threading
import time
from typing import Any

import numpy as np
import sounddevice as sd


NOTE_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]


def midi_to_name(midi_num: int) -> str:
    pc = int(round(midi_num)) % 12
    octv = (int(round(midi_num)) // 12) - 1
    return f"{NOTE_NAMES[pc]}{octv}"


class GuitarAudioJudge:
    """
    Continuous non-exclusive ring-buffer guitar listener and fast DSP chorus grader.
    Supports:
      - Monophonic pitch + swing pocket evaluation (Blocks 2 & 3: Arpeggios & Modes)
      - Polyphonic 12-bin harmonic chroma + rhythm gate evaluation (Block 1: Drop-2/Drop-3 Chords)
      - Improvisation harmonic fit + Guide-Tone landing evaluation (Block 4: Trio Soloing)
      - 4-beat transient latency calibration & last-take instant playback
    """

    def __init__(self, ring_seconds: float = 45.0) -> None:
        self._lock = threading.Lock()
        self._ring_seconds = ring_seconds
        self._stream: sd.InputStream | None = None
        self._listening = False

        self._device_index: int | None = None
        self._channel_mode: str = "sum"  # 'sum' | 'ch1' | 'ch2'
        self._sr: int = 44100
        self._ring = np.zeros(int(self._sr * self._ring_seconds), dtype=np.float32)
        self._write_pos: int = 0
        self._total_written: int = 0
        self._last_cb_perf: float = 0.0

        self._rms_db: float = -90.0
        self._peak: float = 0.0
        self._latency_ms: float = 28.0
        self._pass_threshold: int = 85

        self._last_take: np.ndarray | None = None
        self._last_take_sr: int = 44100

    @staticmethod
    def _bandpass_guitar(wav_raw: np.ndarray, sr: int, low_hz: float = 65.0, high_hz: float = 1500.0) -> np.ndarray:
        """Zero-phase tapered FFT bandpass (65–1500 Hz) in pure NumPy — fast & zero SciPy bloat."""
        n = len(wav_raw)
        if n < 32:
            return wav_raw.astype(np.float32)
        spec = np.fft.rfft(wav_raw.astype(np.float64))
        freqs = np.fft.rfftfreq(n, d=1.0 / sr)
        mask = np.ones_like(freqs)

        # Smooth cosine high-pass taper 35..65 Hz
        hp_lo = low_hz * 0.55
        below = freqs < hp_lo
        hp_trans = (freqs >= hp_lo) & (freqs < low_hz)
        mask[below] = 0.0
        if np.any(hp_trans):
            phase = (freqs[hp_trans] - hp_lo) / max(1e-6, low_hz - hp_lo)
            mask[hp_trans] = 0.5 * (1.0 - np.cos(np.pi * phase))

        # Smooth cosine low-pass taper 1500..2200 Hz
        lp_hi = min(0.49 * sr, high_hz * 1.45)
        above = freqs > lp_hi
        lp_trans = (freqs > high_hz) & (freqs <= lp_hi)
        mask[above] = 0.0
        if np.any(lp_trans):
            phase = (freqs[lp_trans] - high_hz) / max(1e-6, lp_hi - high_hz)
            mask[lp_trans] = 0.5 * (1.0 + np.cos(np.pi * phase))

        return np.fft.irfft(spec * mask, n=n).astype(np.float32)

    def list_input_devices(self) -> list[dict[str, Any]]:
        """Return deduplicated input devices, prioritizing Windows WASAPI for low latency."""
        devices = sd.query_devices()
        hostapis = sd.query_hostapis()

        wasapi_idx = next(
            (i for i, h in enumerate(hostapis) if "WASAPI" in h["name"].upper()),
            None,
        )
        mme_idx = next(
            (i for i, h in enumerate(hostapis) if "MME" in h["name"].upper()),
            0,
        )

        selected_by_name: dict[str, dict[str, Any]] = {}
        # First pass: collect WASAPI devices; second pass: fill missing names from MME
        for preferred_api in ([wasapi_idx, mme_idx] if wasapi_idx is not None else [mme_idx]):
            for idx, dev in enumerate(devices):
                if dev["max_input_channels"] <= 0 or dev["hostapi"] != preferred_api:
                    continue
                name = str(dev["name"]).strip()
                if "loop-back" in name.lower() or "loopback" in name.lower():
                    continue
                if "sound mapper" in name.lower() or "primary sound" in name.lower():
                    continue
                # Skip MME 31-char truncated duplicates if full WASAPI name already exists
                prefix28 = name[:28].lower()
                if preferred_api == mme_idx and any(k.lower().startswith(prefix28) for k in selected_by_name):
                    continue
                if name not in selected_by_name:
                    api_tag = "WASAPI" if dev["hostapi"] == wasapi_idx else "MME"
                    low_n = name.lower()
                    is_preferred_hw = any(
                        kw in low_n for kw in ("audient", "id14", "umc", "rc-505")
                    )
                    is_analog_main = any(
                        kw in low_n for kw in ("analogue", "analog", "mic/line", "in 1-2", "1/2")
                    ) and "adat" not in low_n
                    is_digital_exp = any(kw in low_n for kw in ("adat", "spdif", "s/pdif"))
                    rank = (
                        0 if (is_preferred_hw and is_analog_main)
                        else (1 if is_preferred_hw and not is_digital_exp else (2 if not is_digital_exp else 3))
                    )
                    selected_by_name[name] = {
                        "index": idx,
                        "name": f"{name} ({api_tag})",
                        "raw_name": name,
                        "channels": int(dev["max_input_channels"]),
                        "samplerate": int(dev["default_samplerate"]),
                        "preferred": is_preferred_hw,
                        "_rank": rank,
                    }

        items = list(selected_by_name.values())
        items.sort(key=lambda x: (x["_rank"], x["name"]))
        for it in items:
            it.pop("_rank", None)
        return items

    def start_listening(
        self,
        device_index: int | None = None,
        channel_mode: str = "sum",
    ) -> dict[str, Any]:
        self.stop_listening()
        devs = self.list_input_devices()
        if device_index is None:
            if not devs:
                return {"ok": False, "error": "No audio input device found."}
            device_index = devs[0]["index"]

        try:
            dev_info = sd.query_devices(device_index)
            sr = int(dev_info["default_samplerate"]) or 44100
            max_ch = max(1, min(2, int(dev_info["max_input_channels"])))
        except Exception as exc:
            return {"ok": False, "error": f"Invalid audio device: {exc}"}

        with self._lock:
            self._device_index = device_index
            self._channel_mode = channel_mode if channel_mode in ("sum", "ch1", "ch2") else "sum"
            self._sr = sr
            self._ring = np.zeros(int(sr * self._ring_seconds), dtype=np.float32)
            self._write_pos = 0
            self._total_written = 0
            self._last_cb_perf = time.perf_counter()

        def _audio_callback(indata: np.ndarray, frames: int, time_info, status) -> None:
            now_perf = time.perf_counter()
            if indata.ndim == 1 or indata.shape[1] == 1:
                mono = indata.reshape(-1).astype(np.float32)
            else:
                mode = self._channel_mode
                if mode == "ch1":
                    mono = indata[:, 0].astype(np.float32)
                elif mode == "ch2":
                    mono = indata[:, 1].astype(np.float32)
                else:
                    # Sum Ch 1 + Ch 2 without clipping so either Input 1 (DI) or Input 2 works seamlessly
                    mono = (indata[:, 0] + indata[:, 1]).astype(np.float32)

            rms = float(np.sqrt(np.mean(mono * mono) + 1e-12))
            pk = float(np.max(np.abs(mono))) if frames > 0 else 0.0
            db = max(-90.0, 20.0 * math.log10(max(rms, 1e-5)))

            with self._lock:
                buf_len = len(self._ring)
                end_pos = self._write_pos + frames
                if end_pos <= buf_len:
                    self._ring[self._write_pos:end_pos] = mono
                else:
                    first = buf_len - self._write_pos
                    self._ring[self._write_pos:] = mono[:first]
                    self._ring[: frames - first] = mono[first:]
                self._write_pos = end_pos % buf_len
                self._total_written += frames
                self._last_cb_perf = now_perf
                self._rms_db = 0.65 * db + 0.35 * self._rms_db
                self._peak = max(pk, self._peak * 0.75)

        try:
            stream = sd.InputStream(
                device=device_index,
                channels=max_ch,
                samplerate=sr,
                blocksize=512,
                dtype="float32",
                callback=_audio_callback,
            )
            stream.start()
            self._stream = stream
            self._listening = True
            return {
                "ok": True,
                "listening": True,
                "device_index": device_index,
                "device_name": str(dev_info["name"]).strip(),
                "samplerate": sr,
                "channel_mode": self._channel_mode,
            }
        except Exception as exc:
            self._listening = False
            return {"ok": False, "error": str(exc)}

    def stop_listening(self) -> dict[str, Any]:
        st = self._stream
        self._stream = None
        self._listening = False
        if st is not None:
            try:
                st.stop()
                st.close()
            except Exception:
                pass
        with self._lock:
            self._rms_db = -90.0
            self._peak = 0.0
        return {"ok": True, "listening": False}

    def set_channel_mode(self, mode: str) -> dict[str, Any]:
        with self._lock:
            if mode in ("sum", "ch1", "ch2"):
                self._channel_mode = mode
        return {"ok": True, "channel_mode": self._channel_mode}

    def set_judge_params(self, latency_ms: float | None = None, pass_threshold: int | None = None) -> dict[str, Any]:
        with self._lock:
            if latency_ms is not None:
                self._latency_ms = max(-50.0, min(200.0, float(latency_ms)))
            if pass_threshold is not None:
                self._pass_threshold = max(60, min(98, int(pass_threshold)))
            return {
                "ok": True,
                "latency_ms": round(self._latency_ms, 1),
                "pass_threshold": self._pass_threshold,
            }

    def get_level(self) -> dict[str, Any]:
        with self._lock:
            return {
                "listening": self._listening,
                "rms_db": round(self._rms_db, 1),
                "peak": round(self._peak, 3),
                "latency_ms": round(self._latency_ms, 1),
                "pass_threshold": self._pass_threshold,
            }

    def replay_last_take(self) -> dict[str, Any]:
        with self._lock:
            if self._last_take is None or len(self._last_take) == 0:
                return {"ok": False, "error": "No recorded chorus take available yet."}
            audio = self._last_take.copy()
            sr = self._last_take_sr

        peak = float(np.max(np.abs(audio)))
        if peak > 1e-4:
            audio = (audio / max(peak, 0.05)) * 0.65
        try:
            sd.play(audio, sr)
            return {"ok": True}
        except Exception as exc:
            return {"ok": False, "error": str(exc)}

    def _extract_recent_window(self, start_ago_sec: float, duration_sec: float) -> tuple[np.ndarray, int]:
        """Extract audio starting `start_ago_sec` seconds before right now for `duration_sec`."""
        now_perf = time.perf_counter()
        with self._lock:
            sr = self._sr
            buf = self._ring
            buf_len = len(buf)
            # Account for tiny elapsed time since the most recent audio callback
            cb_age = max(0.0, min(0.1, now_perf - self._last_cb_perf))
            total_end_ago = max(0.0, start_ago_sec - cb_age)
            start_samples_ago = int(round(total_end_ago * sr))
            num_samples = max(1, int(round(duration_sec * sr)))

            if start_samples_ago > buf_len:
                start_samples_ago = buf_len
            start_idx = (self._write_pos - start_samples_ago) % buf_len

            out = np.zeros(num_samples, dtype=np.float32)
            avail = min(num_samples, start_samples_ago)
            if avail > 0:
                end_idx = start_idx + avail
                if end_idx <= buf_len:
                    out[:avail] = buf[start_idx:end_idx]
                else:
                    first = buf_len - start_idx
                    out[:first] = buf[start_idx:]
                    out[first:avail] = buf[: avail - first]
            return out, sr

    # --- Fast DSP Building Blocks ---
    @staticmethod
    def _detect_f0_yin_fft(seg: np.ndarray, sr: int, fmin: float = 73.0, fmax: float = 980.0) -> tuple[float, float]:
        """
        Vectorized FFT-accelerated YIN pitch detector.
        Returns (f0_hz, confidence_0_to_1). Runs in < 0.35 ms per note!
        """
        n = len(seg)
        tau_max = min(int(sr / fmin), n // 2 - 1)
        tau_min = max(2, int(sr / fmax))
        if tau_max <= tau_min + 2:
            return 0.0, 0.0

        w = n - tau_max
        x = seg[:n].astype(np.float64)
        x = x - np.mean(x)
        energy_total = float(np.sum(x * x))
        if energy_total < 1e-8:
            return 0.0, 0.0

        fft_size = 1 << (2 * n - 1).bit_length()
        fx1 = np.fft.rfft(x[:w], n=fft_size)
        fx2 = np.fft.rfft(x, n=fft_size)
        acf = np.fft.irfft(np.conj(fx1) * fx2, n=fft_size)[:tau_max + 1]

        sq = x * x
        csum = np.concatenate(([0.0], np.cumsum(sq)))
        e0 = csum[w]
        e_tau = csum[w : w + tau_max + 1] - csum[: tau_max + 1]
        d = e0 + e_tau - 2.0 * acf
        d = np.maximum(d, 0.0)

        cmndf = np.ones(tau_max + 1, dtype=np.float64)
        running = np.cumsum(d[1:])
        taus = np.arange(1, tau_max + 1, dtype=np.float64)
        denom = np.where(running > 1e-12, running, 1.0)
        cmndf[1:] = d[1:] * taus / denom

        search = cmndf[tau_min : tau_max + 1]
        thresh = 0.20
        below = np.where(search < thresh)[0]
        if len(below) > 0:
            rel_idx = int(below[0])
            while rel_idx + 1 < len(search) and search[rel_idx + 1] <= search[rel_idx]:
                rel_idx += 1
            best_tau = tau_min + rel_idx
        else:
            best_tau = tau_min + int(np.argmin(search))

        ap_val = float(cmndf[best_tau])
        conf = max(0.0, min(1.0, 1.0 - ap_val))
        if conf < 0.52:
            return 0.0, conf

        # Parabolic sub-sample refinement
        if 1 < best_tau < tau_max:
            y0, y1, y2 = cmndf[best_tau - 1], cmndf[best_tau], cmndf[best_tau + 1]
            denom_p = 2.0 * (2.0 * y1 - y2 - y0)
            if abs(denom_p) > 1e-12:
                shift = max(-0.5, min(0.5, (y2 - y0) / denom_p))
                best_tau_f = best_tau + shift
            else:
                best_tau_f = float(best_tau)
        else:
            best_tau_f = float(best_tau)

        return float(sr / best_tau_f), conf

    @staticmethod
    def _compute_12bin_chroma(seg: np.ndarray, sr: int) -> np.ndarray:
        """High-resolution zero-padded FFT pitch-class profile across guitar range E2..G5."""
        chroma = np.zeros(12, dtype=np.float64)
        if len(seg) < 256:
            return chroma
        win = np.hanning(len(seg))
        x = seg * win
        n_fft = max(8192, 1 << (len(x) - 1).bit_length())
        # Compressed magnitude (** 0.65) balances bass and treble strings in 4-note Drop voicings
        spec = np.abs(np.fft.rfft(x, n=n_fft)) ** 0.65
        freqs = np.fft.rfftfreq(n_fft, d=1.0 / sr)

        note_energy = np.zeros(44, dtype=np.float64)  # MIDI 40..83
        for idx_m, midi_p in enumerate(range(40, 84)):
            f_center = 440.0 * (2.0 ** ((midi_p - 69.0) / 12.0))
            f_lo = f_center * (2.0 ** (-0.32 / 12.0))
            f_hi = f_center * (2.0 ** (0.32 / 12.0))
            idx_lo = int(np.searchsorted(freqs, f_lo))
            idx_hi = int(np.searchsorted(freqs, f_hi))
            if idx_hi > idx_lo:
                note_energy[idx_m] = float(np.max(spec[idx_lo:idx_hi]))

        # Gently suppress 2nd (+12) and 3rd (+19) harmonic bleed from lower strings
        cleaned = note_energy.copy()
        for idx_m in range(44):
            if idx_m >= 12:
                cleaned[idx_m] = max(0.0, cleaned[idx_m] - 0.30 * note_energy[idx_m - 12])
            if idx_m >= 19:
                cleaned[idx_m] = max(0.0, cleaned[idx_m] - 0.24 * note_energy[idx_m - 19])
            chroma[(40 + idx_m) % 12] += cleaned[idx_m]

        norm = float(np.linalg.norm(chroma))
        if norm > 1e-12:
            chroma /= norm
        return chroma

    def calibrate_from_clicks(self, click_agos_sec: list[float]) -> dict[str, Any]:
        """Estimate input-to-WebAudio latency (ms) from 4 muted string chucks."""
        if not click_agos_sec:
            return {"ok": False, "error": "No calibration click timestamps received."}

        max_ago = max(click_agos_sec) + 0.25
        wav, sr = self._extract_recent_window(max_ago, max_ago)
        hop = max(1, int(sr * 0.004))  # 4 ms hop
        n_frames = len(wav) // hop
        if n_frames < 20:
            return {"ok": False, "error": "Insufficient audio captured."}

        framed = wav[: n_frames * hop].reshape(n_frames, hop)
        rms = np.sqrt(np.mean(framed * framed, axis=1) + 1e-12)
        flux = np.maximum(0.0, np.diff(rms, prepend=rms[0]))
        peak_flux = float(np.max(flux))
        if peak_flux < 1e-4:
            return {"ok": False, "error": "No guitar transient detected. Strum a muted string louder!"}

        offsets_ms: list[float] = []
        for ago in click_agos_sec:
            click_t = max_ago - ago
            lo_f = max(0, int((click_t - 0.05) * sr / hop))
            hi_f = min(n_frames, int((click_t + 0.16) * sr / hop))
            if hi_f > lo_f + 2:
                sub = flux[lo_f:hi_f]
                if float(np.max(sub)) > peak_flux * 0.22:
                    pk_idx = lo_f + int(np.argmax(sub))
                    det_t = pk_idx * hop / sr
                    offsets_ms.append((det_t - click_t) * 1000.0)

        if len(offsets_ms) < 2:
            return {"ok": False, "error": "Detected fewer than 2 strums. Chuck on beats 1-2-3-4!"}

        med_ms = float(np.median(offsets_ms))
        med_ms = max(-20.0, min(140.0, med_ms))
        with self._lock:
            self._latency_ms = med_ms
        return {
            "ok": True,
            "latency_ms": round(med_ms, 1),
            "hits_detected": len(offsets_ms),
        }

    # --- Main Chorus Grader ---
    def grade_waveform(
        self,
        wav_raw: np.ndarray,
        sr: int,
        block_id: str,
        events: list[dict[str, Any]],
        key_pc: int,
        chorus_dur_sec: float,
        pass_threshold: int,
    ) -> dict[str, Any]:
        """Pure waveform grader (testable both from live ring buffer and synthetic unit tests)."""
        if len(wav_raw) < int(sr * 0.5):
            return {"ok": False, "status": "idle", "score": 0, "summary": "Buffer warming up..."}

        wav = self._bandpass_guitar(wav_raw, sr)

        # Compute 8 ms frame RMS envelope & adaptive noise floor
        hop = max(1, int(sr * 0.008))
        n_frames = len(wav) // hop
        framed = wav[: n_frames * hop].reshape(n_frames, hop)
        rms_env = np.sqrt(np.mean(framed * framed, axis=1) + 1e-12)
        flux_env = np.maximum(0.0, np.diff(rms_env, prepend=rms_env[0]))

        # Cap background noise floor so sustained legato choruses never self-mask as noise!
        noise_floor = min(0.008, max(0.0008, float(np.percentile(rms_env, 5))))
        peak_rms = float(np.max(rms_env))
        note_gate = max(noise_floor * 2.2, peak_rms * 0.10)
        active_ratio = float(np.mean(rms_env > note_gate))

        # Resting / Sitting out detection -> ZERO penalty!
        if peak_rms < max(0.0045, noise_floor * 3.0) or active_ratio < 0.08:
            return {
                "ok": True,
                "status": "resting",
                "passed": False,
                "score": 0,
                "bar_scores": [0, 0, 0, 0],
                "summary": "⏸ Listening — play along on guitar to auto-grade this chorus.",
                "details": [],
            }

        bar_totals = [0, 0, 0, 0]
        bar_points = [0.0, 0.0, 0.0, 0.0]
        misses: list[str] = []

        # --- BLOCK 1: Polyphonic Drop-2 / Drop-3 Chord Voicings ---
        if block_id == "b1":
            for ev in events:
                b_idx = int(ev.get("barIdx", 0))
                t_start = float(ev["relStartSec"])
                dur = max(0.16, float(ev.get("durSec", 0.35)))
                notes = ev.get("notes", [])
                bar_totals[b_idx] += 1

                # Check rhythmic attack pocket around t_start [-85ms .. +95ms]
                f_lo = max(0, int((t_start - 0.085) * sr / hop))
                f_hi = min(n_frames, int((t_start + 0.095) * sr / hop))
                s_lo = max(0, int((t_start + 0.015) * sr))
                s_hi = min(len(wav), int((t_start + min(dur * 0.88, 0.40)) * sr))

                seg = wav[s_lo:s_hi]
                seg_rms = float(np.sqrt(np.mean(seg * seg) + 1e-12)) if len(seg) > 64 else 0.0
                if seg_rms < note_gate:
                    misses.append(f"B{b_idx+1} {ev.get('label','')}: Missed strum")
                    continue

                # Timing credit (0.28 weight) + Harmonic Chroma match (0.72 weight)
                pocket_flux = float(np.max(flux_env[f_lo:f_hi])) if f_hi > f_lo else 0.0
                local_max_flux = max(1e-6, float(np.percentile(flux_env, 92)))
                timing_ok = pocket_flux >= local_max_flux * 0.20 or seg_rms >= note_gate * 1.8

                c_obs = self._compute_12bin_chroma(seg, sr)
                c_exp = np.zeros(12, dtype=np.float64)
                for n in notes:
                    pc = int(n["midi"]) % 12
                    c_exp[pc] = 1.25 if n.get("isGuide") else 1.0
                exp_norm = float(np.linalg.norm(c_exp))
                if exp_norm > 1e-9:
                    c_exp /= exp_norm

                sim = float(np.dot(c_obs, c_exp))
                # Penalize unresolved half-step clash above active guide tones
                pts = 0.0
                if sim >= 0.70:
                    pts += 0.72
                elif sim >= 0.56:
                    pts += 0.45
                if timing_ok:
                    pts += 0.28

                bar_points[b_idx] += min(1.0, pts)
                if pts < 0.70 and len(misses) < 3:
                    misses.append(f"B{b_idx+1} {ev.get('label','')}: Voicing clarity {int(sim*100)}%")

        # --- BLOCKS 2 & 3: Monophonic 7th Arpeggios & Modes ---
        elif block_id in ("b2", "b3"):
            timing_errs_ms: list[float] = []
            for ev in events:
                b_idx = int(ev.get("barIdx", 0))
                t_start = float(ev["relStartSec"])
                dur = max(0.12, float(ev.get("durSec", 0.25)))
                exp_midi = int(ev["midi"])
                bar_totals[b_idx] += 1

                s_lo = max(0, int((t_start + 0.018) * sr))
                s_hi = min(len(wav), int((t_start + min(dur * 0.88, 0.30)) * sr))
                seg = wav[s_lo:s_hi]
                if len(seg) < int(sr * 0.05):
                    continue

                seg_rms = float(np.sqrt(np.mean(seg * seg) + 1e-12))
                if seg_rms < note_gate:
                    if len(misses) < 3:
                        misses.append(f"B{b_idx+1} ({midi_to_name(exp_midi)}): Missed note")
                    continue

                f0, conf = self._detect_f0_yin_fft(seg, sr)
                pitch_pts = 0.0
                if f0 > 50.0:
                    det_midi_f = 69.0 + 12.0 * math.log2(f0 / 440.0)
                    diff = abs(det_midi_f - exp_midi)
                    # Allow octave harmonic lock if pitch class is exact within 45 cents
                    pc_diff = abs(((det_midi_f - exp_midi + 6.0) % 12.0) - 6.0)
                    if diff <= 0.62:
                        pitch_pts = 0.78
                    elif pc_diff <= 0.45 and abs(diff - 12.0) <= 0.55:
                        pitch_pts = 0.68
                    elif len(misses) < 3:
                        misses.append(
                            f"B{b_idx+1}: Played {midi_to_name(round(det_midi_f))} (expected {midi_to_name(exp_midi)})"
                        )
                else:
                    if len(misses) < 3:
                        misses.append(f"B{b_idx+1} ({midi_to_name(exp_midi)}): Unclear pitch")

                # Onset / legato timing pocket check [-75ms .. +85ms]
                f_lo = max(0, int((t_start - 0.075) * sr / hop))
                f_hi = min(n_frames, int((t_start + 0.085) * sr / hop))
                time_pts = 0.22
                if f_hi > f_lo + 1:
                    sub_flux = flux_env[f_lo:f_hi]
                    pk_rel = int(np.argmax(sub_flux))
                    if float(sub_flux[pk_rel]) > noise_floor * 0.55:
                        err_ms = ((f_lo + pk_rel) * hop / sr - t_start) * 1000.0
                        timing_errs_ms.append(abs(err_ms))
                        if abs(err_ms) <= 68.0:
                            time_pts = 0.22
                        else:
                            time_pts = 0.10

                bar_points[b_idx] += min(1.0, pitch_pts + time_pts)

        # --- BLOCK 4: Free Jazz Trio Improvisation ---
        else:
            # Allowed pitch classes relative to key tonic (Dorian/Mixolydian/Major+Lydian#4)
            scale_rels_per_bar = [
                {0, 2, 4, 5, 7, 9, 11},      # Bar 1: ii Dorian
                {0, 2, 4, 5, 7, 9, 11},      # Bar 2: V Mixolydian
                {0, 2, 4, 5, 6, 7, 9, 11},   # Bar 3: I Major / Lydian #4
                {0, 2, 4, 5, 6, 7, 9, 11},   # Bar 4: I Turnaround
            ]
            guide_rels_per_bar = [
                {5, 0},   # ii7: b3, b7
                {11, 5},  # V7:  3, b7
                {4, 11},  # IMaj7: 3, 7
                {4, 11},
            ]
            win_len = int(sr * 0.09)
            step_len = int(sr * 0.06)
            bar_dur = max(0.5, chorus_dur_sec / 4.0)
            guide_hits = 0
            pitched_frames = 0

            for pos in range(0, len(wav) - win_len, step_len):
                seg = wav[pos : pos + win_len]
                seg_rms = float(np.sqrt(np.mean(seg * seg) + 1e-12))
                if seg_rms < note_gate:
                    continue
                f0, conf = self._detect_f0_yin_fft(seg, sr)
                if f0 <= 55.0 or conf < 0.60:
                    continue
                t_sec = pos / sr
                b_idx = min(3, int(t_sec / bar_dur))
                det_midi = int(round(69.0 + 12.0 * math.log2(f0 / 440.0)))
                rel_pc = (det_midi - key_pc) % 12
                pitched_frames += 1
                bar_totals[b_idx] += 1
                if rel_pc in scale_rels_per_bar[b_idx]:
                    bar_points[b_idx] += 1.0
                else:
                    # Passing chromatic tone gets partial jazz credit
                    bar_points[b_idx] += 0.35
                if rel_pc in guide_rels_per_bar[b_idx]:
                    guide_hits += 1

            if pitched_frames < 5:
                return {
                    "ok": True,
                    "status": "resting",
                    "passed": False,
                    "score": 0,
                    "bar_scores": [0, 0, 0, 0],
                    "summary": "⏸ Play a solo phrase (at least a few notes) to grade improvisation.",
                    "details": [],
                }
            # Ensure bars where the soloist intentionally left breathing space aren't scored 0!
            for b_i in range(4):
                if bar_totals[b_i] == 0:
                    bar_totals[b_i] = 1
                    bar_points[b_i] = 1.0 if b_i == 3 else 0.85
            if guide_hits == 0:
                misses.append("Try landing on more 3rd & 7th Guide Tones!")

        bar_scores = []
        total_t = sum(bar_totals)
        total_p = sum(bar_points)
        for i in range(4):
            if bar_totals[i] > 0:
                bar_scores.append(int(round(100.0 * bar_points[i] / bar_totals[i])))
            else:
                bar_scores.append(100)

        overall = int(round(100.0 * total_p / max(1, total_t)))
        passed = overall >= pass_threshold

        if passed:
            summary = f"✓ CLEAN CHORUS ({overall}% >= {pass_threshold}%) — Auto-advancing!"
        else:
            hint = f" • {misses[0]}" if misses else ""
            summary = f"✗ Score {overall}% (Need {pass_threshold}%){hint}"

        return {
            "ok": True,
            "status": "graded",
            "passed": passed,
            "score": overall,
            "bar_scores": bar_scores,
            "summary": summary,
            "details": misses,
        }

    def evaluate_live_chorus(self, payload: dict[str, Any]) -> dict[str, Any]:
        if not self._listening:
            return {"ok": False, "status": "off", "score": 0, "summary": "Auto-Judge mic is off."}

        with self._lock:
            lat_sec = self._latency_ms / 1000.0
            thresh = self._pass_threshold

        chorus_ago_sec = float(payload.get("chorusStartAgoSec", 8.0))
        chorus_dur_sec = float(payload.get("chorusDurSec", chorus_ago_sec))
        block_id = str(payload.get("blockId", "b1"))
        key_pc = int(payload.get("keyPc", 0))
        raw_events = payload.get("events", [])

        # Shift window by latency compensation (+120ms pre-pad so early Beat-1 attacks are caught!)
        pre_pad = 0.12
        extract_ago = max(0.2, chorus_ago_sec - lat_sec + pre_pad)
        extract_dur = min(self._ring_seconds - 0.5, chorus_dur_sec + pre_pad + 0.12)

        wav, sr = self._extract_recent_window(extract_ago, extract_dur)
        with self._lock:
            self._last_take = wav.copy()
            self._last_take_sr = sr

        shifted_events = []
        for ev in raw_events:
            c = dict(ev)
            c["relStartSec"] = float(ev.get("relStartSec", 0.0)) + pre_pad
            shifted_events.append(c)

        return self.grade_waveform(
            wav_raw=wav,
            sr=sr,
            block_id=block_id,
            events=shifted_events,
            key_pc=key_pc,
            chorus_dur_sec=chorus_dur_sec,
            pass_threshold=thresh,
        )
