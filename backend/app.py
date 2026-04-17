from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
from database import db, init_db
from models import User, Appointment, Medicine, SymptomCheck, Doctor
from ml_model import initialize_model

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///health_assistant.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

# Configure CORS for multi-device access including mobile
CORS(app, 
     origins="*",  # Allow all origins for development
     allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     supports_credentials=False)  # Set to False when using origins="*"

# Initialize ML model
print("Initializing ML model...")
try:
    disease_predictor = initialize_model()
    print("ML model ready!")
except Exception as e:
    print(f"ML model initialization failed: {e}")
    disease_predictor = None

# Create tables
with app.app_context():
    init_db()

# JWT token decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({
                'message': 'Token is missing',
                'error_code': 'NO_TOKEN'
            }), 401
        
        try:
            if token.startswith('Bearer '):
                token = token.split(' ')[1]
            
            # Decode token
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
            
            if not current_user:
                return jsonify({
                    'message': 'User not found',
                    'error_code': 'USER_NOT_FOUND'
                }), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({
                'message': 'Token has expired',
                'error_code': 'TOKEN_EXPIRED'
            }), 401
        except jwt.InvalidTokenError:
            return jsonify({
                'message': 'Token is invalid',
                'error_code': 'INVALID_TOKEN'
            }), 401
        except Exception as e:
            return jsonify({
                'message': 'Token validation failed',
                'error_code': 'TOKEN_ERROR',
                'details': str(e)
            }), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

# ==================== AUTH ROUTES ====================

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    if not data.get('name') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Check if user exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 400
    
    # Create new user
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_password,
        phone=data.get('phone'),
        age=data.get('age'),
        gender=data.get('gender')
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    # Generate token
    token = jwt.encode({
        'user_id': new_user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, app.config['SECRET_KEY'])
    
    return jsonify({
        'message': 'Registration successful',
        'token': token,
        'user': new_user.to_dict()
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # Generate token
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, app.config['SECRET_KEY'])
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': user.to_dict()
    }), 200

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify({'user': current_user.to_dict()}), 200

@app.route('/api/auth/refresh', methods=['POST'])
@token_required
def refresh_token(current_user):
    """Refresh the JWT token"""
    # Generate new token
    new_token = jwt.encode({
        'user_id': current_user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, app.config['SECRET_KEY'])
    
    return jsonify({
        'message': 'Token refreshed successfully',
        'token': new_token,
        'user': current_user.to_dict()
    }), 200

@app.route('/api/auth/validate', methods=['GET'])
@token_required
def validate_token(current_user):
    """Validate if the current token is still valid"""
    return jsonify({
        'valid': True,
        'user': current_user.to_dict(),
        'message': 'Token is valid'
    }), 200

# ==================== DOCTOR ROUTES ====================

@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    specialization = request.args.get('specialization')
    
    if specialization:
        doctors = Doctor.query.filter_by(specialization=specialization).all()
    else:
        doctors = Doctor.query.all()
    
    return jsonify({'doctors': [doc.to_dict() for doc in doctors]}), 200

# ==================== APPOINTMENT ROUTES ====================

@app.route('/api/appointments', methods=['GET'])
@token_required
def get_appointments(current_user):
    appointments = Appointment.query.filter_by(user_id=current_user.id).all()
    return jsonify({'appointments': [apt.to_dict() for apt in appointments]}), 200

@app.route('/api/appointments', methods=['POST'])
@token_required
def create_appointment(current_user):
    data = request.get_json()
    
    new_appointment = Appointment(
        user_id=current_user.id,
        doctor_id=data.get('doctor_id'),
        doctor_name=data['doctor_name'],
        specialization=data.get('specialization'),
        date=data['date'],
        time=data['time'],
        reason=data['reason'],
        status=data.get('status', 'Pending')
    )
    
    db.session.add(new_appointment)
    db.session.commit()
    
    return jsonify({
        'message': 'Appointment created',
        'appointment': new_appointment.to_dict()
    }), 201

@app.route('/api/appointments/<int:id>', methods=['DELETE'])
@token_required
def delete_appointment(current_user, id):
    appointment = Appointment.query.filter_by(id=id, user_id=current_user.id).first()
    
    if not appointment:
        return jsonify({'message': 'Appointment not found'}), 404
    
    db.session.delete(appointment)
    db.session.commit()
    
    return jsonify({'message': 'Appointment deleted'}), 200

# ==================== MEDICINE ROUTES ====================

@app.route('/api/medicines', methods=['GET'])
@token_required
def get_medicines(current_user):
    medicines = Medicine.query.filter_by(user_id=current_user.id).all()
    return jsonify({'medicines': [med.to_dict() for med in medicines]}), 200

@app.route('/api/medicines', methods=['POST'])
@token_required
def create_medicine(current_user):
    data = request.get_json()
    
    new_medicine = Medicine(
        user_id=current_user.id,
        medicine_name=data['medicine_name'],
        dosage=data['dosage'],
        time=data['time'],
        frequency=data['frequency'],
        active=data.get('active', True)
    )
    
    db.session.add(new_medicine)
    db.session.commit()
    
    return jsonify({
        'message': 'Medicine reminder created',
        'medicine': new_medicine.to_dict()
    }), 201

@app.route('/api/medicines/<int:id>', methods=['PUT'])
@token_required
def update_medicine(current_user, id):
    medicine = Medicine.query.filter_by(id=id, user_id=current_user.id).first()
    
    if not medicine:
        return jsonify({'message': 'Medicine not found'}), 404
    
    data = request.get_json()
    medicine.active = data.get('active', medicine.active)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Medicine updated',
        'medicine': medicine.to_dict()
    }), 200

@app.route('/api/medicines/<int:id>', methods=['DELETE'])
@token_required
def delete_medicine(current_user, id):
    medicine = Medicine.query.filter_by(id=id, user_id=current_user.id).first()
    
    if not medicine:
        return jsonify({'message': 'Medicine not found'}), 404
    
    db.session.delete(medicine)
    db.session.commit()
    
    return jsonify({'message': 'Medicine deleted'}), 200

# ==================== SYMPTOM CHECK ROUTES ====================

@app.route('/api/symptom-check', methods=['POST'])
@token_required
def symptom_check(current_user):
    data = request.get_json()
    symptoms = data.get('symptoms', [])
    
    if not symptoms:
        return jsonify({'message': 'No symptoms provided'}), 400
    
    if not disease_predictor:
        return jsonify({'message': 'Disease prediction service unavailable'}), 503
    
    try:
        # Predict disease using ML model
        predicted_disease, top_diseases = disease_predictor.predict_disease(symptoms)
        
        # Get disease information
        disease_info = disease_predictor.get_disease_info(predicted_disease)
        
        if not disease_info:
            return jsonify({'message': 'Disease information not found'}), 404
        
        # Save symptom check with detailed information
        symptom_check = SymptomCheck(
            user_id=current_user.id,
            symptoms=','.join(symptoms),
            predicted_disease=predicted_disease,
            recommended_specialization=disease_info['specialization'],
            confidence=float(top_diseases[0][1]) * 100,
            description=disease_info['description'],
            precautions=','.join(disease_info['precautions'])
        )
        
        db.session.add(symptom_check)
        db.session.commit()
        
        # Prepare recommended doctors list
        # Always include General Physician as a secondary recommendation
        recommended_doctors = [
            {
                'specialization': disease_info['specialization'],
                'reason': 'Primary recommendation based on symptoms',
                'priority': 'primary'
            }
        ]
        
        # Add General Physician if it's not already the primary recommendation
        if disease_info['specialization'].lower() != 'general physician':
            recommended_doctors.append({
                'specialization': 'General Physician',
                'reason': 'Can provide general consultation and referrals',
                'priority': 'secondary'
            })
        
        return jsonify({
            'disease': predicted_disease,
            'confidence': float(top_diseases[0][1]) * 100,
            'specialization': disease_info['specialization'],
            'description': disease_info['description'],
            'precautions': disease_info['precautions'],
            'recommended_doctors': recommended_doctors,
            'top_predictions': [
                {
                    'disease': disease,
                    'confidence': float(prob) * 100
                } for disease, prob in top_diseases
            ],
            'symptom_check': symptom_check.to_dict()
        }), 200
        
    except Exception as e:
        print(f"Error in symptom check: {str(e)}")
        return jsonify({'message': f'Error predicting disease: {str(e)}'}), 500

@app.route('/api/symptom-checks', methods=['GET'])
@token_required
def get_symptom_checks(current_user):
    limit = request.args.get('limit', 10, type=int)
    checks = SymptomCheck.query.filter_by(user_id=current_user.id).order_by(SymptomCheck.created_at.desc()).limit(limit).all()
    return jsonify({'symptom_checks': [check.to_dict() for check in checks]}), 200

@app.route('/api/user/profile', methods=['GET'])
@token_required
def get_user_profile(current_user):
    """Get comprehensive user profile with all data"""
    # Get user stats
    appointments_count = Appointment.query.filter_by(user_id=current_user.id).count()
    medicines_count = Medicine.query.filter_by(user_id=current_user.id, active=True).count()
    symptom_checks_count = SymptomCheck.query.filter_by(user_id=current_user.id).count()
    
    # Get recent data
    recent_appointments = Appointment.query.filter_by(user_id=current_user.id).order_by(Appointment.created_at.desc()).limit(5).all()
    recent_medicines = Medicine.query.filter_by(user_id=current_user.id).order_by(Medicine.created_at.desc()).limit(5).all()
    recent_symptom_checks = SymptomCheck.query.filter_by(user_id=current_user.id).order_by(SymptomCheck.created_at.desc()).limit(5).all()
    
    return jsonify({
        'user': current_user.to_dict(),
        'stats': {
            'totalAppointments': appointments_count,
            'activeMedicines': medicines_count,
            'symptomsChecked': symptom_checks_count
        },
        'recent_data': {
            'appointments': [apt.to_dict() for apt in recent_appointments],
            'medicines': [med.to_dict() for med in recent_medicines],
            'symptom_checks': [check.to_dict() for check in recent_symptom_checks]
        }
    }), 200

@app.route('/api/symptoms/all', methods=['GET'])
def get_all_symptoms():
    """Get list of all possible symptoms"""
    if not disease_predictor:
        return jsonify({'message': 'Disease prediction service unavailable'}), 503
    
    try:
        symptoms = disease_predictor.get_all_symptoms()
        return jsonify({'symptoms': symptoms}), 200
    except Exception as e:
        return jsonify({'message': f'Error fetching symptoms: {str(e)}'}), 500

# ==================== STATS ROUTES ====================

@app.route('/api/stats', methods=['GET'])
@token_required
def get_stats(current_user):
    appointments_count = Appointment.query.filter_by(user_id=current_user.id).count()
    medicines_count = Medicine.query.filter_by(user_id=current_user.id, active=True).count()
    symptom_checks_count = SymptomCheck.query.filter_by(user_id=current_user.id).count()
    
    return jsonify({
        'totalAppointments': appointments_count,
        'activeMedicines': medicines_count,
        'symptomsChecked': symptom_checks_count
    }), 200

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)