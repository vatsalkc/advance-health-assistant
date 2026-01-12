#!/usr/bin/env python3
"""
Main entry point for Advanced Health Assistant Backend
Railway deployment entry point
"""

import os
import sys
import subprocess

# Add backend directory to Python path
backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_dir)

def setup_and_run():
    """Setup database, train model, and run the app"""
    print("Advanced Health Assistant - Starting deployment...")
    
    # Change to backend directory
    os.chdir(backend_dir)
    
    try:
        # Setup database and train ML model
        print("Setting up database and training ML model...")
        from create_model import main as setup_model
        setup_model()
        
        # Import and run the Flask app
        print("Starting Flask application...")
        from app import app
        
        # Get port from environment (Railway sets this)
        port = int(os.environ.get('PORT', 5000))
        app.run(host='0.0.0.0', port=port, debug=False)
        
    except Exception as e:
        print(f"Error during setup: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    setup_and_run()