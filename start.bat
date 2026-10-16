@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul || (echo Can cai Node.js 18+ tai https://nodejs.org & pause & exit /b)
if not exist node_modules (echo Dang cai dat thu vien... & call npm install)
rem Khong luu mat khau trong file. Nhap khi chay (de trong = tat trang /admin).
if "%ADMIN_PASS%"=="" set /p ADMIN_PASS=Mat khau trang quan tri /admin (Enter de bo qua): 
if not "%ADMIN_PASS%"=="" if "%ADMIN_USER%"=="" set ADMIN_USER=admin
start "" http://localhost:3000
node server.js
pause
