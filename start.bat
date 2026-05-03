@echo off
title Vehicle Service App

echo ================================================
echo   Vehicle Service App - Starting...
echo ================================================
echo.

:: Start backend in a new window
echo [1/2] Starting Backend (Node.js + Express)...
start "Backend - Vehicle Service" cmd /k "cd /d %~dp0backend && npm run dev"

:: Give backend a moment to boot
timeout /t 3 /nobreak >nul

:: Start frontend in a new window
echo [2/2] Starting Frontend (Expo)...
start "Frontend - Vehicle Service" cmd /k "cd /d %~dp0frontend && npx expo start"

echo.
echo ================================================
echo   Both servers are starting in separate windows.
echo   Scan the QR code in the Expo window to open
echo   the app on your phone using Expo Go.
echo ================================================
echo.
pause
