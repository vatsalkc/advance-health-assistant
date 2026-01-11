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
        {'name': 'Dr. Amanda Rodriguez', 'specialization': 'Neurologist', 'experience': '9 years', 'rating': 4.7},
        
        # Orthopedic
        {'name': 'Dr. Daniel Harris', 'specialization': 'Orthopedic', 'experience': '11 years', 'rating': 4.7},
        {'name': 'Dr. Nancy Clark', 'specialization': 'Orthopedic', 'experience': '9 years', 'rating': 4.6},
        {'name': 'Dr. Kevin Thompson', 'specialization': 'Orthopedic', 'experience': '14 years', 'rating': 4.8},
        
        # Psychiatrists
        {'name': 'Dr. Karen Lewis', 'specialization': 'Psychiatrist', 'experience': '10 years', 'rating': 4.8},
        {'name': 'Dr. Steven Walker', 'specialization': 'Psychiatrist', 'experience': '12 years', 'rating': 4.7},
        {'name': 'Dr. Michelle Adams', 'specialization': 'Psychiatrist', 'experience': '8 years', 'rating': 4.6},
        
        # Pulmonologists
        {'name': 'Dr. Richard Moore', 'specialization': 'Pulmonologist', 'experience': '15 years', 'rating': 4.9},
        {'name': 'Dr. Susan Miller', 'specialization': 'Pulmonologist', 'experience': '11 years', 'rating': 4.7},
        {'name': 'Dr. Thomas Jackson', 'specialization': 'Pulmonologist', 'experience': '13 years', 'rating': 4.8},
        
        # Endocrinologists
        {'name': 'Dr. Maria Gonzalez', 'specialization': 'Endocrinologist', 'experience': '12 years', 'rating': 4.8},
        {'name': 'Dr. Paul Anderson', 'specialization': 'Endocrinologist', 'experience': '10 years', 'rating': 4.6},
        {'name': 'Dr. Linda Wilson', 'specialization': 'Endocrinologist', 'experience': '14 years', 'rating': 4.9},
        
        # Gastroenterologists
        {'name': 'Dr. Mark Davis', 'specialization': 'Gastroenterologist', 'experience': '11 years', 'rating': 4.7},
        {'name': 'Dr. Helen Brown', 'specialization': 'Gastroenterologist', 'experience': '9 years', 'rating': 4.5},
        {'name': 'Dr. Robert Taylor', 'specialization': 'Gastroenterologist', 'experience': '16 years', 'rating': 4.8},
        
        # Urologists
        {'name': 'Dr. Charles Martinez', 'specialization': 'Urologist', 'experience': '13 years', 'rating': 4.8},
        {'name': 'Dr. Barbara Johnson', 'specialization': 'Urologist', 'experience': '10 years', 'rating': 4.6},
        {'name': 'Dr. William Garcia', 'specialization': 'Urologist', 'experience': '12 years', 'rating': 4.7},
        
        # Gynecologists
        {'name': 'Dr. Jennifer Smith', 'specialization': 'Gynecologist', 'experience': '11 years', 'rating': 4.8},
        {'name': 'Dr. Mary Rodriguez', 'specialization': 'Gynecologist', 'experience': '9 years', 'rating': 4.6},
        {'name': 'Dr. Lisa Thompson', 'specialization': 'Gynecologist', 'experience': '14 years', 'rating': 4.9},
        
        # Ophthalmologists
        {'name': 'Dr. David Lee', 'specialization': 'Ophthalmologist', 'experience': '12 years', 'rating': 4.7},
        {'name': 'Dr. Sarah White', 'specialization': 'Ophthalmologist', 'experience': '8 years', 'rating': 4.5},
        {'name': 'Dr. Michael Clark', 'specialization': 'Ophthalmologist', 'experience': '15 years', 'rating': 4.8},
        
        # ENT Specialists
        {'name': 'Dr. Patricia Adams', 'specialization': 'ENT Specialist', 'experience': '10 years', 'rating': 4.6},
        {'name': 'Dr. James Wilson', 'specialization': 'ENT Specialist', 'experience': '13 years', 'rating': 4.8},
        {'name': 'Dr. Karen Miller', 'specialization': 'ENT Specialist', 'experience': '9 years', 'rating': 4.7},
        
        # Rheumatologists
        {'name': 'Dr. Steven Davis', 'specialization': 'Rheumatologist', 'experience': '11 years', 'rating': 4.7},
        {'name': 'Dr. Nancy Martinez', 'specialization': 'Rheumatologist', 'experience': '14 years', 'rating': 4.8},
        {'name': 'Dr. Daniel Brown', 'specialization': 'Rheumatologist', 'experience': '8 years', 'rating': 4.5},
        
        # Oncologists
        {'name': 'Dr. Michelle Johnson', 'specialization': 'Oncologist', 'experience': '15 years', 'rating': 4.9},
        {'name': 'Dr. Robert Garcia', 'specialization': 'Oncologist', 'experience': '12 years', 'rating': 4.8},
        {'name': 'Dr. Linda Rodriguez', 'specialization': 'Oncologist', 'experience': '10 years', 'rating': 4.7},
        
        # Nephrologists
        {'name': 'Dr. Thomas Lee', 'specialization': 'Nephrologist', 'experience': '13 years', 'rating': 4.8},
        {'name': 'Dr. Susan Thompson', 'specialization': 'Nephrologist', 'experience': '11 years', 'rating': 4.6},
        {'name': 'Dr. Paul White', 'specialization': 'Nephrologist', 'experience': '9 years', 'rating': 4.7},
        
        # Allergists
        {'name': 'Dr. Maria Clark', 'specialization': 'Allergist', 'experience': '10 years', 'rating': 4.6},
        {'name': 'Dr. Charles Adams', 'specialization': 'Allergist', 'experience': '12 years', 'rating': 4.8},
        {'name': 'Dr. Helen Wilson', 'specialization': 'Allergist', 'experience': '8 years', 'rating': 4.5},
        
        # Vascular Surgeons
        {'name': 'Dr. William Miller', 'specialization': 'Vascular Surgeon', 'experience': '14 years', 'rating': 4.9},
        {'name': 'Dr. Barbara Davis', 'specialization': 'Vascular Surgeon', 'experience': '11 years', 'rating': 4.7},
        {'name': 'Dr. Mark Martinez', 'specialization': 'Vascular Surgeon', 'experience': '16 years', 'rating': 4.8},
        
        # Neurosurgeons
        {'name': 'Dr. Jennifer Brown', 'specialization': 'Neurosurgeon', 'experience': '18 years', 'rating': 4.9},
        {'name': 'Dr. David Johnson', 'specialization': 'Neurosurgeon', 'experience': '15 years', 'rating': 4.8},
        {'name': 'Dr. Lisa Garcia', 'specialization': 'Neurosurgeon', 'experience': '12 years', 'rating': 4.7},
        
        # General Surgeons
        {'name': 'Dr. Robert Rodriguez', 'specialization': 'General Surgeon', 'experience': '13 years', 'rating': 4.8},
        {'name': 'Dr. Mary Lee', 'specialization': 'General Surgeon', 'experience': '10 years', 'rating': 4.6},
        {'name': 'Dr. Steven Thompson', 'specialization': 'General Surgeon', 'experience': '15 years', 'rating': 4.9},
        
        # Hematologists
        {'name': 'Dr. Rachel Green', 'specialization': 'Hematologist', 'experience': '12 years', 'rating': 4.8},
        {'name': 'Dr. Andrew Mitchell', 'specialization': 'Hematologist', 'experience': '14 years', 'rating': 4.7},
        {'name': 'Dr. Sarah Cooper', 'specialization': 'Hematologist', 'experience': '10 years', 'rating': 4.6},
        
        # Infectious Disease Specialists
        {'name': 'Dr. Michael Turner', 'specialization': 'Infectious Disease Specialist', 'experience': '15 years', 'rating': 4.9},
        {'name': 'Dr. Emily Foster', 'specialization': 'Infectious Disease Specialist', 'experience': '11 years', 'rating': 4.7},
        {'name': 'Dr. James Parker', 'specialization': 'Infectious Disease Specialist', 'experience': '13 years', 'rating': 4.8},
        
        # Pediatricians
        {'name': 'Dr. Lisa Chen', 'specialization': 'Pediatrician', 'experience': '9 years', 'rating': 4.6},
        {'name': 'Dr. Robert Kim', 'specialization': 'Pediatrician', 'experience': '12 years', 'rating': 4.8},
        {'name': 'Dr. Amanda Walsh', 'specialization': 'Pediatrician', 'experience': '8 years', 'rating': 4.5},
        
        # Geriatricians
        {'name': 'Dr. William Hayes', 'specialization': 'Geriatrician', 'experience': '16 years', 'rating': 4.9},
        {'name': 'Dr. Margaret Stone', 'specialization': 'Geriatrician', 'experience': '14 years', 'rating': 4.7},
        {'name': 'Dr. Thomas Reed', 'specialization': 'Geriatrician', 'experience': '11 years', 'rating': 4.6},
        
        # Additional Specialists for comprehensive coverage
        # Sports Medicine Specialists
        {'name': 'Dr. Alex Morgan', 'specialization': 'Sports Medicine Specialist', 'experience': '10 years', 'rating': 4.7},
        {'name': 'Dr. Jessica Taylor', 'specialization': 'Sports Medicine Specialist', 'experience': '8 years', 'rating': 4.5},
        
        # Pain Management Specialists
        {'name': 'Dr. Christopher Lee', 'specialization': 'Pain Management Specialist', 'experience': '12 years', 'rating': 4.8},
        {'name': 'Dr. Maria Santos', 'specialization': 'Pain Management Specialist', 'experience': '9 years', 'rating': 4.6},
        
        # Emergency Medicine Specialists
        {'name': 'Dr. David Emergency', 'specialization': 'Emergency Medicine Specialist', 'experience': '11 years', 'rating': 4.7},
        {'name': 'Dr. Sarah Trauma', 'specialization': 'Emergency Medicine Specialist', 'experience': '13 years', 'rating': 4.8},
        
        # Anesthesiologists
        {'name': 'Dr. Robert Sleep', 'specialization': 'Anesthesiologist', 'experience': '15 years', 'rating': 4.9},
        {'name': 'Dr. Linda Comfort', 'specialization': 'Anesthesiologist', 'experience': '12 years', 'rating': 4.7},
        
        # Radiologists
        {'name': 'Dr. Michael Scan', 'specialization': 'Radiologist', 'experience': '14 years', 'rating': 4.8},
        {'name': 'Dr. Jennifer Image', 'specialization': 'Radiologist', 'experience': '10 years', 'rating': 4.6},
        
        # Pathologists
        {'name': 'Dr. William Lab', 'specialization': 'Pathologist', 'experience': '16 years', 'rating': 4.9},
        {'name': 'Dr. Susan Tissue', 'specialization': 'Pathologist', 'experience': '13 years', 'rating': 4.7},
        
        # Plastic Surgeons
        {'name': 'Dr. Amanda Beauty', 'specialization': 'Plastic Surgeon', 'experience': '11 years', 'rating': 4.8},
        {'name': 'Dr. James Reconstruct', 'specialization': 'Plastic Surgeon', 'experience': '9 years', 'rating': 4.6},
        
        # Thoracic Surgeons
        {'name': 'Dr. Richard Chest', 'specialization': 'Thoracic Surgeon', 'experience': '17 years', 'rating': 4.9},
        {'name': 'Dr. Patricia Lung', 'specialization': 'Thoracic Surgeon', 'experience': '14 years', 'rating': 4.8},
        
        # Oral and Maxillofacial Surgeons
        {'name': 'Dr. Thomas Jaw', 'specialization': 'Oral and Maxillofacial Surgeon', 'experience': '12 years', 'rating': 4.7},
        {'name': 'Dr. Lisa Mouth', 'specialization': 'Oral and Maxillofacial Surgeon', 'experience': '10 years', 'rating': 4.6},
        
        # Occupational Medicine Specialists
        {'name': 'Dr. Mark Work', 'specialization': 'Occupational Medicine Specialist', 'experience': '13 years', 'rating': 4.8},
        {'name': 'Dr. Nancy Safety', 'specialization': 'Occupational Medicine Specialist', 'experience': '11 years', 'rating': 4.6},
        
        # Sleep Medicine Specialists
        {'name': 'Dr. Steven Dream', 'specialization': 'Sleep Medicine Specialist', 'experience': '9 years', 'rating': 4.7},
        {'name': 'Dr. Michelle Rest', 'specialization': 'Sleep Medicine Specialist', 'experience': '8 years', 'rating': 4.5},
        
        # Addiction Medicine Specialists
        {'name': 'Dr. Daniel Recovery', 'specialization': 'Addiction Medicine Specialist', 'experience': '12 years', 'rating': 4.8},
        {'name': 'Dr. Karen Rehab', 'specialization': 'Addiction Medicine Specialist', 'experience': '10 years', 'rating': 4.6},
        
        # Nuclear Medicine Specialists
        {'name': 'Dr. Paul Isotope', 'specialization': 'Nuclear Medicine Specialist', 'experience': '15 years', 'rating': 4.9},
        {'name': 'Dr. Helen Radiation', 'specialization': 'Nuclear Medicine Specialist', 'experience': '12 years', 'rating': 4.7},
        
        # Preventive Medicine Specialists
        {'name': 'Dr. Charles Prevention', 'specialization': 'Preventive Medicine Specialist', 'experience': '11 years', 'rating': 4.7},
        {'name': 'Dr. Barbara Wellness', 'specialization': 'Preventive Medicine Specialist', 'experience': '9 years', 'rating': 4.5}
    ]
    
    for doctor_data in doctors_data:
        doctor = Doctor(**doctor_data)
        db.session.add(doctor)
    
    db.session.commit()
    print(f"Seeded {len(doctors_data)} doctors")
