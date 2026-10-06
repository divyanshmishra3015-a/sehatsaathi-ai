@echo off
title JanSwasthya Setu AI - Stop Local Servers
echo ========================================================
echo        Stopping JanSwasthya Setu AI Localhost Servers
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
echo JanSwasthya Setu AI localhost servers have been stopped.
timeout /t 2 /nobreak >nul
