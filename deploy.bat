@echo off
REM Deploy script for Health Assistant to GitHub Pages (Windows)

echo 🚀 Starting deployment process...

REM Build the project
echo 📦 Building production version...
call npm run build

REM Check if build was successful
if %errorlevel% equ 0 (
    echo ✅ Build successful!
    
    REM Deploy to GitHub Pages using gh-pages branch
    echo 🌐 Deploying to GitHub Pages...
    
    REM Install gh-pages if not already installed
    call npm install --save-dev gh-pages
    
    REM Deploy
    call npx gh-pages -d build
    
    echo 🎉 Deployment complete!
    echo Your site will be available at: https://vatsalkc.github.io/advance-health-assistant/
) else (
    echo ❌ Build failed! Please fix errors and try again.
    exit /b 1
)
