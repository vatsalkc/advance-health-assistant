#!/bin/bash

# Deploy script for Health Assistant to GitHub Pages

echo "🚀 Starting deployment process..."

# Build the project
echo "📦 Building production version..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to GitHub Pages using gh-pages branch
    echo "🌐 Deploying to GitHub Pages..."
    
    # Install gh-pages if not already installed
    npm install --save-dev gh-pages
    
    # Deploy
    npx gh-pages -d build
    
    echo "🎉 Deployment complete!"
    echo "Your site will be available at: https://vatsalkc.github.io/advance-health-assistant/"
else
    echo "❌ Build failed! Please fix errors and try again."
    exit 1
fi
