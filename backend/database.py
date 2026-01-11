from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db():
    """Initialize database and create tables"""
    db.create_all()
    seed_doctors()

def seed_doctors():
    """Seed initial doctors data"""
    from models import Doctor
    
    # Check if doctors already exist
    if Doctor.query.first():
        return
    
    doctors_data = [
        # General Physicians
        {'name': 'Dr. John Smith', 'specialization': 'General Physician', 'experience': '10 years', 'rating': 4.5},
        {'name': 'Dr. Emily Davis', 'specialization': 'General Physician', 'experience': '8 years', 'rating': 4.7},
        {'name': 'Dr. Robert Wilson', 'specialization': 'General Physician', 'experience': '15 years', 'rating': 4.6},
        
        # Cardiologists
        {'name': 'Dr. Sarah Johnson', 'specialization': 'Cardiologist', 'experience': '12 years', 'rating': 4.8},
        {'name': 'Dr. Michael Brown', 'specialization': 'Cardiologist', 'experience': '14 years', 'rating': 4.9},
        {'name': 'Dr. Lisa Anderson', 'specialization': 'Cardiologist', 'experience': '10 years', 'rating': 4.7},
        
        # Dermatologists
        {'name': 'Dr. James Taylor', 'specialization': 'Dermatologist', 'experience': '9 years', 'rating': 4.6},
        {'name': 'Dr. Patricia Martinez', 'specialization': 'Dermatologist', 'experience': '11 years', 'rating': 4.8},
        {'name': 'Dr. David Garcia', 'specialization': 'Dermatologist', 'experience': '7 years', 'rating': 4.5},
        
        # Neurologists
        {'name': 'Dr. Jennifer Lee', 'specialization': 'Neurologist', 'experience': '13 years', 'rating': 4.9},
        {'name': 'Dr. Christopher White', 'specialization': 'Neurologist', 'experience': '16 years', 'rating': 4.8},
        
        # Orthopedic
        {'name': 'Dr. Daniel Harris', 'specialization': 'Orthopedic', 'experience': '11 years', 'rating': 4.7},
        {'name': 'Dr. Nancy Clark', 'specialization': 'Orthopedic', 'experience': '9 years', 'rating': 4.6},
        
        # Pediatricians
        {'name': 'Dr. Karen Lewis', 'specialization': 'Pediatrician', 'experience': '10 years', 'rating': 4.8},
        {'name': 'Dr. Steven Walker', 'specialization': 'Pediatrician', 'experience': '12 years', 'rating': 4.7},
    ]
    
    for doctor_data in doctors_data:
        doctor = Doctor(**doctor_data)
        db.session.add(doctor)
    
    db.session.commit()
    print(f"Seeded {len(doctors_data)} doctors")
