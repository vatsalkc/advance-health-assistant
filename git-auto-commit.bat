@echo off
REM Automatic Git Commit Script for Windows
REM This script will automatically commit and push changes to git

echo ========================================
echo   Auto Git Commit Script
echo ========================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo ERROR: Git repository not initialized!
    echo Please run: git init
    pause
    exit /b 1
)

REM Get current date and time for commit message
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set COMMIT_DATE=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%
set COMMIT_TIME=%datetime:~8,2%:%datetime:~10,2%:%datetime:~12,2%

echo Current Date: %COMMIT_DATE%
echo Current Time: %COMMIT_TIME%
echo.

REM Add all changes
echo [1/4] Adding all changes to git...
git add .

REM Check if there are changes to commit
git diff-index --quiet HEAD --
if %errorlevel% equ 0 (
    echo No changes to commit.
    pause
    exit /b 0
)

REM Commit with automatic message
echo [2/4] Committing changes...
git commit -m "Auto-commit: Medicine reminder notifications added - %COMMIT_DATE% %COMMIT_TIME%"

if %errorlevel% neq 0 (
    echo ERROR: Commit failed!
    pause
    exit /b 1
)

REM Check if remote exists
git remote -v | findstr origin >nul
if %errorlevel% neq 0 (
    echo WARNING: No remote repository configured!
    echo Please add remote: git remote add origin YOUR_REPO_URL
    pause
    exit /b 1
)

REM Push to remote
echo [3/4] Pushing to remote repository...
git push origin main

if %errorlevel% neq 0 (
    echo WARNING: Push failed. Trying 'master' branch...
    git push origin master
    
    if %errorlevel% neq 0 (
        echo ERROR: Push failed!
        echo Please check your remote configuration and try manually.
        pause
        exit /b 1
    )
)

echo [4/4] Success!
echo.
echo ========================================
echo   Changes committed and pushed!
echo ========================================
echo.
pause
