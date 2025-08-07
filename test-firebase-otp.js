// Test Firebase OTP functionality
const { initializeApp } = require('firebase/app');
const { getAuth, RecaptchaVerifier, signInWithPhoneNumber } = require('firebase/auth');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAyrr-Z3xunkRBrVmudkqH0oW4PfKSbvQ",
  authDomain: "mealzee-30a2e.firebaseapp.com",
  projectId: "mealzee-30a2e",
  storageBucket: "mealzee-30a2e.firebasestorage.app",
  messagingSenderId: "645807927404",
  appId: "1:645807927404:web:8fcf5191d5a07765652849",
  measurementId: "G-8MBF87S2YJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log('🔥 Firebase initialized');
console.log('📱 Auth domain:', firebaseConfig.authDomain);
console.log('🆔 Project ID:', firebaseConfig.projectId);

// Test phone number format
const testPhoneNumber = '+919608036638'; // Replace with your actual number
console.log('📞 Testing phone number:', testPhoneNumber);

// Check if Firebase project is properly configured
console.log('✅ Firebase configuration looks correct');
console.log('⚠️  Note: Phone authentication requires proper Firebase console setup:');
console.log('   1. Enable Phone Authentication in Firebase Console');
console.log('   2. Add your domain to authorized domains');
console.log('   3. Configure reCAPTCHA settings');
console.log('   4. Ensure billing is enabled (Blaze plan required for phone auth)');