// SMS-based Authentication Service using Fast2SMS
// Replaces Firebase authentication with Fast2SMS OTP service

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
 * Send OTP to phone number using Fast2SMS
 */
export async function sendSMSOTP(phoneNumber: string): Promise<boolean> {
  try {
    console.log('📱 Sending OTP to:', phoneNumber);
    
    // Send OTP via Fast2SMS API
    console.log('🚀 Sending OTP via Fast2SMS...');
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: phoneNumber }),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ SMS OTP sent successfully via Fast2SMS');
      console.log('📱 OTP sent to phone number');
      
      // If in development mode, show OTP to user
      if (result.development_mode && result.otp) {
        console.log('🧪 DEVELOPMENT MODE - OTP:', result.otp);
        alert(`Development Mode: Your OTP is ${result.otp}\n\nNote: ${result.note}`);
      }
      
      return true;
    } else {
      console.log('❌ Fast2SMS API failed:', result.error);
      return false;
    }
  } catch (error: any) {
    console.error('❌ Fast2SMS OTP send failed:', error);
    return false;
  }
}

/**
 * Verify OTP using Fast2SMS
 */
export async function verifySMSOTP(otp: string, phoneNumber: string): Promise<boolean> {
  try {
    console.log('🔢 Verifying OTP:', otp, 'for phone:', phoneNumber);

    // Verify OTP with Fast2SMS API
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
      
      // Set current user as authenticated
      currentUser = {
        phone: phoneNumber,
        isAuthenticated: true
      };
      
      // Notify auth state listeners
      notifyAuthStateChange();
      
      return true;
    } else {
      console.error('❌ SMS OTP verification failed:', result.error);
      return false;
    }
  } catch (error: any) {
    console.error('❌ SMS OTP verification error:', error);
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