' This basic program runs the script test.cmd hidden from the user

Set WshShell = CreateObject("WScript.Shell") 
WshShell.Run chr(34) & "C:\Users\rashed696\Docs\Webb\Webb-Slutproj-Real\JS\test.cmd" & Chr(34), 0
Set WshShell = Nothing
