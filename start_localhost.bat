@echo off
title JanSwasthya Setu AI - Localhost Launcher
echo ========================================================
echo        Starting JanSwasthya Setu AI on Localhost
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Starting FastAPI Backend on http://localhost:8000 ...
start "JanSwasthya Backend (Port 8000)" cmd /k "cd /d "%~dp0backend" && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/3] Starting Vite Frontend on http://localhost:5173 ...
start "JanSwasthya Frontend (Port 5173)" cmd /k "cd /d "%~dp0frontend" && npm.cmd run dev -- --host 127.0.0.1 --port 5173"

echo [3/3] Waiting for servers to initialize...
timeout /t 3 /nobreak >nul

echo Opening application in your default browser...
start http://localhost:5173

echo.
echo ========================================================
echo  JanSwasthya Setu AI is now running locally!
echo  - Frontend UI:   http://localhost:5173
echo  - Backend API:   http://localhost:8000
echo  - API Docs:      http://localhost:8000/docs
echo ========================================================
echo Keep the terminal windows open while using the app.
pause
