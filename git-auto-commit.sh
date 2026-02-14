#!/bin/bash
# Automatic Git Commit Script for Linux/Mac
# This script will automatically commit and push changes to git

echo "========================================"
echo "   Auto Git Commit Script"
echo "========================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "ERROR: Git repository not initialized!"
    echo "Please run: git init"
    exit 1
fi

# Get current date and time for commit message
COMMIT_DATE=$(date +"%Y-%m-%d")
COMMIT_TIME=$(date +"%H:%M:%S")

echo "Current Date: $COMMIT_DATE"
echo "Current Time: $COMMIT_TIME"
echo ""

# Add all changes
echo "[1/4] Adding all changes to git..."
git add .

# Check if there are changes to commit
if git diff-index --quiet HEAD --; then
    echo "No changes to commit."
    exit 0
fi

# Commit with automatic message
echo "[2/4] Committing changes..."
git commit -m "Auto-commit: Medicine reminder notifications added - $COMMIT_DATE $COMMIT_TIME"

if [ $? -ne 0 ]; then
    echo "ERROR: Commit failed!"
    exit 1
fi

# Check if remote exists
if ! git remote -v | grep -q origin; then
    echo "WARNING: No remote repository configured!"
    echo "Please add remote: git remote add origin YOUR_REPO_URL"
    exit 1
fi

# Push to remote
echo "[3/4] Pushing to remote repository..."
git push origin main

if [ $? -ne 0 ]; then
    echo "WARNING: Push failed. Trying 'master' branch..."
    git push origin master
    
    if [ $? -ne 0 ]; then
        echo "ERROR: Push failed!"
        echo "Please check your remote configuration and try manually."
        exit 1
    fi
fi

echo "[4/4] Success!"
echo ""
echo "========================================"
echo "   Changes committed and pushed!"
echo "========================================"
echo ""
