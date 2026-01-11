#!/usr/bin/env node
/**
 * Setup Verification Script
 * Checks if Firebase is configured correctly
 * Run: node verify-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Health Assistant - Setup Verification\n');
console.log('==========================================\n');

let allGood = true;
const issues = [];

// Check 1: .env file exists
console.log('1️⃣  Checking .env file...');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('   ✅ .env file found\n');
  
  // Check 2: .env has required variables
  console.log('2️⃣  Checking Firebase configuration...');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const requiredVars = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID'
  ];
  
  let missingVars = [];
  let emptyVars = [];
  
  requiredVars.forEach(varName => {
    const regex = new RegExp(`${varName}=(.+)`);
    const match = envContent.match(regex);
    
    if (!match) {
      missingVars.push(varName);
    } else if (!match[1] || match[1].trim() === '' || match[1].includes('your_') || match[1].includes('YOUR_')) {
      emptyVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    console.log('   ❌ Missing variables:');
    missingVars.forEach(v => console.log(`      - ${v}`));
    allGood = false;
    issues.push('Add missing Firebase variables to .env');
  }
  
  if (emptyVars.length > 0) {
    console.log('   ⚠️  Empty or placeholder variables:');
    emptyVars.forEach(v => console.log(`      - ${v}`));
    allGood = false;
    issues.push('Replace placeholder values with actual Firebase config');
  }
  
  if (missingVars.length === 0 && emptyVars.length === 0) {
    console.log('   ✅ All Firebase variables configured\n');
  } else {
    console.log('');
  }
  
} else {
  console.log('   ❌ .env file not found\n');
  allGood = false;
  issues.push('Create .env file from .env.example');
}

// Check 3: node_modules exists
console.log('3️⃣  Checking dependencies...');
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('   ✅ Dependencies installed\n');
} else {
  console.log('   ❌ node_modules not found\n');
  allGood = false;
  issues.push('Run: npm install');
}

// Check 4: Firebase package installed
console.log('4️⃣  Checking Firebase package...');
const firebasePath = path.join(__dirname, 'node_modules', 'firebase');
if (fs.existsSync(firebasePath)) {
  console.log('   ✅ Firebase package installed\n');
} else {
  console.log('   ❌ Firebase package not found\n');
  allGood = false;
  issues.push('Run: npm install firebase');
}

// Check 5: Required files exist
console.log('5️⃣  Checking required files...');
const requiredFiles = [
  'src/firebase/config.js',
  'src/firebase/firebaseService.js',
  'src/firebase/seedAllData.js',
  'src/components/Auth/Login.js',
  'src/components/Auth/Register.js'
];

let missingFiles = [];
requiredFiles.forEach(file => {
  if (!fs.existsSync(path.join(__dirname, file))) {
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.log('   ❌ Missing files:');
  missingFiles.forEach(f => console.log(`      - ${f}`));
  allGood = false;
  issues.push('Some required files are missing');
  console.log('');
} else {
  console.log('   ✅ All required files present\n');
}

// Check 6: package.json has firebase
console.log('6️⃣  Checking package.json...');
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (packageJson.dependencies && packageJson.dependencies.firebase) {
    console.log('   ✅ Firebase listed in dependencies\n');
  } else {
    console.log('   ⚠️  Firebase not in dependencies\n');
    issues.push('Add firebase to package.json dependencies');
  }
  
  if (packageJson.scripts && packageJson.scripts['seed-firebase']) {
    console.log('   ✅ Seed script configured\n');
  } else {
    console.log('   ⚠️  Seed script not found\n');
    issues.push('Add seed-firebase script to package.json');
  }
} else {
  console.log('   ❌ package.json not found\n');
  allGood = false;
}

// Summary
console.log('==========================================\n');

if (allGood) {
  console.log('🎉 SUCCESS! Your setup looks good!\n');
  console.log('Next steps:');
  console.log('1. Run: npm run seed-firebase');
  console.log('2. Run: npm start');
  console.log('3. Register a new user');
  console.log('4. Start using the app!\n');
} else {
  console.log('❌ Setup incomplete. Please fix these issues:\n');
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue}`);
  });
  console.log('\nRefer to START_HERE.md for detailed instructions.\n');
}

console.log('==========================================\n');

process.exit(allGood ? 0 : 1);
