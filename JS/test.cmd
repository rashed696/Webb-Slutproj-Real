@echo off
setLocal
set file = "out.txt"


:loop
tasklist /FI "IMAGENAME eq electron.exe" 2>NUL | find /I /N "electron.exe">NUL
if "%ERRORLEVEL%"=="1" GOTO :stop

wmic cpu get loadpercentage >> out.txt

TIMEOUT 1
GOTO :loop

:stop
exit



