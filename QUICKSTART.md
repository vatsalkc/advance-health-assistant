# Quick Start Guide - SQLite Backend

Your app is now configured to use SQLite database instead of localStorage. This means data will sync across all devices!

## 🚀 Start the Backend (Required)

### Step 1: Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Start Flask Server

```bash
python app.py
```

The backend will run on `http://localhost:5000`

**What happens:**
- SQLite database `health_assistant.db` is automatically created
- 15 doctors are seeded across 6 specializations
- All API endpoints are ready

## 🎨 Start the Frontend

### Step 3: Install Node Dependencies (if not done)

```bash
npm install
```

### Step 4: Start React App

```bash
npm start
```

The frontend will run on `http://localhost:3000`

## ✅ Test It Out

1. **Register a new account** on the frontend
2. **Login from your mobile** with the same credentials
3. **Add appointments/medicines** on mobile
4. **Login from your laptop** - you'll see the same data!

## 🔑 How It Works

### Before (localStorage):
- Data stored in browser only
- Mobile data ≠ Laptop data
- No sync between devices

### Now (SQLite Backend):
- Data stored in database
- Mobile data = Laptop data
- Syncs across all devices!

## 📡 API Endpoints Being Used

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Book appointment
- `GET /api/medicines` - Get medicines
- `POST /api/medicines` - Add medicine
- `POST /api/symptom-check` - Check symptoms
- `GET /api/doctors` - Get doctors list
- `GET /api/stats` - Get dashboard stats

## 🔧 Troubleshooting

### Backend won't start?
```bash
# Make sure you're in the backend folder
cd backend

# Install dependencies again
pip install -r requirements.txt

# Try running
python app.py
```

### Frontend can't connect to backend?
Check `.env` file in root:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### CORS errors?
Make sure Flask backend is running on port 5000

### Database errors?
Delete `backend/health_assistant.db` and restart Flask - it will recreate

## 📱 Testing Cross-Device Sync

1. Register on Device 1 (e.g., laptop)
2. Add some appointments
3. Login on Device 2 (e.g., mobile) with same credentials
4. See the same appointments!

## 🎉 You're Done!

Your health assistant now uses a real database and syncs across all devices!
