# 🚀 Start Your Health Assistant App

## Quick Start Guide

### Step 1: Start Backend Server
Open a terminal and run:
```bash
cd backend
venv\Scripts\activate
python app.py
```

You should see:
```
* Running on http://127.0.0.1:5000
* Running on http://YOUR_NETWORK_IP:5000
```

### Step 2: Start Frontend Server
Open a NEW terminal and run:
```bash
npm start
```

The app will automatically open at `http://localhost:3000`

### Step 3: Use the App
- **Desktop**: Access at `http://localhost:3000`
- **Mobile**: Access at `http://YOUR_NETWORK_IP:3000` (same network)

### Default Test Account
- **Email**: test@example.com
- **Password**: test123

Or register a new account!

---

## Troubleshooting

### Backend won't start?
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
python create_model.py
python app.py
```

### Frontend won't start?
```bash
npm install
npm start
```

### Can't connect from mobile?
1. Make sure both devices are on the same WiFi network
2. Check your network IP in the backend console output
3. Use that IP on mobile: `http://YOUR_IP:3000`
4. Make sure Windows Firewall allows the connection

---

## Features Available

✅ **AI Disease Prediction** - 216 diseases, 613 symptoms
✅ **Doctor Appointments** - 100+ doctors, 30+ specializations  
✅ **Medicine Reminders** - Track your medications
✅ **Health Dashboard** - View your health statistics
✅ **Multi-device Support** - Use on desktop and mobile simultaneously

---

**Need help?** Check README.md for detailed documentation.
