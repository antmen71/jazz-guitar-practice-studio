# Jazz Guitar Practice Studio

A native Windows desktop practice studio (`pywebview` + Web Audio + real-time Python WASAPI DSP) built around the **Berklee / Jody Fisher / Randy Vincent Guide-Tone (`b7 → 3`)** jazz guitar methodology.

Designed for serious daily jazz guitar workouts across all **12 keys**, combining **Drop-3 & Pure Drop-2 voicings**, **in-position voice-led 7th arpeggios**, **Dorian / Mixolydian / Lydian `#4` modal phrasing**, **live trio improvisation**, a **Real-Time Guitar Audio Judge**, and a **Context-Aware AI Jazz Coach**.

---

## Key Features

- **8-Module Master Curriculum & 4 Daily Practice Blocks:**
  - **Block 1 (45m) — Jazz Voicings & Comping:** 6th-String Root Drop-3 (`6-4-3-2`), Middle 4-String Pure Drop-2 (`5-4-3-2`), Top 4-String Pure Drop-2 (`4-3-2-1`), and Single-Zone Cross-String Comping (`Four-to-the-Bar` & `Charleston` feels).
  - **Block 2 (60m) — Voice-Led 7th Arpeggios:** Continuous in-box `ii7 → V7 → IMaj7` arpeggio stitching via half-step `b7 → 3` Guide-Tone resolutions.
  - **Block 3 (45m) — Modes & Lydian (`#4`):** Flowing jazz eighth-note lines pairing Dorian, Mixolydian, and Lydian `#4` without position jumping.
  - **Block 4 (60m) — Jazz Trio Improvisation:** Real-time soloing over Walking Bass + Jazz Comping with highlighted `3rd` & `7th` Guide-Tone landing targets.
- **🎙️ Live Guitar Listener & Auto-Advance Judge (`WASAPI` Shared Mode):**
  - Listens to your real guitar input via your audio interface without exclusive driver locks.
  - Grades each 4-bar chorus using compressed-magnitude 12-bin harmonic chroma (polyphonic chords) and FFT-accelerated YIN pitch + pocket detection (arpeggios, modes, soloing).
  - **Hands-Free Progression:** Automatically logs Clean Reps (`1/3 → 2/3 → 3/3 → +5 BPM` up to graduation) and gates key changes (`Hold Key Until Clean`) around the Circle of 4ths/5ths.
  - Includes 4-beat muted-strum **Latency Calibration (`🎯 Calibrate`)**, **Zero-Penalty Rest Detection**, and instant **Last-Take Playback (`🔊 Replay Take`)**.
- **🔄 Continuous 12-Key Circle Engine:**
  - Practice in **Single Key Loop** or modulate seamlessly through the **Circle of 4ths**, **Circle of 5ths**, or **Random 12-Key Quiz** by choruses or minutes, with optional 1-bar transition breath & upcoming fret-box preview.
- **🤖 Context-Aware In-App AI Jazz Coach:**
  - Inspects your active drill, voicing grip, fret box, key, BPM, and latest Auto-Judge scorecard in real time.
  - Works offline with instant local chord/guide-tone analysis, or connects to **Google Gemini**, **OpenAI**, or **Local Ollama** (API keys stored locally only in ignored `data/ai_config.json`).

---

## Installation & Launch (Windows)

### 1. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 2. Run the Studio
```powershell
python app.py
```
Or double-click **`CazGitarKocu.vbs`** (zero-console native desktop launch).

### 3. Smoke Test (Optional)
```powershell
python app.py --smoke-test
```

---

## Hands-Free Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `Space` | Start / Stop Backing & Drill |
| `J` | Toggle Live Guitar Auto-Judge (`ON / OFF`) |
| `C` | Switch Single Key Loop ↔ 12-Key Circle Loop |
| `N` | Skip to Next Key |
| `M` | Metronome Only (`2 & 4` Hi-Hat Jazz Feel) |
| `Enter` / `Backspace` | Log Clean Rep (`+1`) / Stumbled |
| `↑` / `↓` | Adjust Tempo `±5 BPM` |
| `Z` | Toggle Focus Box Zoom on Fretboard |
| `1` – `4` | Select Practice Block `1` – `4` |
| `R` | Open 8-Module Master Roadmap |
| `A` | Open AI Jazz Guitar Coach Drawer |
| `F11` | Toggle Fullscreen |

---

## Privacy & Local Data
All personal practice progress (`data/progress.json`) and optional AI provider credentials (`data/ai_config.json`) are stored strictly on your local disk and excluded via `.gitignore`.
