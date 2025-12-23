@echo off
echo Starting NMS Backend...
cd backend_python

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies if needed
echo Installing dependencies...
pip install -r requirements.txt

REM Check if .env exists
if not exist ".env" (
    echo Creating .env file from example...
    copy .env.example .env
    echo.
    echo WARNING: Please update .env file with your database credentials!
    echo.
)

REM Run the application
echo Starting FastAPI server...
python run.py

pause

