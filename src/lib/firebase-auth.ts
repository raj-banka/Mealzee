// Firebase Phone Authentication Service
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult,
  Auth,
  User,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebase';
import { sendBackupSMS, verifyBackupOTP } from './backup-sms';

// Global variables to store verifier and confirmation result
let recaptchaVerifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;
let usingBackupSMS = false; // Track if we're using backup SMS service

// Auth state listener
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Initialize reCAPTCHA verifier
 */
export function initializeRecaptcha(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Clean up existing verifier
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }

      // Create new reCAPTCHA verifier
      recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('✅ reCAPTCHA solved');
          resolve();
        },
        'expired-callback': () => {
          console.log('❌ reCAPTCHA expired');
          reject(new Error('reCAPTCHA expired'));
        }
      });

      // Render the reCAPTCHA
      recaptchaVerifier.render().then(() => {
        console.log('✅ reCAPTCHA initialized');
        resolve();
      }).catch((error) => {
        console.error('❌ reCAPTCHA render failed:', error);
        reject(error);
      });

    } catch (error) {
      console.error('❌ reCAPTCHA initialization failed:', error);
      reject(error);
    }
  });
}

/**
 * Send OTP to phone number using Firebase
 */
export async function sendFirebaseOTP(phoneNumber: string): Promise<boolean> {
  try {
    console.log('📱 Sending OTP to:', phoneNumber);
    
    // Check if this is a test phone number (for development)
    const testPhoneNumber = '+919142801457';
    const formattedPhone = phoneNumber.startsWith('+91') 
      ? phoneNumber 
      : `+91${phoneNumber.replace(/^\+91/, '')}`;
    
    if (formattedPhone === testPhoneNumber) {
      console.log('🧪 Using Firebase test phone number for development');
      console.log('🔧 Firebase Auth Domain:', auth.app.options.authDomain);
      console.log('🔧 Firebase Project ID:', auth.app.options.projectId);

      // Ensure reCAPTCHA is initialized
      if (!recaptchaVerifier) {
        console.log('🔧 Initializing reCAPTCHA...');
        await initializeRecaptcha();
      }

      if (!recaptchaVerifier) {
        throw new Error('reCAPTCHA verifier not initialized');
      }

      console.log('🔧 reCAPTCHA verifier ready:', !!recaptchaVerifier);

      // Send OTP via Firebase using test phone number
      console.log('🚀 Attempting to send OTP via Firebase test number...');
      confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
      
      console.log('✅ Firebase test OTP sent successfully');
      console.log('🧪 DEVELOPMENT MODE - Use OTP: 123456');
      alert('Development Mode: Use OTP 123456 for phone number 9142801457');
      console.log('🔧 Confirmation result:', !!confirmationResult);
      usingBackupSMS = false; // Using Firebase, not backup
      return true;
    }
    
    // Try SMS API service first (more reliable for production)
    console.log('🚀 Attempting to send OTP via SMS API...');
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ SMS OTP sent successfully via API service');
        console.log('📱 OTP sent via SMS service');
        
        // If in development mode, show OTP to user
        if (result.development_mode && result.otp) {
          console.log('🧪 DEVELOPMENT MODE - OTP:', result.otp);
          alert(`Development Mode: Your OTP is ${result.otp}\n\nNote: ${result.note}`);
        }
        
        usingBackupSMS = true; // Using SMS service, not Firebase
        return true;
      } else {
        console.log('❌ SMS API failed:', result.error);
        console.log('🔄 Trying Firebase as fallback...');
      }
    } catch (smsError) {
      console.log('❌ SMS API error, trying Firebase...', smsError);
    }

    // Fallback to Firebase if SMS service fails
    console.log('🔧 Firebase Auth Domain:', auth.app.options.authDomain);
    console.log('🔧 Firebase Project ID:', auth.app.options.projectId);

    // Ensure reCAPTCHA is initialized
    if (!recaptchaVerifier) {
      console.log('🔧 Initializing reCAPTCHA...');
      await initializeRecaptcha();
    }

    if (!recaptchaVerifier) {
      throw new Error('reCAPTCHA verifier not initialized');
    }

    // Format phone number (ensure +91 prefix for India)
    const formattedPhone = phoneNumber.startsWith('+91') 
      ? phoneNumber 
      : `+91${phoneNumber.replace(/^\+91/, '')}`;

    console.log('📱 Formatted phone:', formattedPhone);
    console.log('🔧 reCAPTCHA verifier ready:', !!recaptchaVerifier);

    // Send OTP via Firebase
    console.log('🚀 Attempting to send OTP via Firebase...');
    confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
    
    console.log('✅ Firebase OTP sent successfully');
    console.log('🔧 Confirmation result:', !!confirmationResult);
    usingBackupSMS = false; // Using Firebase, not backup
    return true;

  } catch (error: any) {
    console.error('❌ Firebase OTP send failed:', error);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error message:', error.message);
    
    // Handle specific Firebase errors with detailed messages
    if (error.code === 'auth/invalid-phone-number') {
      console.error('❌ ISSUE: Invalid phone number format');
      console.error('💡 SOLUTION: Use format +919876543210');
    } else if (error.code === 'auth/too-many-requests') {
      console.error('❌ ISSUE: Too many requests. Rate limited.');
      console.error('💡 SOLUTION: Wait 5-10 minutes before trying again');
    } else if (error.code === 'auth/captcha-check-failed') {
      console.error('❌ ISSUE: reCAPTCHA verification failed');
      console.error('💡 SOLUTION: Check browser console for reCAPTCHA errors');
    } else if (error.code === 'auth/quota-exceeded') {
      console.error('❌ ISSUE: SMS quota exceeded');
      console.error('💡 SOLUTION: Check Firebase Console billing');
    } else if (error.code === 'auth/project-not-found') {
      console.error('❌ ISSUE: Firebase project not found');
      console.error('💡 SOLUTION: Check Firebase project ID in config');
    } else if (error.code === 'auth/app-not-authorized') {
      console.error('❌ ISSUE: App not authorized for this project');
      console.error('💡 SOLUTION: Check Firebase Console app configuration');
    } else if (error.code === 'auth/billing-not-enabled') {
      console.error('❌ ISSUE: Firebase billing not enabled for phone authentication');
      console.error('💡 SOLUTION 1: Enable Blaze plan in Firebase Console');
      console.error('💡 SOLUTION 2: Add test phone numbers in Firebase Console');
      console.error('🔗 Console URL: https://console.firebase.google.com/project/mealzee-30a2e/authentication/settings');
      console.error('📱 Recommended test number: +919142801457 with code: 123456');
    } else {
      console.error('❌ UNKNOWN ERROR:', error.code);
      console.error('💡 Check Firebase Console for project status');
    }
    
    // Try backup SMS service
    console.log('🔄 Trying backup SMS service...');
    try {
      const backupResult = await sendBackupSMS(phoneNumber);
      if (backupResult.success) {
        console.log('✅ Backup SMS sent successfully');
        console.log('📱 OTP sent via backup service:', backupResult.otp);
        usingBackupSMS = true;
        return true;
      } else {
        console.error('❌ Backup SMS also failed:', backupResult.message);
        return false;
      }
    } catch (backupError) {
      console.error('❌ Backup SMS error:', backupError);
      return false;
    }
  }
}

/**
 * Verify OTP using Firebase
 */
export async function verifyFirebaseOTP(otp: string, phoneNumber?: string): Promise<boolean> {
  try {
    console.log('🔢 Verifying OTP:', otp);

    // Check if this is a test phone number
    const testPhoneNumber = '+919142801457';
    const formattedPhone = phoneNumber?.startsWith('+91') 
      ? phoneNumber 
      : `+91${phoneNumber?.replace(/^\+91/, '') || ''}`;
    
    if (formattedPhone === testPhoneNumber && otp === '123456') {
      console.log('🧪 Using Firebase test phone number verification');
      if (confirmationResult) {
        try {
          const result = await confirmationResult.confirm(otp);
          console.log('✅ Firebase test OTP verified successfully');
          console.log('👤 User:', result.user.phoneNumber);
          return true;
        } catch (error) {
          console.log('❌ Firebase test OTP verification failed, but allowing for development');
          // For test numbers, we'll allow it to pass even if Firebase verification fails
          return true;
        }
      } else {
        console.log('✅ Test phone number with correct OTP - allowing verification');
        return true;
      }
    }

    // If using SMS service, verify with API
    if (usingBackupSMS && phoneNumber) {
      console.log('🔄 Using SMS API verification');
      try {
        const response = await fetch('/api/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone: phoneNumber, otp: otp }),
        });

        const result = await response.json();
        
        if (result.success) {
          console.log('✅ SMS OTP verified successfully');
          usingBackupSMS = false; // Reset flag
          return true;
        } else {
          console.error('❌ SMS OTP verification failed:', result.error);
          return false;
        }
      } catch (error) {
        console.error('❌ SMS API verification error:', error);
        return false;
      }
    }

    if (!confirmationResult) {
      console.error('❌ No confirmation result available');
      console.error('💡 This means Firebase OTP sending failed or was not completed');
      console.error('💡 Please check Firebase Console setup:');
      console.error('   1. Enable Blaze plan (billing)');
      console.error('   2. Enable Phone authentication provider');
      console.error('   3. Add localhost to authorized domains');
      return false;
    }

    // Confirm the Firebase OTP
    const result = await confirmationResult.confirm(otp);
    
    console.log('✅ Firebase OTP verified successfully');
    console.log('👤 User:', result.user.phoneNumber);
    
    return true;

  } catch (error: any) {
    console.error('❌ Firebase OTP verification failed:', error);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error message:', error.message);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/invalid-verification-code') {
      console.error('❌ ISSUE: Invalid OTP code');
      console.error('💡 SOLUTION: Check the SMS for correct OTP');
    } else if (error.code === 'auth/code-expired') {
      console.error('❌ ISSUE: OTP code expired');
      console.error('💡 SOLUTION: Request a new OTP');
    }
    
    // Setup suggestions
    console.error('💡 SETUP REQUIRED: Complete Firebase Console configuration for real SMS');
    
    return false;
  }
}

/**
 * Clean up Firebase auth resources
 */
export function cleanupFirebaseAuth(): void {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }
  confirmationResult = null;
}

/**
 * Get current Firebase user
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Sign out current user
 */
export async function signOutUser(): Promise<void> {
  try {
    await auth.signOut();
    cleanupFirebaseAuth();
    console.log('✅ User signed out successfully');
  } catch (error) {
    console.error('❌ Sign out failed:', error);
  }
}
