@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is needed to run OpenCanvas on this computer.
  echo Install Node.js 24 or later from https://nodejs.org/
  echo Or open the online app: https://mobming.github.io/opencanvas/
  pause
  exit /b 1
)
echo OpenCanvas will be available at http://127.0.0.1:4173/
echo Keep this window open while using the local app.
node server.mjs
if errorlevel 1 pause
