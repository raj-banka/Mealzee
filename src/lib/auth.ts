
// WhatsApp-based Authentication Service using Message Central
// Provides OTP authentication using WhatsApp via Message Central API service

interface AuthUser {
  phone: string;
  isAuthenticated: boolean;
}

// Global variables to track authentication state
let currentUser: AuthUser | null = null;
let authStateListeners: ((user: AuthUser | null) => void)[] = [];

/**
 * Auth state listener
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  authStateListeners.push(callback);
  
  // Immediately call with current state
  callback(currentUser);
  
  // Return unsubscribe function
  return () => {
    authStateListeners = authStateListeners.filter(listener => listener !== callback);
  };
}

/**
 * Notify all auth state listeners
 */
function notifyAuthStateChange() {
  authStateListeners.forEach(listener => listener(currentUser));
}

/**
 * Send OTP to phone number using WhatsApp via Message Central
 */
export async function sendWhatsAppOTP(phoneNumber: string): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    console.log('📱 Sending WhatsApp OTP to:', phoneNumber);
    // Send OTP via WhatsApp using Message Central API
    console.log('🚀 Sending OTP via WhatsApp (Message Central)...');
    const response = await fetch('/api/whatsapp-otp/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: phoneNumber }),
    });
    const result = await response.json();
    if (result.success) {
      console.log('✅ WhatsApp OTP sent successfully via Message Central');
      return { success: true, message: result.message };
    } else {
      // Only log error if not a weird 'SUCCESS' string
      if (!result.error || result.error === 'SUCCESS') {
        // Treat as success, but log a warning
        console.warn('⚠️ WhatsApp OTP API returned ambiguous success:', result);
        return { success: true, message: result.message || 'OTP sent (ambiguous response)' };
      }
      console.log('❌ WhatsApp OTP API failed:', result.error);
      return { success: false, error: result.error || 'Failed to send OTP' };
    }
  } catch (error: any) {
    console.error('❌ WhatsApp OTP send failed:', error);
    return { success: false, error: 'Service unavailable. Please try again.' };
  }
}

/**
 * Verify OTP using WhatsApp via Message Central
 */
export async function verifyWhatsAppOTP(otp: string, phoneNumber: string): Promise<boolean> {
  try {
    console.log('🔢 Verifying WhatsApp OTP:', otp, 'for phone:', phoneNumber);

    // Verify OTP with WhatsApp Message Central API
    const response = await fetch('/api/whatsapp-otp/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: phoneNumber, otp: otp }),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ WhatsApp OTP verified successfully');
      
      // Set current user as authenticated
      currentUser = {
        phone: phoneNumber,
        isAuthenticated: true
      };
      
      // Notify auth state listeners
      notifyAuthStateChange();
      
      return true;
    } else {
      console.error('❌ WhatsApp OTP verification failed:', result.error);
      return false;
    }
  } catch (error: any) {
    console.error('❌ WhatsApp OTP verification error:', error);
    return false;
  }
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): AuthUser | null {
  return currentUser;
}

/**
 * Sign out current user
 */
export async function signOutUser(): Promise<void> {
  try {
    currentUser = null;
    notifyAuthStateChange();
    console.log('✅ User signed out successfully');
  } catch (error) {
    console.error('❌ Sign out failed:', error);
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return currentUser !== null && currentUser.isAuthenticated;
}

/**
 * Initialize authentication (no setup needed for SMS-based auth)
 */
export function initializeAuth(): Promise<void> {
  return Promise.resolve();
}

/**
 * Clean up authentication resources (no cleanup needed for SMS-based auth)
 */
export function cleanupAuth(): void {
  // No cleanup needed for SMS-based authentication
  console.log('🧹 SMS auth cleanup completed');
}