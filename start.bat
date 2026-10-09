@echo off
REM RAG Reliability Lab - Complete Startup Script for Windows

echo ========================================
echo RAG Reliability Lab - Starting System
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "backend\.venv\" (
    echo [ERROR] Virtual environment not found!
    echo Please run setup.bat first to install dependencies.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "frontend\node_modules\" (
    echo [ERROR] Node modules not found!
    echo Please run setup.bat first to install dependencies.
    pause
    exit /b 1
)

echo [1/3] Starting Backend Server...
start "RAG Backend" cmd /k "cd backend && .venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"
timeout /t 3 /nobreak > nul

echo [2/3] Starting Frontend Server...
start "RAG Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak > nul

echo [3/3] Waiting for servers to start...
timeout /t 5 /nobreak > nul

echo.
echo ========================================
echo System Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press Ctrl+C in each window to stop servers.
echo.
pause
