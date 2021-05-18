' This basic program runs the script clear.cmd hidden from the user

Set WshShell = CreateObject("WScript.Shell") 
WshShell.Run chr(34) & "C:\Users\rashed696\Docs\Webb\Webb-Slutproj-Real\JS\clear.cmd" & Chr(34), 0
Set WshShell = Nothing
