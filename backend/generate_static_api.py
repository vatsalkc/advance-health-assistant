#!/usr/bin/env python3
"""
Generate static API files for GitHub Pages deployment
"""

import os
import json
import pickle
import sqlite3
from datetime import datetime
from werkzeug.security import generate_password_hash

def create_static_api():
    """Create static JSON API files"""
    
    # Create static_api directory
    os.makedirs('static_api', exist_ok=True)
    os.makedirs('static_api/api', exist_ok=True)
    os.makedirs('static_api/api/auth', exist_ok=True)
    os.makedirs('static_api/api/doctors', exist_ok=True)
    os.makedirs('static_api/api/symptoms', exist_ok=True)
    
    # Load ML model
    try:
        with open('disease_model.pkl', 'rb') as f:
            model_data = pickle.load(f)
        print("ML model loaded successfully")
    except Exception as e:
        print(f"Error loading ML model: {e}")
        return
    
    # Create doctors data
    doctors_data = {
        "doctors": [
            {
                "id": 1,
                "name": "Dr. Sarah Johnson",
                "specialization": "Cardiologist",
                "experience": "15 years",
                "rating": 4.8,
                "available": True
            },
            {
                "id": 2,
                "name": "Dr. Michael Chen",
                "specialization": "Neurologist",
                "experience": "12 years",
                "rating": 4.7,
                "available": True
            },
            {
                "id": 3,
                "name": "Dr. Emily Rodriguez",
                "specialization": "Dermatologist",
                "experience": "10 years",
                "rating": 4.9,
                "available": True
            },
            {
                "id": 4,
                "name": "Dr. James Wilson",
                "specialization": "Gastroenterologist",
                "experience": "18 years",
                "rating": 4.6,
                "available": True
            },
            {
                "id": 5,
                "name": "Dr. Lisa Thompson",
                "specialization": "Gynecologist",
                "experience": "14 years",
                "rating": 4.8,
                "available": True
            },
            {
                "id": 6,
                "name": "Dr. Robert Martinez",
                "specialization": "Orthopedic",
                "experience": "20 years",
                "rating": 4.7,
                "available": True
            },
            {
                "id": 7,
                "name": "Dr. Amanda Davis",
                "specialization": "Pediatrician",
                "experience": "8 years",
                "rating": 4.9,
                "available": True
            },
            {
                "id": 8,
                "name": "Dr. David Kim",
                "specialization": "Psychiatrist",
                "experience": "16 years",
                "rating": 4.5,
                "available": True
            },
            {
                "id": 9,
                "name": "Dr. Jennifer Brown",
                "specialization": "Ophthalmologist",
                "experience": "11 years",
                "rating": 4.8,
                "available": True
            },
            {
                "id": 10,
                "name": "Dr. Christopher Lee",
                "specialization": "ENT Specialist",
                "experience": "13 years",
                "rating": 4.6,
                "available": True
            },
            {
                "id": 11,
                "name": "Dr. Maria Garcia",
                "specialization": "Endocrinologist",
                "experience": "17 years",
                "rating": 4.7,
                "available": True
            },
            {
                "id": 12,
                "name": "Dr. Kevin Wang",
                "specialization": "Urologist",
                "experience": "14 years",
                "rating": 4.8,
                "available": True
            },
            {
                "id": 13,
                "name": "Dr. Rachel Green",
                "specialization": "Rheumatologist",
                "experience": "12 years",
                "rating": 4.6,
                "available": True
            },
            {
                "id": 14,
                "name": "Dr. Thomas Anderson",
                "specialization": "Pulmonologist",
                "experience": "19 years",
                "rating": 4.9,
                "available": True
            },
            {
                "id": 15,
                "name": "Dr. Nicole Taylor",
                "specialization": "Nephrologist",
                "experience": "15 years",
                "rating": 4.7,
                "available": True
            }
        ]
    }
    
    # Save doctors data
    with open('static_api/api/doctors.json', 'w') as f:
        json.dump(doctors_data, f, indent=2)
    
    # Create symptoms data
    symptoms_data = {
        "symptoms": model_data['symptom_list']
    }
    
    with open('static_api/api/symptoms/all.json', 'w') as f:
        json.dump(symptoms_data, f, indent=2)
    
    # Create disease prediction data
    disease_data = []
    for _, row in model_data['disease_data'].iterrows():
        disease_info = {
            "disease": row['Disease'],
            "symptoms": [s.strip() for s in row['Symptoms'].split(',')],
            "specialization": row['Specialization'],
            "description": row['Description'],
            "precautions": [p.strip() for p in row['Precautions'].split(',')]
        }
        disease_data.append(disease_info)
    
    with open('static_api/api/diseases.json', 'w') as f:
        json.dump({"diseases": disease_data}, f, indent=2)
    
    # Create sample user data for demo
    demo_users = {
        "demo@healthassistant.com": {
            "id": 1,
            "name": "Demo User",
            "email": "demo@healthassistant.com",
            "password": generate_password_hash("demo123"),
            "phone": "555-0123",
            "age": 30,
            "gender": "male",
            "created_at": "2026-01-01T00:00:00Z"
        }
    }
    
    with open('static_api/api/auth/users.json', 'w') as f:
        json.dump(demo_users, f, indent=2)
    
    # Create index.html for the static API
    index_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Advanced Health Assistant API</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .method { background: #007bff; color: white; padding: 5px 10px; border-radius: 3px; font-size: 12px; }
        code { background: #e9ecef; padding: 2px 5px; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>🏥 Advanced Health Assistant API</h1>
    <p>Static API for the Advanced Health Assistant application.</p>
    
    <h2>Available Endpoints</h2>
    
    <div class="endpoint">
        <span class="method">GET</span>
        <strong>/api/doctors.json</strong>
        <p>Get list of all available doctors with specializations.</p>
    </div>
    
    <div class="endpoint">
        <span class="method">GET</span>
        <strong>/api/symptoms/all.json</strong>
        <p>Get list of all available symptoms for disease prediction.</p>
    </div>
    
    <div class="endpoint">
        <span class="method">GET</span>
        <strong>/api/diseases.json</strong>
        <p>Get comprehensive disease database with symptoms, descriptions, and precautions.</p>
    </div>
    
    <h2>Features</h2>
    <ul>
        <li>✅ <strong>216 Diseases</strong> - Comprehensive medical database</li>
        <li>✅ <strong>613 Symptoms</strong> - Detailed symptom analysis</li>
        <li>✅ <strong>30+ Specializations</strong> - All medical fields covered</li>
        <li>✅ <strong>15+ Doctors</strong> - Sample healthcare providers</li>
        <li>✅ <strong>ML Model Data</strong> - Pre-trained disease prediction</li>
    </ul>
    
    <h2>Usage</h2>
    <p>This static API is designed to work with the Advanced Health Assistant frontend. 
    The frontend will automatically detect and use this static API when no dynamic backend is available.</p>
    
    <h2>GitHub Repository</h2>
    <p><a href="https://github.com/vatsalkc/advance-health-assistant">View Source Code</a></p>
    
    <h2>Live Application</h2>
    <p><a href="https://vatsalkc.github.io/advance-health-assistant/">Try the Live App</a></p>
</body>
</html>"""
    
    with open('static_api/index.html', 'w') as f:
        f.write(index_html)
    
    # Create CORS headers file
    cors_config = """# CORS configuration for GitHub Pages
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
"""
    
    with open('static_api/_headers', 'w') as f:
        f.write(cors_config)
    
    print("Static API files generated successfully!")
    print("Files created:")
    print("- static_api/index.html")
    print("- static_api/api/doctors.json")
    print("- static_api/api/symptoms/all.json")
    print("- static_api/api/diseases.json")
    print("- static_api/api/auth/users.json")
    print("- static_api/_headers")

if __name__ == "__main__":
    create_static_api()