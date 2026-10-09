@echo off
REM RAG Reliability Lab - Stop All Servers

echo ========================================
echo RAG Reliability Lab - Stopping Servers
echo ========================================
echo.

echo Stopping Backend Server (Port 8000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul

echo Stopping Frontend Server (Port 3000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul

echo.
echo All servers stopped.
echo.
pause
