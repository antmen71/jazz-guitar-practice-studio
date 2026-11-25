# -*- mode: python ; coding: utf-8 -*-
# Single-File Portable Executable Spec (Zero external _internal DLL folder — immune to Windows 10 ZIP Zone.Identifier crash)
from PyInstaller.utils.hooks import collect_all, collect_data_files

datas = [
    ("ui", "ui"),
    ("assets", "assets"),
]
binaries = []
hiddenimports = [
    "sounddevice",
    "_sounddevice",
    "_cffi_backend",
    "requests",
    "numpy",
]

datas += collect_data_files("_sounddevice_data")
datas += collect_data_files("certifi")

for pkg in ("webview", "pythonnet", "clr_loader"):
    pkg_datas, pkg_bins, pkg_hidden = collect_all(pkg)
    datas += pkg_datas
    binaries += pkg_bins
    hiddenimports += pkg_hidden

excludes = [
    "torch",
    "torchaudio",
    "torchvision",
    "scipy",
    "librosa",
    "numba",
    "llvmlite",
    "matplotlib",
    "pandas",
    "sklearn",
    "PIL",
    "tkinter",
    "pytest",
    "IPython",
    "jupyter",
    "notebook",
    "sympy",
    "cv2",
]

a = Analysis(
    ["app.py"],
    pathex=[],
    binaries=binaries,
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=excludes,
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name="JazzGuitarPracticeStudio_Portable_v1.2.0_win64",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon="assets/studio_icon.ico",
)
