@echo off
echo Starting ChatPot Application...
cd %~dp0

:: Check if backend has node modules, if not install them
if not exist "backend\node_modules\" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

:: Ensure a token is set if required
if not exist "backend\.env" (
    echo NOTE: No .env file found in backend. Creating one from .env.example.
    echo Please edit backend\.env to add your Hugging Face Token if the HF Space requires it.
    copy "backend\.env.example" "backend\.env" > nul
)

:: Start Backend server
echo Starting Backend Server...
start "ChatPot Backend API" cmd /c "cd backend && node server.js"

:: Give it a few seconds to start
timeout /t 3 > nul

:: Open frontend in default browser
echo Opening Frontend GUI...
start "" "frontend\index.html"

echo Both Frontend and Backend started!
exit
