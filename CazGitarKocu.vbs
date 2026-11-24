Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")
appDir = fso.GetParentFolderName(WScript.ScriptFullName)
pyw = shell.ExpandEnvironmentStrings("%LOCALAPPDATA%\Programs\Python\Python312\pythonw.exe")
If Not fso.FileExists(pyw) Then
    pyw = "pythonw.exe"
End If
cmd = """" & pyw & """ """ & appDir & "\app.py"""
shell.CurrentDirectory = appDir
shell.Run cmd, 0, False
