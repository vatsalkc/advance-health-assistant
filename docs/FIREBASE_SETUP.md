# Firebase Setup Guide

## 🔥 Why Firebase?

Firebase Firestore provides:
- ✅ **Real-time sync** across all devices
- ✅ **No backend needed** - direct client access
- ✅ **Automatic scaling** - handles any load
- ✅ **Offline support** - works without internet
- ✅ **Built-in authentication** - secure user management
- ✅ **Free tier** - generous limits for development

## 📋 Step-by-Step Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `health-assistant`
4. Disable Google Analytics (optional)
5. Click "Create Project"

### Step 2: Enable Authentication

1. In Firebase Console, click "Authentication"
2. Click "Get Started"
3. Click "Sign-in method" tab
4. Enable "Email/Password"
5. Click "Save"

### Step 3: Create Firestore Database

1. In Firebase Console, click "Firestore Database"
2. Click "Create database"
3. Select "Start in **test mode**" (for development)
4. Choose location (closest to you)
5. Click "Enable"

### Step 4: Get Firebase Config

1. In Firebase Console, click the gear icon ⚙️
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>`
5. Register app name: `health-assistant-web`
6. Copy the `firebaseConfig` object

### Step 5: Add Config to Your App

1. Create `.env` file in project root:

```bash
cp .env.example .env
```

2. Edit `.env` and add your Firebase config:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=health-assistant-xxxxx.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=health-assistant-xxxxx
REACT_APP_FIREBASE_STORAGE_BUCKET=health-assistant-xxxxx.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxx
```

### Step 6: Install Firebase

```bash
npm install firebase
```

### Step 7: Seed Doctors Data (One-time)

Run this script to add doctors to Firestore:

```bash
node src/firebase/seedDoctors.js
```

### Step 8: Update Firestore Rules

In Firebase Console > Firestore Database > Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Appointments - users can only access their own
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
    
    // Medicines - users can only access their own
    match /medicines/{medicineId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
    
    // Symptom checks - users can only access their own
    match /symptomChecks/{checkId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
    
    // Doctors - everyone can read
    match /doctors/{doctorId} {
      allow read: if true;
      allow write: if false; // Only admins via Firebase Console
    }
  }
}
```

Click "Publish"

## 🚀 Start Using Firebase

### Register New User

```javascript
// Automatically handled by Register component
// Creates user in Firebase Auth + Firestore
```

### Login

```javascript
// Automatically handled by Login component
// Authenticates and fetches user data
```

### Real-time Data Sync

```javascript
// Appointments update in real-time
subscribeToAppointments(userId, (appointments) => {
  console.log('Appointments updated:', appointments);
});
```

## 📊 Firestore Collections Structure

### users
```javascript
{
  uid: "user123",
  name: "John Doe",
  email: "john@example.com",
  phone: "555-0101",
  age: 35,
  gender: "male",
  createdAt: "2026-01-11T..."
}
```

### appointments
```javascript
{
  userId: "user123",
  doctorId: 1,
  doctorName: "Dr. John Smith",
  specialization: "Cardiologist",
  date: "2026-01-15",
  time: "10:00 AM",
  reason: "Chest pain",
  status: "Pending",
  createdAt: "2026-01-11T..."
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
  active: true,
  createdAt: "2026-01-11T..."
}
```

### symptomChecks
```javascript
{
  userId: "user123",
  symptoms: ["fever", "cough", "fatigue"],
  predictedDisease: "Common Cold",
  recommendedSpecialization: "General Physician",
  confidence: 92.5,
  createdAt: "2026-01-11T..."
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

## 🔄 Migration from SQLite

Your app now uses Firebase instead of SQLite backend:

**Before:**
- Backend: Flask + SQLite
- Frontend calls: `/api/appointments`
- Data: Stored on server

**After:**
- Backend: Firebase (serverless)
- Frontend calls: `firebaseService.createAppointment()`
- Data: Stored in cloud, syncs in real-time

## 🎯 Testing

### Test Registration
1. Open app
2. Click "Register"
3. Fill form and submit
4. Check Firebase Console > Authentication
5. Check Firebase Console > Firestore > users

### Test Real-time Sync
1. Login on Device 1 (laptop)
2. Add appointment
3. Login on Device 2 (mobile) with same account
4. See appointment appear instantly!

## 💰 Firebase Free Tier Limits

- **Authentication:** Unlimited
- **Firestore Reads:** 50,000/day
- **Firestore Writes:** 20,000/day
- **Firestore Deletes:** 20,000/day
- **Storage:** 1 GB

Perfect for development and small apps!

## 🔒 Security Best Practices

1. ✅ Never commit `.env` to git
2. ✅ Use Firestore security rules
3. ✅ Validate data on client
4. ✅ Use Firebase Auth for authentication
5. ✅ Enable App Check (production)

## 🐛 Troubleshooting

### Registration fails
- Check Firebase Auth is enabled
- Check email/password provider is enabled
- Check console for error messages
- Verify Firebase config in `.env`

### Data not syncing
- Check Firestore rules
- Check user is authenticated
- Check internet connection
- Check Firebase Console for data

### "Permission denied" errors
- Update Firestore rules
- Check user is logged in
- Verify userId matches

## 📚 Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

## 🎉 Benefits

✅ **No more registration failures** - Firebase handles auth
✅ **Real-time sync** - Data updates instantly
✅ **Works offline** - Firestore caches data
✅ **Scales automatically** - No server management
✅ **Free to start** - Generous free tier
✅ **Global CDN** - Fast worldwide

Your app is now powered by Firebase! 🔥
