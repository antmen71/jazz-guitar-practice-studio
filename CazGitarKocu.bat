@echo off
cd /d "%~dp0"
if exist "%LOCALAPPDATA%\Programs\Python\Python312\pythonw.exe" (
    start "" "%LOCALAPPDATA%\Programs\Python\Python312\pythonw.exe" "%~dp0app.py"
) else (
    start "" pythonw.exe "%~dp0app.py"
)
