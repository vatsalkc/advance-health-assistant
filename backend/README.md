# Health Assistant Backend API

Flask backend with SQLite database for the Health Assistant application.

## Database Schema

### Tables

1. **users** - User accounts
   - id, name, email, password (hashed), phone, age, gender
   - timestamps: created_at, updated_at

2. **appointments** - User appointments with doctors
   - id, user_id, doctor_id, doctor_name, specialization
   - date, time, reason, status
   - timestamp: created_at

3. **medicines** - Medicine reminders
   - id, user_id, medicine_name, dosage, time, frequency
   - active (boolean)
   - timestamp: created_at

4. **symptom_checks** - Symptom check history
   - id, user_id, symptoms, predicted_disease
   - recommended_specialization
   - timestamp: created_at

5. **doctors** - Available doctors
   - id, name, specialization, experience, rating
   - available (boolean)
   - timestamp: created_at

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and update SECRET_KEY and other settings
```

### 3. Run the Application

```bash
python app.py
```

The API will run on `http://localhost:5000`

### 4. Database Initialization

The database will be automatically created on first run with:
- All tables created
- 15 doctors seeded across 6 specializations

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Appointments

- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Create appointment
- `DELETE /api/appointments/<id>` - Delete appointment

### Medicines

- `GET /api/medicines` - Get user medicines
- `POST /api/medicines` - Create medicine reminder
- `PUT /api/medicines/<id>` - Update medicine
- `DELETE /api/medicines/<id>` - Delete medicine

### Symptom Checker

- `POST /api/symptom-check` - Check symptoms (ML prediction)
- `GET /api/symptom-checks` - Get symptom check history

### Doctors

- `GET /api/doctors` - Get all doctors
- `GET /api/doctors?specialization=Cardiologist` - Filter by specialization

### Statistics

- `GET /api/stats` - Get user dashboard statistics

## Authentication

All protected endpoints require JWT token in header:

```
Authorization: Bearer <token>
```

Token is returned on successful login/registration.

## Database File

SQLite database file: `health_assistant.db`

To reset database, simply delete the file and restart the server.

## Security Notes

For production deployment:
1. Change SECRET_KEY in .env
2. Use PostgreSQL or MySQL instead of SQLite
3. Implement proper password hashing (already using werkzeug)
4. Add rate limiting
5. Enable HTTPS
6. Add input validation and sanitization
7. Implement refresh tokens
8. Add logging and monitoring
