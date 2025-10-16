@echo off
echo Dizitup Project Setup Script
echo ===========================

REM Check if Node.js is installed
echo Checking for Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

REM Check if npm is installed
echo Checking for npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo npm is not installed. Please install Node.js from https://nodejs.org/ which includes npm
    pause
    exit /b
)

echo Node.js and npm are installed.

REM Install project dependencies
echo Installing project dependencies...
npm install

if %errorlevel% neq 0 (
    echo Failed to install dependencies. Please check your internet connection and try again.
    pause
    exit /b
)

echo Dependencies installed successfully!

REM Create a start script for development
echo Creating start script...
echo npm run dev > start.bat

echo Setup complete!
echo To start the development server, run "start.bat" or execute "npm run dev" in the terminal
echo Press any key to exit...
pause >nul