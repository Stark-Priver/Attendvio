@echo off
echo =====================================
echo   Attendvio Backend Setup Script
echo =====================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.10 or higher from python.org
    pause
    exit /b 1
)

echo [1/8] Creating virtual environment...
python -m venv venv
if %errorlevel% neq 0 (
    echo [ERROR] Failed to create virtual environment
    pause
    exit /b 1
)

echo [2/8] Activating virtual environment...
call venv\Scripts\activate.bat

echo [3/8] Upgrading pip...
python -m pip install --upgrade pip

echo [4/8] Installing dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [5/8] Checking for .env file...
if not exist .env (
    echo .env file not found. Copying from .env.example...
    copy .env.example .env
    echo.
    echo [IMPORTANT] Please edit .env file with your database credentials!
    echo.
)

echo [6/8] Running migrations...
python manage.py makemigrations
python manage.py migrate
if %errorlevel% neq 0 (
    echo [ERROR] Migration failed. Check database connection.
    pause
    exit /b 1
)

echo [7/8] Creating logs directory...
if not exist logs mkdir logs

echo [8/8] Setup complete!
echo.
echo =====================================
echo   Setup Complete!
echo =====================================
echo.
echo Next steps:
echo   1. Edit .env file with your database credentials
echo   2. Create a superuser: python manage.py createsuperuser
echo   3. Run the server: python manage.py runserver
echo.
echo To activate the virtual environment later:
echo   venv\Scripts\activate
echo.
pause
