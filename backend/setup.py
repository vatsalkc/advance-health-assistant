#!/usr/bin/env python3
"""
Setup script for Advanced Health Assistant Backend
"""

import os
import sys
import subprocess

def install_requirements():
    """Install Python requirements"""
    print("Installing Python requirements...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

def setup_database_and_model():
    """Setup database and train ML model"""
    print("Setting up database and training ML model...")
    subprocess.check_call([sys.executable, "create_model.py"])

def main():
    """Main setup function"""
    print("Setting up Advanced Health Assistant Backend...")
    
    # Change to backend directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    try:
        install_requirements()
        setup_database_and_model()
        print("Setup completed successfully!")
        print("Starting the application...")
        subprocess.check_call([sys.executable, "app.py"])
    except subprocess.CalledProcessError as e:
        print(f"Setup failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()