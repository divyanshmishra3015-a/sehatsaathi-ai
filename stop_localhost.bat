@echo off
title SehatSaathi AI - Stop Local Servers
echo ========================================================
echo        Stopping SehatSaathi AI Localhost Servers
echo ========================================================
echo.

echo Stopping processes on port 8000 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo Stopping processes on port 5173 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo Localhost servers have been stopped.
timeout /t 2 /nobreak >nul
