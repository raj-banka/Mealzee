// Firebase Phone Authentication Service
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult,
  Auth
} from 'firebase/auth';
import { auth } from './firebase';

// Global variables to store verifier and confirmation result
let recaptchaVerifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;

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
    console.log('📱 Sending Firebase OTP to:', phoneNumber);

    // Ensure reCAPTCHA is initialized
    if (!recaptchaVerifier) {
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

    // Send OTP
    confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
    
    console.log('✅ Firebase OTP sent successfully');
    return true;

  } catch (error: any) {
    console.error('❌ Firebase OTP send failed:', error);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/invalid-phone-number') {
      console.error('Invalid phone number format');
    } else if (error.code === 'auth/too-many-requests') {
      console.error('Too many requests. Try again later.');
    } else if (error.code === 'auth/captcha-check-failed') {
      console.error('reCAPTCHA verification failed');
    }
    
    return false;
  }
}

/**
 * Verify OTP using Firebase
 */
export async function verifyFirebaseOTP(otp: string): Promise<boolean> {
  try {
    console.log('🔢 Verifying Firebase OTP:', otp);

    if (!confirmationResult) {
      console.error('❌ No confirmation result available');
      return false;
    }

    // Confirm the OTP
    const result = await confirmationResult.confirm(otp);
    
    console.log('✅ Firebase OTP verified successfully');
    console.log('👤 User:', result.user.phoneNumber);
    
    return true;

  } catch (error: any) {
    console.error('❌ Firebase OTP verification failed:', error);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/invalid-verification-code') {
      console.error('Invalid OTP code');
    } else if (error.code === 'auth/code-expired') {
      console.error('OTP code expired');
    }
    
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
