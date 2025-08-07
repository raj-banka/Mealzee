// Firebase OTP Diagnostic Script
const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');

// Firebase configuration from your .env
const firebaseConfig = {
  apiKey: "AIzaSyCAyrr-Z3xunkRBrVmudkqH0oW4PfKSbvQ",
  authDomain: "mealzee-30a2e.firebaseapp.com",
  projectId: "mealzee-30a2e",
  storageBucket: "mealzee-30a2e.firebasestorage.app",
  messagingSenderId: "645807927404",
  appId: "1:645807927404:web:8fcf5191d5a07765652849",
  measurementId: "G-8MBF87S2YJ"
};

console.log('🔥 Firebase OTP Diagnostic Report');
console.log('=====================================');

// Initialize Firebase
try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.log('❌ Firebase initialization failed:', error.message);
  process.exit(1);
}

console.log('\n📋 Configuration Check:');
console.log('- API Key:', firebaseConfig.apiKey ? '✅ Present' : '❌ Missing');
console.log('- Auth Domain:', firebaseConfig.authDomain);
console.log('- Project ID:', firebaseConfig.projectId);

console.log('\n🔍 Common Issues & Solutions:');
console.log('\n1. 🚫 Phone Authentication Not Enabled');
console.log('   Solution: Go to Firebase Console → Authentication → Sign-in method → Enable Phone');
console.log('   URL: https://console.firebase.google.com/project/mealzee-30a2e/authentication/providers');

console.log('\n2. 💳 Billing Not Enabled (Blaze Plan Required)');
console.log('   Solution: Firebase requires Blaze plan for phone authentication');
console.log('   URL: https://console.firebase.google.com/project/mealzee-30a2e/usage/details');

console.log('\n3. 🌐 Domain Not Authorized');
console.log('   Solution: Add localhost:3000 to authorized domains');
console.log('   URL: https://console.firebase.google.com/project/mealzee-30a2e/authentication/settings');

console.log('\n4. 🤖 reCAPTCHA Issues');
console.log('   Solution: Ensure reCAPTCHA is properly configured');
console.log('   - Check browser console for reCAPTCHA errors');
console.log('   - Try in incognito mode');

console.log('\n5. 📱 Phone Number Format');
console.log('   Correct format: +919876543210');
console.log('   Your number should start with +91');

console.log('\n6. 🚦 Rate Limiting');
console.log('   Firebase has built-in rate limiting');
console.log('   Wait 5-10 minutes between attempts');

console.log('\n🔧 Next Steps:');
console.log('1. Check Firebase Console settings (links above)');
console.log('2. Ensure Blaze plan is enabled');
console.log('3. Test with a different phone number');
console.log('4. Check browser console for errors');
console.log('5. Try in incognito mode');

console.log('\n📞 Test Phone Numbers:');
console.log('Firebase provides test phone numbers for development:');
console.log('- Phone: +1 650-555-3434, Code: 654321');
console.log('- Phone: +1 555-555-5555, Code: 123456');
console.log('(These work without SMS in development mode)');

console.log('\n🆘 If Still Not Working:');
console.log('1. Enable Firebase debug mode in browser console');
console.log('2. Check Firebase Console → Authentication → Users');
console.log('3. Look for error messages in Network tab');
console.log('4. Contact Firebase support if billing is enabled');

console.log('\n✅ Diagnostic Complete');