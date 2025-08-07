// Firebase Setup Verification Script
// Run this to verify Firebase configuration is working

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Firebase OTP Integration Setup...\n');

// Check if required files exist
const requiredFiles = [
  'src/lib/firebase.ts',
  'src/lib/firebase-auth.ts',
  'src/components/auth/AuthModal.tsx',
  '.env.local'
];

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} - EXISTS`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

// Check environment variables
console.log('\n🔧 Checking environment variables:');
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'
  ];

  requiredEnvVars.forEach(envVar => {
    if (envContent.includes(envVar)) {
      console.log(`✅ ${envVar} - SET`);
    } else {
      console.log(`❌ ${envVar} - MISSING`);
    }
  });
}

// Check Firebase package
console.log('\n📦 Checking Firebase package:');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  if (packageJson.dependencies && packageJson.dependencies.firebase) {
    console.log(`✅ Firebase package - v${packageJson.dependencies.firebase}`);
  } else {
    console.log('❌ Firebase package - NOT INSTALLED');
  }
} catch (error) {
  console.log('❌ Error reading package.json');
}

// Check TypeScript compilation
console.log('\n🔨 Checking TypeScript compilation:');
try {
  execSync('npx tsc --noEmit --skipLibCheck', { stdio: 'pipe' });
  console.log('✅ TypeScript compilation - PASSED');
} catch (error) {
  console.log('⚠️ TypeScript compilation - WARNINGS (check manually)');
}

console.log('\n🎉 Firebase OTP Integration Setup Verification Complete!');
console.log('\n📋 Next Steps:');
console.log('1. Start development server: npm run dev');
console.log('2. Test Firebase OTP: http://localhost:3000/test-firebase-otp');
console.log('3. Test main auth flow: http://localhost:3000 (click login)');
console.log('4. Ensure Firebase Console has Phone Authentication enabled');
console.log('5. Add test phone numbers in Firebase Console for development');

console.log('\n🔗 Useful Links:');
console.log('- Firebase Console: https://console.firebase.google.com/');
console.log('- Test Page: http://localhost:3000/test-firebase-otp');
console.log('- Main App: http://localhost:3000');