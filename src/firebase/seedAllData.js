#!/usr/bin/env node
/**
 * Complete Firebase Data Seeding Script
 * Seeds doctors to Firebase Firestore
 * Run: node src/firebase/seedAllData.js
 */

require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Doctors data
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

async function checkExistingDoctors() {
  try {
    const querySnapshot = await getDocs(collection(db, 'doctors'));
    return querySnapshot.size;
  } catch (error) {
    return 0;
  }
}

async function seedDoctors() {
  console.log('\n🔥 Firebase Data Seeding Script');
  console.log('================================\n');
  
  // Check if doctors already exist
  const existingCount = await checkExistingDoctors();
  
  if (existingCount > 0) {
    console.log(`⚠️  Found ${existingCount} existing doctors in Firebase`);
    console.log('Skipping doctor seeding to avoid duplicates.\n');
    console.log('To re-seed, delete the doctors collection in Firebase Console first.\n');
    return;
  }
  
  console.log('📋 Seeding Doctors to Firebase Firestore...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const doctor of doctors) {
    try {
      await addDoc(collection(db, 'doctors'), doctor);
      console.log(`✅ Added: ${doctor.name} (${doctor.specialization})`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to add ${doctor.name}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n================================');
  console.log('📊 Seeding Summary:');
  console.log(`   ✅ Successfully added: ${successCount} doctors`);
  if (errorCount > 0) {
    console.log(`   ❌ Failed: ${errorCount} doctors`);
  }
  console.log('================================\n');
  
  if (successCount > 0) {
    console.log('🎉 Firebase is ready!');
    console.log('\nNext steps:');
    console.log('1. Start your app: npm start');
    console.log('2. Register a new user');
    console.log('3. Start using the app!\n');
  }
}

async function main() {
  try {
    await seedDoctors();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    console.error('\nTroubleshooting:');
    console.error('1. Check your .env file has correct Firebase config');
    console.error('2. Verify Firebase project is created');
    console.error('3. Ensure Firestore is enabled in Firebase Console');
    console.error('4. Check Firestore rules allow writes\n');
    process.exit(1);
  }
}

// Run the script
main();
