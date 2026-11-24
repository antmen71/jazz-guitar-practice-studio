# Reproducible Windows Release Builder for Jazz Guitar Practice Studio
# Builds:
#   1) Standalone executable folder (dist\JazzGuitarStudio)
#   2) Native Windows Setup Wizard (installer_output\JazzGuitarPracticeStudio_Setup_v1.0.0.exe)
#   3) Portable ZIP archive (installer_output\JazzGuitarPracticeStudio_Portable_v1.0.0_win64.zip)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$version = "1.0.0"

Write-Host "==> [1/4] Compiling standalone JazzGuitarStudio.exe via PyInstaller..." -ForegroundColor Cyan
pyinstaller --noconfirm --clean JazzGuitarStudio.spec
if ($LASTEXITCODE -ne 0) { throw "PyInstaller build failed." }

Write-Host "==> [2/4] Running headless WebView2 smoke test on compiled EXE..." -ForegroundColor Cyan
$exePath = Join-Path $PSScriptRoot "dist\JazzGuitarStudio\JazzGuitarStudio.exe"
$proc = Start-Process -FilePath $exePath -ArgumentList "--smoke-test", "--portable" -Wait -PassThru
Remove-Item -Recurse -Force (Join-Path $PSScriptRoot "dist\JazzGuitarStudio\data") -ErrorAction SilentlyContinue
if ($proc.ExitCode -ne 0) { throw "Smoke test failed with exit code $($proc.ExitCode)" }

New-Item -ItemType Directory -Force -Path (Join-Path $PSScriptRoot "installer_output") | Out-Null

Write-Host "==> [3/4] Creating Portable Win64 ZIP..." -ForegroundColor Cyan
$portableStage = Join-Path $PSScriptRoot "build\portable_stage\JazzGuitarPracticeStudio"
if (Test-Path $portableStage) { Remove-Item -Recurse -Force $portableStage }
New-Item -ItemType Directory -Force -Path $portableStage | Out-Null
Copy-Item -Recurse -Force (Join-Path $PSScriptRoot "dist\JazzGuitarStudio\*") $portableStage
Set-Content -Path (Join-Path $portableStage "portable.txt") -Value "Portable mode enabled: user progress and AI settings are saved in .\data\" -Encoding UTF8

$zipOut = Join-Path $PSScriptRoot "installer_output\JazzGuitarPracticeStudio_Portable_v${version}_win64.zip"
if (Test-Path $zipOut) { Remove-Item -Force $zipOut }
Compress-Archive -Path $portableStage -DestinationPath $zipOut -CompressionLevel Optimal

Write-Host "==> [4/4] Compiling Windows Setup.exe via Inno Setup 6..." -ForegroundColor Cyan
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
    throw "Inno Setup 6 (ISCC.exe) not found. Install via: winget install --id JRSoftware.InnoSetup --scope user"
}

& $iscc (Join-Path $PSScriptRoot "installer.iss")
if ($LASTEXITCODE -ne 0) { throw "Inno Setup compilation failed." }

Write-Host "✓ Release artifacts ready in .\installer_output\" -ForegroundColor Green
Get-ChildItem (Join-Path $PSScriptRoot "installer_output") | Select-Object Name, @{N="SizeMB";E={[math]::Round($_.Length/1MB, 2)}}
