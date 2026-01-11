import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:
    process.env.REACT_APP_FIREBASE_API_KEY ||
    "AIzaSyDzKf4NtSa6SpAa596uypqLxRNddtwcPnE",

  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
    "health-assistant-d2b98.firebaseapp.com",

  projectId:
    process.env.REACT_APP_FIREBASE_PROJECT_ID ||
    "health-assistant-d2b98",

  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
    "health-assistant-d2b98.appspot.com",

  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ||
    "1099184695182",

  appId:
    process.env.REACT_APP_FIREBASE_APP_ID ||
    "1:1099184695182:web:5e2e5351fed4b93e94e6df",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication
export const auth = getAuth(app);

// ✅ Firestore (LONG POLLING FIX)
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export default app;
