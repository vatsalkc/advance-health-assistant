// Run this script once to seed doctors data to Firebase
// node src/firebase/seedDoctors.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Your Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const doctors = [
  // General Physicians
  { name: 'Dr. John Smith', specialization: 'General Physician', experience: '10 years', rating: 4.5, available: true },
  { name: 'Dr. Emily Davis', specialization: 'General Physician', experience: '8 years', rating: 4.7, available: true },
  { name: 'Dr. Robert Wilson', specialization: 'General Physician', experience: '15 years', rating: 4.6, available: true },
  
  // Cardiologists
  { name: 'Dr. Sarah Johnson', specialization: 'Cardiologist', experience: '12 years', rating: 4.8, available: true },
  { name: 'Dr. Michael Brown', specialization: 'Cardiologist', experience: '14 years', rating: 4.9, available: true },
  { name: 'Dr. Lisa Anderson', specialization: 'Cardiologist', experience: '10 years', rating: 4.7, available: true },
  
  // Dermatologists
  { name: 'Dr. James Taylor', specialization: 'Dermatologist', experience: '9 years', rating: 4.6, available: true },
  { name: 'Dr. Patricia Martinez', specialization: 'Dermatologist', experience: '11 years', rating: 4.8, available: true },
  { name: 'Dr. David Garcia', specialization: 'Dermatologist', experience: '7 years', rating: 4.5, available: true },
  
  // Neurologists
  { name: 'Dr. Jennifer Lee', specialization: 'Neurologist', experience: '13 years', rating: 4.9, available: true },
  { name: 'Dr. Christopher White', specialization: 'Neurologist', experience: '16 years', rating: 4.8, available: true },
  
  // Orthopedic
  { name: 'Dr. Daniel Harris', specialization: 'Orthopedic', experience: '11 years', rating: 4.7, available: true },
  { name: 'Dr. Nancy Clark', specialization: 'Orthopedic', experience: '9 years', rating: 4.6, available: true },
  
  // Pediatricians
  { name: 'Dr. Karen Lewis', specialization: 'Pediatrician', experience: '10 years', rating: 4.8, available: true },
  { name: 'Dr. Steven Walker', specialization: 'Pediatrician', experience: '12 years', rating: 4.7, available: true },
];

async function seedDoctors() {
  console.log('Seeding doctors to Firebase...');
  
  try {
    for (const doctor of doctors) {
      await addDoc(collection(db, 'doctors'), doctor);
      console.log(`Added: ${doctor.name}`);
    }
    
    console.log('\n✅ Successfully seeded all doctors!');
    console.log(`Total doctors added: ${doctors.length}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding doctors:', error);
    process.exit(1);
  }
}

seedDoctors();
