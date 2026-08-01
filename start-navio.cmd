@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 20 or newer is required.
  echo Download it from https://nodejs.org/
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing Navio...
  call npm install
  if errorlevel 1 goto :error
)

if not exist .env.local (
  echo First-time setup
  call npm run setup
  if errorlevel 1 goto :error
)

start "" http://localhost:3000
echo Starting Navio...
call npm run dev
exit /b %errorlevel%

:error
echo.
echo Navio could not start. Review the message above, then try again.
pause
exit /b 1
