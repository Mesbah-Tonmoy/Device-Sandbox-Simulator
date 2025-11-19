@echo off
REM Device Sandbox Simulator - Setup Script for Windows
REM This script automates the installation and configuration process

setlocal enabledelayedexpansion

REM Colors (limited in CMD, using simple formatting)
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

cls
echo.
echo ================================================================
echo.
echo        Device Sandbox Simulator - Setup Script (Windows)
echo.
echo ================================================================
echo.

REM Check prerequisites
echo.
echo ----------------------------------------------------------------
echo   Step 1: Checking Prerequisites
echo ----------------------------------------------------------------
echo.

REM Check PHP
where php >nul 2>&1
if %errorlevel% equ 0 (
    for /f "delims=" %%i in ('php -r "echo PHP_VERSION;"') do set PHP_VERSION=%%i
    echo %GREEN%[OK]%NC% PHP installed: v!PHP_VERSION!
) else (
    echo %RED%[ERROR]%NC% PHP is not installed
    echo Please install PHP from https://windows.php.net/download/
    pause
    exit /b 1
)

REM Check MySQL (check XAMPP path first)
set MYSQL_PATH=
set MYSQL_FOUND=0

if exist "C:\xampp\mysql\bin\mysql.exe" (
    set MYSQL_PATH=C:\xampp\mysql\bin
    set MYSQL_FOUND=1
    echo %GREEN%[OK]%NC% MySQL installed (XAMPP detected^)
)

if exist "C:\xampp64\mysql\bin\mysql.exe" (
    if !MYSQL_FOUND! equ 0 (
        set MYSQL_PATH=C:\xampp64\mysql\bin
        set MYSQL_FOUND=1
        echo %GREEN%[OK]%NC% MySQL installed (XAMPP64 detected^)
    )
)

if !MYSQL_FOUND! equ 0 (
    where mysql >nul 2>&1
    if !errorlevel! equ 0 (
        set MYSQL_FOUND=1
        echo %GREEN%[OK]%NC% MySQL installed
    )
)

if !MYSQL_FOUND! equ 0 (
    echo %RED%[ERROR]%NC% MySQL is not installed
    echo Please install XAMPP from https://www.apachefriends.org/
    pause
    exit /b 1
)

REM Add XAMPP MySQL to PATH temporarily if found
if not "!MYSQL_PATH!"=="" (
    set PATH=!MYSQL_PATH!;!PATH!
    echo MySQL path added: !MYSQL_PATH!
)

REM Check Node.js
where node >nul 2>&1
if %errorlevel% equ 0 (
    for /f "delims=" %%i in ('node --version') do set NODE_VERSION=%%i
    echo %GREEN%[OK]%NC% Node.js installed: !NODE_VERSION!
) else (
    echo %RED%[ERROR]%NC% Node.js is not installed
    echo Please install from https://nodejs.org/
    pause
    exit /b 1
)

REM Check npm
where npm >nul 2>&1
if %errorlevel% equ 0 (
    for /f "delims=" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo %GREEN%[OK]%NC% npm installed: v!NPM_VERSION!
) else (
    echo %RED%[ERROR]%NC% npm is not installed
    pause
    exit /b 1
)

timeout /t 2 /nobreak >nul

REM Database setup
echo.
echo ----------------------------------------------------------------
echo   Step 2: Database Setup
echo ----------------------------------------------------------------
echo.

set /p DB_USER="MySQL username [root]: "
if "!DB_USER!"=="" set DB_USER=root

set /p DB_PASS="MySQL password: "

echo.
echo Testing MySQL connection...

REM Test connection (suppress output) - use full path if XAMPP
if not "!MYSQL_PATH!"=="" (
    "!MYSQL_PATH!\mysql.exe" -u!DB_USER! -p!DB_PASS! -e "SELECT 1;" >nul 2>&1
) else (
    mysql -u!DB_USER! -p!DB_PASS! -e "SELECT 1;" >nul 2>&1
)

if %errorlevel% equ 0 (
    echo %GREEN%[OK]%NC% MySQL connection successful
) else (
    echo %RED%[ERROR]%NC% Failed to connect to MySQL
    echo Please check your credentials
    echo.
    echo %YELLOW%[TIP]%NC% Make sure MySQL is running in XAMPP Control Panel
    pause
    exit /b 1
)

REM Create database
echo Creating database 'device_sandbox'...
if not "!MYSQL_PATH!"=="" (
    "!MYSQL_PATH!\mysql.exe" -u!DB_USER! -p!DB_PASS! -e "CREATE DATABASE IF NOT EXISTS device_sandbox CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul
) else (
    mysql -u!DB_USER! -p!DB_PASS! -e "CREATE DATABASE IF NOT EXISTS device_sandbox CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul
)
echo %GREEN%[OK]%NC% Database created

REM Import schema
if exist "database\schema.sql" (
    echo Importing database schema...
    if not "!MYSQL_PATH!"=="" (
        "!MYSQL_PATH!\mysql.exe" -u!DB_USER! -p!DB_PASS! device_sandbox < database\schema.sql 2>nul
    ) else (
        mysql -u!DB_USER! -p!DB_PASS! device_sandbox < database\schema.sql 2>nul
    )
    echo %GREEN%[OK]%NC% Schema imported successfully
) else (
    echo %RED%[ERROR]%NC% schema.sql not found in database directory
    pause
    exit /b 1
)

timeout /t 2 /nobreak >nul

REM Backend configuration
echo.
echo ----------------------------------------------------------------
echo   Step 3: Backend Configuration
echo ----------------------------------------------------------------
echo.

REM Create .env file
if exist "backend\.env.example" (
    echo Creating .env file...
    copy /Y "backend\.env.example" "backend\.env" >nul
    
    REM Update .env with credentials (using PowerShell for regex)
    powershell -Command "(Get-Content 'backend\.env') -replace 'DB_USER=root', 'DB_USER=!DB_USER!' | Set-Content 'backend\.env'"
    powershell -Command "(Get-Content 'backend\.env') -replace 'DB_PASS=your_password_here', 'DB_PASS=!DB_PASS!' | Set-Content 'backend\.env'"
    
    echo %GREEN%[OK]%NC% .env file created and configured
) else (
    echo Creating .env file manually...
    (
        echo DB_HOST=localhost
        echo DB_NAME=device_sandbox
        echo DB_USER=!DB_USER!
        echo DB_PASS=!DB_PASS!
        echo DB_CHARSET=utf8mb4
        echo ENV=development
        echo DEBUG=true
    ) > backend\.env
    echo %GREEN%[OK]%NC% .env file created
)

REM Detect XAMPP/WAMP installation
set XAMPP_ROOT=
if exist "C:\xampp\htdocs" (
    set XAMPP_ROOT=C:\xampp\htdocs
    echo Detected XAMPP at: !XAMPP_ROOT!
) else if exist "C:\wamp64\www" (
    set XAMPP_ROOT=C:\wamp64\www
    echo Detected WAMP at: !XAMPP_ROOT!
) else if exist "C:\wamp\www" (
    set XAMPP_ROOT=C:\wamp\www
    echo Detected WAMP at: !XAMPP_ROOT!
) else (
    echo %YELLOW%[WARNING]%NC% Could not detect XAMPP/WAMP installation
    set /p XAMPP_ROOT="Enter Apache document root path (e.g., C:\xampp\htdocs): "
)

if "!XAMPP_ROOT!"=="" (
    echo %RED%[ERROR]%NC% Apache document root not specified
    pause
    exit /b 1
)

REM Copy backend to Apache directory
echo Copying backend to Apache directory...
set TARGET_DIR=!XAMPP_ROOT!\device-sandbox-simulator\backend

if not exist "!TARGET_DIR!" mkdir "!TARGET_DIR!"

xcopy /E /I /Y "backend\*" "!TARGET_DIR!\" >nul
echo %GREEN%[OK]%NC% Backend files copied to !TARGET_DIR!

timeout /t 2 /nobreak >nul

REM Frontend setup
echo.
echo ----------------------------------------------------------------
echo   Step 4: Frontend Setup
echo ----------------------------------------------------------------
echo.

cd frontend

echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% Failed to install dependencies
    pause
    exit /b 1
)
echo %GREEN%[OK]%NC% Dependencies installed

REM Update API URL
echo Configuring API URL...
set API_URL=http://localhost/device-sandbox-simulator/backend/api

if exist "src\utils\constants.ts" (
    powershell -Command "(Get-Content 'src\utils\constants.ts') -replace 'export const API_BASE_URL = .*', 'export const API_BASE_URL = ''!API_URL!'';' | Set-Content 'src\utils\constants.ts'"
    echo %GREEN%[OK]%NC% API URL configured: !API_URL!
) else (
    echo %YELLOW%[WARNING]%NC% constants.ts not found
    echo Please update API_BASE_URL manually
)

cd ..

timeout /t 2 /nobreak >nul

REM Verification
echo.
echo ----------------------------------------------------------------
echo   Step 5: Verification
echo ----------------------------------------------------------------
echo.

set BACKEND_URL=http://localhost/device-sandbox-simulator/backend/api/devices/get.php

echo Testing backend API...
echo URL: !BACKEND_URL!
echo.
echo %YELLOW%[INFO]%NC% Please open this URL in your browser to verify backend is working
echo.

REM Final message
echo.
echo ================================================================
echo   Setup Complete! 
echo ================================================================
echo.
echo Your Device Sandbox Simulator is ready!
echo.
echo Next steps:
echo.
echo 1. Start XAMPP/WAMP Apache and MySQL services
echo.
echo 2. Start the frontend development server:
echo    cd frontend
echo    npm run dev
echo.
echo 3. Open your browser:
echo    http://localhost:5173
echo.
echo 4. Backend API is available at:
echo    !BACKEND_URL!
echo.
echo 5. Test the application:
echo    - Drag a Light or Fan to the canvas
echo    - Adjust device settings
echo    - Save a preset
echo    - Refresh the page to verify persistence
echo.
echo For troubleshooting, see README.md
echo.
pause