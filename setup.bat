@echo off
REM RAG Reliability Lab - Setup Script for Windows

echo ========================================
echo RAG Reliability Lab - Initial Setup
echo ========================================
echo.

echo [1/4] Setting up Python Backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist ".venv\" (
    echo Creating virtual environment...
    python -m venv .venv
) else (
    echo Virtual environment already exists.
)

REM Activate and install dependencies
echo Installing Python dependencies...
call .venv\Scripts\activate.bat
pip install --upgrade pip
pip install -r requirements.txt
pip install -r requirements-optional.txt

echo.
echo [2/4] Running Backend Tests...
pytest

cd ..

echo.
echo [3/4] Setting up Frontend...
cd frontend

REM Install npm dependencies
if not exist "node_modules\" (
    echo Installing npm dependencies...
    npm install
) else (
    echo npm dependencies already installed.
)

cd ..

echo.
echo [4/4] Creating environment file...
if not exist ".env" (
    copy .env.example .env
    echo .env file created from .env.example
) else (
    echo .env file already exists.
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application, run: start.bat
echo.
pause
