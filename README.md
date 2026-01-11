# 🏥 Health Assistant - AI-Powered Healthcare Platform

A complete full-stack health assistant application with ML disease prediction, real-time data sync, and comprehensive health management features.

## ✨ Features

### 🔐 User Management
- Firebase Authentication (Email/Password)
- Secure user registration and login
- User profile management

### 🤖 AI Disease Prediction
- ML-powered symptom analysis
- 60+ diseases across 6 specializations
- 200+ symptoms database
- Confidence scores and alternative diagnoses
- Precautions and recommendations

### 👨‍⚕️ Doctor Management
- 15 doctors across 6 specializations
- Doctor ratings and experience
- Specialization-based filtering
- Real-time availability

### 📅 Appointment Booking
- Book appointments with doctors
- View upcoming appointments
- Real-time sync across devices
- Appointment status tracking

### 💊 Medicine Reminders
- Add medicine schedules
- Set dosage and frequency
- Active/inactive toggle
- Real-time updates

### 📊 Dashboard
- Health statistics overview
- Upcoming appointments
- Today's medicines
- Symptom check history

### 🌓 Dark Mode
- Toggle between light and dark themes
- Persistent theme preference

### 🔄 Real-time Sync
- Data syncs instantly across all devices
- Firebase Firestore real-time listeners
- Offline support

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Bootstrap 5** - Styling
- **React Bootstrap** - UI components
- **Firebase SDK** - Authentication & Database
- **Axios** - HTTP client

### Backend (ML Model)
- **Python Flask** - API server
- **scikit-learn** - Machine learning
- **pandas** - Data processing
- **Random Forest** - ML algorithm

### Database
- **Firebase Firestore** - NoSQL cloud database
- **Firebase Authentication** - User management
- **Real-time listeners** - Live data sync

## 📦 Installation

### Prerequisites
- Node.js 14+ and npm
- Python 3.8+ (for ML model)
- Firebase account
- Git

### Quick Start

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd health-assistant
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup Firebase**
   - Create Firebase project at https://console.firebase.google.com/
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Get your Firebase config

4. **Configure environment**
```bash
cp .env.example .env
# Edit .env and add your Firebase config
```

5. **Verify setup**
```bash
npm run verify
```

6. **Seed doctors data**
```bash
npm run seed-firebase
```

7. **Start the app**
```bash
npm start
```

App opens at: http://localhost:3000

## 📚 Documentation

- **[START_HERE.md](START_HERE.md)** - Complete setup guide with testing
- **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** - Step-by-step Firebase setup
- **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** - Detailed Firebase configuration
- **[QUICK_FIREBASE_START.md](QUICK_FIREBASE_START.md)** - 5-minute quick start
- **[ML_SETUP_GUIDE.md](ML_SETUP_GUIDE.md)** - ML model setup and training
- **[backend/ML_MODEL_README.md](backend/ML_MODEL_README.md)** - ML model documentation

## 🚀 Usage

### Register & Login
1. Click "Register" to create account
2. Fill in your details
3. Login with your credentials

### Check Symptoms
1. Go to "Symptom Checker"
2. Add your symptoms
3. Click "Check Symptoms"
4. View disease prediction with confidence score
5. See recommended doctors

### Book Appointment
1. Go to "Appointments"
2. Browse doctors by specialization
3. Click "Book Appointment"
4. Fill in date, time, and reason
5. Confirm booking

### Add Medicine Reminder
1. Go to "Medicines"
2. Fill in medicine details
3. Set time and frequency
4. Click "Add Reminder"

### View Dashboard
- See total appointments
- View active medicines
- Check symptom history
- Quick access to all features

## 🔥 Firebase Collections

### users
```javascript
{
  uid: "user123",
  name: "John Doe",
  email: "john@example.com",
  phone: "555-0101",
  age: 35,
  gender: "male"
}
```

### doctors
```javascript
{
  name: "Dr. John Smith",
  specialization: "Cardiologist",
  experience: "10 years",
  rating: 4.5,
  available: true
}
```

### appointments
```javascript
{
  userId: "user123",
  doctorId: "doc1",
  doctorName: "Dr. John Smith",
  specialization: "Cardiologist",
  date: "2026-01-15",
  time: "10:00 AM",
  reason: "Chest pain",
  status: "Pending"
}
```

### medicines
```javascript
{
  userId: "user123",
  medicineName: "Aspirin",
  dosage: "100mg",
  time: "08:00 AM",
  frequency: "daily",
  active: true
}
```

### symptomChecks
```javascript
{
  userId: "user123",
  symptoms: ["fever", "cough", "fatigue"],
  predictedDisease: "Common Cold",
  recommendedSpecialization: "General Physician",
  confidence: 92.5
}
```

## 🧪 Testing

### Run Verification
```bash
npm run verify
```

### Test Registration
1. Register new user
2. Check Firebase Console → Authentication
3. Verify user appears

### Test Real-time Sync
1. Login on Device 1
2. Add appointment
3. Login on Device 2 with same account
4. Verify appointment appears instantly

### Test ML Model
```bash
cd backend
python train_model.py
python app.py
```

## 📊 Project Structure

```
health-assistant/
├── src/
│   ├── components/
│   │   ├── Auth/              # Login & Register
│   │   ├── Dashboard/         # Main dashboard
│   │   ├── Appointments/      # Appointment booking
│   │   ├── MedicineReminder/  # Medicine management
│   │   ├── SymptomChecker/    # Disease prediction
│   │   └── DoctorRecommendation/ # Doctor suggestions
│   ├── firebase/
│   │   ├── config.js          # Firebase configuration
│   │   ├── firebaseService.js # Firebase operations
│   │   └── seedAllData.js     # Data seeding script
│   ├── utils/
│   │   └── api.js             # API client (for ML backend)
│   ├── App.js                 # Main app component
│   ├── App.css                # Global styles
│   └── index.js               # Entry point
├── backend/
│   ├── app.py                 # Flask API server
│   ├── ml_model.py            # ML model class
│   ├── models.py              # Database models
│   ├── disease_data.csv       # Training dataset
│   └── train_model.py         # Model training script
├── public/
│   └── index.html             # HTML template
├── .env.example               # Environment template
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🔒 Security

- Firebase Authentication for secure login
- Firestore security rules for data protection
- User-specific data isolation
- No passwords stored in frontend
- Environment variables for sensitive config

## 🌐 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy build/ folder
```

### Backend (Heroku/Railway)
```bash
cd backend
# Deploy Flask app
```

### Firebase
- Already deployed (cloud-based)
- No additional deployment needed

## 📈 Future Enhancements

- [ ] Email notifications for appointments
- [ ] SMS reminders for medicines
- [ ] Video consultation integration
- [ ] Health records upload
- [ ] Family member management
- [ ] Insurance integration
- [ ] Prescription management
- [ ] Lab test results
- [ ] Health analytics dashboard
- [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 👨‍💻 Author

Your Name - Health Assistant Project

## 🙏 Acknowledgments

- Firebase for backend infrastructure
- scikit-learn for ML capabilities
- Bootstrap for UI components
- React community for excellent tools

## 📞 Support

For issues or questions:
1. Check documentation files
2. Run `npm run verify`
3. Check Firebase Console
4. Review browser console errors
5. Open GitHub issue

## ⚠️ Disclaimer

This application is for educational purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.

---

**Built with ❤️ using React, Firebase, and Machine Learning**
