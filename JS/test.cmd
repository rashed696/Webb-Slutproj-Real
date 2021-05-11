@echo off
setLocal
set file = "out.txt"
set maxBytesize = 1000
echo "" > out.txt

:loop
tasklist /FI "IMAGENAME eq electron.exe" 2>NUL | find /I /N "electron.exe">NUL
if "%ERRORLEVEL%"=="1" GOTO :stop
FOR /F "usebackq" %%A IN ('%file%') DO set size=%%~zA
IF %size% LSS %maxBytesize% (GOTO :clear)


wmic cpu get loadpercentage >> out.txt

TIMEOUT 0.5
GOTO :loop


:clear
 > out.txt

:stop
exit



