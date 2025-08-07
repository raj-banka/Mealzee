// Free SMS OTP Service using Fast2SMS
// Provides ₹50 free credit after signup

interface SMSResponse {
  return: boolean;
  request_id?: string;
  message?: string[];
  status_code?: number;
}

interface OTPData {
  phone: string;
  otp: string;
}

interface SMSRequestBody extends Record<string, string> {
  sender_id: string;
  message: string;
  language: string;
  route: string;
  numbers: string;
}

// Fast2SMS Configuration
const FAST2SMS_API_URL = 'https://www.fast2sms.com/dev/bulkV2';

/**
 * Generate a 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP SMS using Fast2SMS free API
 */
export async function sendOTPSMS(phone: string, otp: string): Promise<boolean> {
  try {
    // Get API key from environment variables
    const apiKey = process.env.FAST2SMS_API_KEY;

    console.log('🔑 API Key configured:', apiKey ? 'Yes' : 'No');
    console.log('🔑 API Key length:', apiKey?.length || 0);

    if (!apiKey) {
      console.error('❌ Fast2SMS API key not configured in environment variables');
      return false;
    }

    // Clean phone number (remove +91 if present)
    const cleanPhone = phone.replace(/^\+91/, '').replace(/\D/g, '');
    console.log('📱 Original phone:', phone);
    console.log('📱 Cleaned phone:', cleanPhone);

    if (cleanPhone.length !== 10) {
      console.error('❌ Invalid phone number format. Length:', cleanPhone.length);
      return false;
    }

    // Try multiple routes to find one that works
    const message = `Your Mealzee OTP is ${otp}. Valid for 5 minutes. Do not share with anyone.`;

    // First try: OTP route (route 'otp') - most reliable for OTP messages
    let requestBody: SMSRequestBody = {
      sender_id: 'FSTSMS',
      message: message,
      language: 'english',
      route: 'otp',
      numbers: cleanPhone
    };

    console.log('📤 Sending SMS request to Fast2SMS (Route OTP)...');
    console.log('📤 Request URL:', FAST2SMS_API_URL);
    console.log('📤 Request body:', requestBody);

    let response = await fetch(FAST2SMS_API_URL, {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache'
      },
      body: new URLSearchParams(requestBody).toString()
    });

    console.log('📥 Response status (OTP):', response.status);
    let data = await response.json();
    console.log('📥 Response data (OTP):', data);

    // If OTP route fails, try route 'q' (quick)
    if (!data.return || !response.ok) {
      console.log('📤 Trying route q (quick)...');

      requestBody = {
        sender_id: 'FSTSMS',
        message: message,
        language: 'english',
        route: 'q',
        numbers: cleanPhone
      };

      response = await fetch(FAST2SMS_API_URL, {
        method: 'POST',
        headers: {
          'authorization': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
          'cache-control': 'no-cache'
        },
        body: new URLSearchParams(requestBody).toString()
      });

      console.log('📥 Response status (q):', response.status);
      data = await response.json();
      console.log('📥 Response data (q):', data);
    }

    // If both fail, try route 'p' (promotional)
    if (!data.return || !response.ok) {
      console.log('📤 Trying route p (promotional)...');

      requestBody = {
        sender_id: 'TXTLCL',
        message: message,
        language: 'english',
        route: 'p',
        numbers: cleanPhone
      };

      response = await fetch(FAST2SMS_API_URL, {
        method: 'POST',
        headers: {
          'authorization': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
          'cache-control': 'no-cache'
        },
        body: new URLSearchParams(requestBody).toString()
      });

      console.log('📥 Response status (p):', response.status);
      data = await response.json();
      console.log('📥 Response data (p):', data);
    }

    console.log('📥 Final response status:', response.status);
    console.log('📥 Final response ok:', response.ok);
    console.log('📥 Final response data:', JSON.stringify(data, null, 2));

    // Final response handling
    if (data.return && response.ok) {
      console.log('✅ OTP sent successfully! Request ID:', data.request_id);
      return true;
    } else {
      console.error('❌ All routes failed to send OTP. Status:', response.status);
      console.error('❌ Final error details:', data.message || data);
      console.error('❌ Status code:', data.status_code);
      console.error('❌ Full response:', JSON.stringify(data, null, 2));

      // Provide helpful error messages based on status code
      if (data.status_code === 996) {
        console.error('💡 Error 996: Website verification required for OTP route');
        console.error('💡 Solution: Verify your website in Fast2SMS dashboard');
      } else if (data.status_code === 400) {
        console.error('💡 Error 400: Bad request - check API parameters');
      } else if (data.status_code === 401) {
        console.error('💡 Error 401: Invalid API key');
        console.error('💡 Solution: Check your Fast2SMS API key in .env.local');
      } else if (data.status_code === 402) {
        console.error('💡 Error 402: Insufficient balance');
        console.error('💡 Solution: Recharge your Fast2SMS account');
      } else if (data.status_code === 403) {
        console.error('💡 Error 403: Forbidden - API access denied');
      } else if (data.status_code === 429) {
        console.error('💡 Error 429: Too many requests - rate limited');
      }

      return false;
    }
  } catch (error) {
    console.error('❌ Error sending OTP SMS:', error);
    return false;
  }
}

/**
 * Validate OTP format
 */
export function validateOTP(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}

/**
 * Validate Indian phone number
 */
export function validatePhoneNumber(phone: string): boolean {
  const cleanPhone = phone.replace(/^\+91/, '').replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(cleanPhone);
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleanPhone = phone.replace(/^\+91/, '').replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    return `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;
  }
  return phone;
}

/**
 * Store OTP in memory (for development - use Redis/database in production)
 * Using a global variable to persist across hot reloads in development
 */
declare global {
  var __otpStore: Map<string, { otp: string; timestamp: number; attempts: number }> | undefined;
}

const otpStore = globalThis.__otpStore ?? new Map<string, { otp: string; timestamp: number; attempts: number }>();
globalThis.__otpStore = otpStore;

/**
 * Store OTP for verification
 */
export function storeOTP(phone: string, otp: string): void {
  const cleanPhone = phone.replace(/^\+91/, '').replace(/\D/g, '');
  
  console.log('💾 Storing OTP Debug:');
  console.log('📱 Input phone:', phone);
  console.log('📱 Cleaned phone:', cleanPhone);
  console.log('🔢 OTP to store:', otp, '(type:', typeof otp, ')');
  
  otpStore.set(cleanPhone, {
    otp,
    timestamp: Date.now(),
    attempts: 0
  });
  
  console.log('💾 OTP stored successfully');
  console.log('🗂️ Current OTP store:', Array.from(otpStore.entries()));
  
  // Clean up expired OTPs (5 minutes)
  setTimeout(() => {
    otpStore.delete(cleanPhone);
  }, 5 * 60 * 1000);
}

/**
 * Verify OTP
 */
export function verifyOTP(phone: string, otp: string): boolean {
  const cleanPhone = phone.replace(/^\+91/, '').replace(/\D/g, '');
  const stored = otpStore.get(cleanPhone);
  
  console.log('🔍 OTP Verification Debug:');
  console.log('📱 Input phone:', phone);
  console.log('📱 Cleaned phone:', cleanPhone);
  console.log('🔢 Input OTP:', otp);
  console.log('💾 Stored data:', stored);
  console.log('🗂️ All stored OTPs:', Array.from(otpStore.entries()));
  
  if (!stored) {
    console.log('❌ No OTP found for phone:', cleanPhone);
    return false;
  }
  
  // Check if OTP is expired (5 minutes)
  const timeElapsed = Date.now() - stored.timestamp;
  const isExpired = timeElapsed > 5 * 60 * 1000;
  console.log('⏰ Time elapsed:', Math.floor(timeElapsed / 1000), 'seconds');
  console.log('⏰ Is expired:', isExpired);
  
  if (isExpired) {
    console.log('❌ OTP expired, deleting...');
    otpStore.delete(cleanPhone);
    return false;
  }
  
  // Check attempts limit (3 attempts)
  console.log('🔄 Current attempts:', stored.attempts);
  if (stored.attempts >= 3) {
    console.log('❌ Too many attempts, deleting...');
    otpStore.delete(cleanPhone);
    return false;
  }
  
  // Increment attempts
  stored.attempts++;
  console.log('🔄 Incremented attempts to:', stored.attempts);
  
  // Verify OTP
  console.log('🔍 Comparing OTPs:');
  console.log('🔍 Stored OTP:', stored.otp, '(type:', typeof stored.otp, ')');
  console.log('🔍 Input OTP:', otp, '(type:', typeof otp, ')');
  console.log('🔍 Are equal:', stored.otp === otp);
  
  if (stored.otp === otp) {
    console.log('✅ OTP verified successfully, deleting...');
    otpStore.delete(cleanPhone);
    return true;
  }
  
  console.log('❌ OTP mismatch');
  return false;
}

/**
 * Check if OTP can be resent (rate limiting)
 * Using a global variable to persist across hot reloads in development
 */
declare global {
  var __resendStore: Map<string, number> | undefined;
}

const resendStore = globalThis.__resendStore ?? new Map<string, number>();
globalThis.__resendStore = resendStore;

export function canResendOTP(phone: string): boolean {
  const cleanPhone = phone.replace(/^\+91/, '').replace(/\D/g, '');
  const lastSent = resendStore.get(cleanPhone);
  
  if (!lastSent) {
    return true;
  }
  
  // Allow resend after 60 seconds
  return Date.now() - lastSent > 60 * 1000;
}

/**
 * Mark OTP as sent for rate limiting
 */
export function markOTPSent(phone: string): void {
  const cleanPhone = phone.replace(/^\+91/, '').replace(/\D/g, '');
  resendStore.set(cleanPhone, Date.now());
  
  // Clean up after 10 minutes
  setTimeout(() => {
    resendStore.delete(cleanPhone);
  }, 10 * 60 * 1000);
}

/**
 * Debug function to get current OTP store state
 */
export function getOTPStoreDebug(): Array<[string, { otp: string; timestamp: number; attempts: number }]> {
  return Array.from(otpStore.entries());
}
