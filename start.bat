@echo off
cd /d "%~dp0"
cls
echo.
echo ========================================
echo           NEXORA AI SERVER
echo ========================================
echo.
echo Stopping old NEXORA/Node process...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 /nobreak >nul
echo Starting NEXORA...
node server.mjs
pause
