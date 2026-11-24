# -*- mode: python ; coding: utf-8 -*-
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
    [],
    exclude_binaries=True,
    name="JazzGuitarStudio",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon="assets/studio_icon.ico",
)

coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name="JazzGuitarStudio",
)
