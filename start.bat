@echo off
setlocal enabledelayedexpansion

echo ==================================================
echo         MotoHub Auto-Start Script                 
echo ==================================================

:: Extract the IP address using PowerShell (filters out loopback and grabs LAN IP)
echo [1/4] Finding Local IP Address...
for /f "delims=" %%i in ('powershell -NoProfile -Command "(Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch 'Loopback' -and $_.IPAddress -match '^(192\.168|10\.|172\.(1[6-9]|2[0-9]|3[0-1]))' } | Select-Object -First 1).IPAddress"') do set LOCAL_IP=%%i

if "%LOCAL_IP%"=="" (
    echo [ERROR] Could not detect a valid LAN IP Address.
    pause
    exit /b
)

echo       - IP Address found: %LOCAL_IP%

:: Update the api.ts file
echo [2/4] Updating API configuration...
set API_FILE=frontend\constants\api.ts
powershell -NoProfile -Command "(Get-Content '%API_FILE%') -replace 'const DEFAULT_LOCAL_URL = .*;', 'const DEFAULT_LOCAL_URL = ''http://%LOCAL_IP%:5000'';' | Set-Content '%API_FILE%'"
echo       - frontend/constants/api.ts updated successfully.

:: Start Backend
echo [3/4] Starting Backend Server in a new window...
start "MotoHub Backend Server" cmd /k "cd backend && npm run dev"

:: Start Frontend
echo [4/4] Starting Frontend Expo Server...
cd frontend
npx expo start
