@echo off
title Project Control Hub
cd /d "%~dp0"

rem 1) Portabel Node i appens mapp (ingen installation/adminratt kravs)
if exist "%~dp0node\node.exe" (
  "%~dp0node\node.exe" server\server.js --open
  goto :end
)

rem 2) Installerad Node
where node >nul 2>nul
if %errorlevel%==0 (
  node server\server.js --open
  goto :end
)

echo.
echo  Node.js hittades inte.
echo.
echo  Utan adminratt: ladda ner "Windows Binary (.zip)" fran https://nodejs.org/en/download
echo  packa upp den och dopa om mappen till "node" har i appens mapp:
echo     %~dp0node\node.exe
echo.
echo  Med adminratt: installera LTS fran https://nodejs.org
echo.

:end
pause
