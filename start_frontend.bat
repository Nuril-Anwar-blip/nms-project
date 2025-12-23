@echo off
echo Starting NMS Frontend...
cd frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Run the development server
echo Starting Vite development server...
call npm run dev

pause

