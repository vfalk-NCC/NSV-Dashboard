@echo off
title Project Control Hub
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js saknas. Installera fran https://nodejs.org och forsok igen. & pause & exit /b 1)
node server\server.js --open
pause
