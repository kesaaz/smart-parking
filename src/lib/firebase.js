import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDMW6JxlcwxC9d78bgKjtQ-GtmVHTYsKU8",
  authDomain: "smart-parking-4018a.firebaseapp.com",
  projectId: "smart-parking-4018a",
  storageBucket: "smart-parking-4018a.firebasestorage.app",
  messagingSenderId: "77243807185",
  appId: "1:77243807185:web:b6358f6f1bd14174869cf0"
};

const app = initializeApp(firebaseConfig);

// 🔐 Auth
export const auth = getAuth(app);

// ☁️ Firestore
export const db = getFirestore(app);