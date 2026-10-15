@echo off
title JanSwasthya Setu AI - Localhost Launcher
echo ========================================================
echo        Starting JanSwasthya Setu AI on Localhost
echo ========================================================
echo.

cd /d "%~dp0"

:: Clear any stale processes holding port 8000 or 5173
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1

echo [1/3] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "JanSwasthya Backend (Port 8000)" cmd /k "cd /d "%~dp0backend" && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/3] Starting Vite Frontend on http://localhost:5173 ...
start "JanSwasthya Frontend (Port 5173)" cmd /k "cd /d "%~dp0frontend" && npm.cmd run dev"

echo [3/3] Waiting for servers to initialize...
timeout /t 3 /nobreak >nul

echo Opening application in your default browser...
start http://localhost:5173

echo.
echo ========================================================
echo  JanSwasthya Setu AI is now running locally!
echo  - Frontend UI:   http://localhost:5173
echo  - Backend API:   http://127.0.0.1:8000
echo  - API Docs:      http://127.0.0.1:8000/docs
echo ========================================================
echo Keep the terminal windows open while using the app.
pause
