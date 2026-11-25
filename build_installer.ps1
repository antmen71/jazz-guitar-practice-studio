# Reproducible Windows Release Builder for Jazz Guitar Practice Studio v1.1.0
# Builds:
#   1) Standalone onedir folder (dist\JazzGuitarStudio) -> compiled into Setup.exe
#   2) Single-file crash-proof Portable EXE (installer_output\JazzGuitarPracticeStudio_Portable_v1.1.0_win64.exe)
#   3) Portable ZIP containing the single-file EXE (installer_output\JazzGuitarPracticeStudio_Portable_v1.1.0_win64.zip)
#   4) Native Windows Setup Wizard (installer_output\JazzGuitarPracticeStudio_Setup_v1.1.0.exe)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$version = "1.1.0"
New-Item -ItemType Directory -Force -Path (Join-Path $PSScriptRoot "installer_output") | Out-Null
Remove-Item (Join-Path $PSScriptRoot "installer_output\*") -Force -ErrorAction SilentlyContinue

Write-Host "==> [1/5] Compiling fast-start onedir JazzGuitarStudio.exe for Installer..." -ForegroundColor Cyan
pyinstaller --noconfirm --clean JazzGuitarStudio.spec
if ($LASTEXITCODE -ne 0) { throw "PyInstaller onedir build failed." }

Write-Host "==> [2/5] Smoke-testing onedir EXE..." -ForegroundColor Cyan
$exePath = Join-Path $PSScriptRoot "dist\JazzGuitarStudio\JazzGuitarStudio.exe"
$proc = Start-Process -FilePath $exePath -ArgumentList "--smoke-test", "--portable" -Wait -PassThru
Remove-Item -Recurse -Force (Join-Path $PSScriptRoot "dist\JazzGuitarStudio\data") -ErrorAction SilentlyContinue
if ($proc.ExitCode -ne 0) { throw "Onedir smoke test failed with exit code $($proc.ExitCode)" }

Write-Host "==> [3/5] Compiling single-file crash-proof Portable EXE (Win10 Zone.Identifier immune)..." -ForegroundColor Cyan
pyinstaller --noconfirm --clean JazzGuitarStudio_Portable.spec
if ($LASTEXITCODE -ne 0) { throw "PyInstaller onefile portable build failed." }

$portableExeBuilt = Join-Path $PSScriptRoot "dist\JazzGuitarPracticeStudio_Portable_v${version}_win64.exe"
$portableExeOut = Join-Path $PSScriptRoot "installer_output\JazzGuitarPracticeStudio_Portable_v${version}_win64.exe"
Copy-Item -Force $portableExeBuilt $portableExeOut

Write-Host "==> [4/5] Smoke-testing single-file Portable EXE & creating Portable ZIP..." -ForegroundColor Cyan
$procPort = Start-Process -FilePath $portableExeOut -ArgumentList "--smoke-test" -Wait -PassThru
Remove-Item -Recurse -Force (Join-Path $PSScriptRoot "installer_output\data") -ErrorAction SilentlyContinue
if ($procPort.ExitCode -ne 0) { throw "Single-file Portable EXE smoke test failed with exit code $($procPort.ExitCode)" }

$zipOut = Join-Path $PSScriptRoot "installer_output\JazzGuitarPracticeStudio_Portable_v${version}_win64.zip"
Compress-Archive -Path $portableExeOut -DestinationPath $zipOut -CompressionLevel Optimal

Write-Host "==> [5/5] Compiling Windows Setup.exe via Inno Setup 6..." -ForegroundColor Cyan
$isccCandidates = @(
    "$env:LOCALAPPDATA\Programs\Inno Setup 6\ISCC.exe",
    "C:\Program Files (x86)\Inno Setup 6\ISCC.exe",
    "C:\Program Files\Inno Setup 6\ISCC.exe"
)
$iscc = $isccCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $iscc) {
    $cmd = Get-Command ISCC.exe -ErrorAction SilentlyContinue
    if ($cmd) { $iscc = $cmd.Source }
}
if (-not $iscc) {
    throw "Inno Setup 6 (ISCC.exe) not found."
}

& $iscc (Join-Path $PSScriptRoot "installer.iss")
if ($LASTEXITCODE -ne 0) { throw "Inno Setup compilation failed." }

Write-Host "✓ v$version Release artifacts ready in .\installer_output\" -ForegroundColor Green
Get-ChildItem (Join-Path $PSScriptRoot "installer_output") | Select-Object Name, @{N="SizeMB";E={[math]::Round($_.Length/1MB, 2)}}
