// New SMS Gateway Service for OTP Authentication
// Replaces Fast2SMS with custom SMS gateway

import { createClient } from 'redis';

interface MessageCentralResponse {
  responseCode: number;
  message: string;
  verificationId?: string;
  error?: string;
}

interface OTPData {
  phone: string;
  otp: string;
}

interface MessageCentralRequestBody {
  countryCode: string;
  customerId: string;
  flowType: string;
  mobileNumber: string;
  otpLength: number;
  otpExpiry: number;
  templateId?: string;
  senderId?: string;
  message?: string;
}

// Message Central Configuration
const MESSAGECENTRAL_BASE_URL = process.env.MESSAGECENTRAL_BASE_URL;
const MESSAGECENTRAL_VALIDATE_URL = process.env.MESSAGECENTRAL_VALIDATE_URL;
const MESSAGECENTRAL_TOKEN = process.env.MESSAGECENTRAL_TOKEN;
const MESSAGECENTRAL_CLIENT_ID = process.env.MESSAGECENTRAL_CLIENT_ID;

/**
 * Generate a 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP SMS using Message Central Verification API
 */
export async function sendOTPSMS(phone: string, otp: string): Promise<boolean> {
  try {
    // Validate environment variables
    if (!MESSAGECENTRAL_BASE_URL || !MESSAGECENTRAL_TOKEN || !MESSAGECENTRAL_CLIENT_ID) {
      console.error('❌ Message Central configuration missing in environment variables');
      console.error('Missing:', {
        MESSAGECENTRAL_BASE_URL: !MESSAGECENTRAL_BASE_URL,
        MESSAGECENTRAL_TOKEN: !MESSAGECENTRAL_TOKEN,
        MESSAGECENTRAL_CLIENT_ID: !MESSAGECENTRAL_CLIENT_ID
      });
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

    // Format phone number with country code for Message Central
    const formattedPhone = `91${cleanPhone}`; // Message Central typically expects without +

    // Message Central verification API request body
    const requestBody = {
      countryCode: "91",
      customerId: MESSAGECENTRAL_CLIENT_ID,
      flowType: "SMS",
      mobileNumber: cleanPhone,
      // Message Central generates OTP automatically, but we can send custom message
      otpLength: 6,
      otpExpiry: 300, // 5 minutes in seconds
      templateId: "MEALZEE_OTP", // You may need to create this template
      senderId: "MEALZE", // 6-character sender ID
      message: `Mealzee OTP: {#var#}. Valid for 5 minutes. Do not share.`
    };

    console.log('📤 Sending OTP request to Message Central Verification API...');
    console.log('📤 Request URL:', MESSAGECENTRAL_BASE_URL);
    console.log('📤 Request body:', requestBody);

    const response = await fetch(MESSAGECENTRAL_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MESSAGECENTRAL_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Message Central Verification API error:', response.status, errorText);
      return false;
    }

    const data = await response.json();
    console.log('📥 Response data:', data);

    // Message Central verification API typically returns verificationId on success
    if (data.responseCode === 200 || data.verificationId) {
      console.log('✅ OTP sent successfully via Message Central. Verification ID:', data.verificationId);
      return true;
    } else {
      console.error('❌ Message Central returned error:', data.message || data.error || 'Unknown error');
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending OTP via Message Central:', error);
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

// Redis client for production
let redisClient: any = null;

/**
 * Initialize Redis client for production
 */
async function getRedisClient() {
  if (process.env.NODE_ENV === 'production' && !redisClient) {
    try {
      redisClient = createClient({
        url: process.env.REDIS_URL,
        password: process.env.REDIS_PASSWORD
      });
      await redisClient.connect();
      console.log('✅ Redis connected for production OTP storage');
    } catch (error) {
      console.error('❌ Redis connection failed:', error);
      redisClient = null;
    }
  }
  return redisClient;
}

/**
 * Store OTP in memory (for development) or Redis (for production)
 * Using a global variable to persist across hot reloads in development
 */
declare global {
  var __otpStore: Map<string, { otp: string; timestamp: number; attempts: number }> | undefined;
  var __bruteForceStore: Map<string, { attempts: number; firstAttempt: number; blockedUntil?: number }> | undefined;
}

const otpStore = globalThis.__otpStore ?? new Map<string, { otp: string; timestamp: number; attempts: number }>();
globalThis.__otpStore = otpStore;

// Brute-force protection store
const bruteForceStore = globalThis.__bruteForceStore ?? new Map<string, { attempts: number; firstAttempt: number; blockedUntil?: number }>();
globalThis.__bruteForceStore = bruteForceStore;

/**
 * Check brute-force protection (max 5 attempts per phone per hour)
 */
export function checkBruteForceProtection(phone: string): { allowed: boolean; remainingTime?: number } {
  const cleanPhone = phone.replace(/^\+91/, '').replace(/\D/g, '');
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  const bruteForceData = bruteForceStore.get(cleanPhone);

  if (!bruteForceData) {
    return { allowed: true };
  }

  // Check if blocked period has expired
  if (bruteForceData.blockedUntil && now < bruteForceData.blockedUntil) {
    const remainingTime = Math.ceil((bruteForceData.blockedUntil - now) / 1000 / 60); // minutes
    console.log(`🚫 Phone ${cleanPhone} is blocked for ${remainingTime} more minutes`);
    return { allowed: false, remainingTime };
  }

  // Reset if more than an hour has passed since first attempt
  if (now - bruteForceData.firstAttempt > oneHour) {
    bruteForceStore.delete(cleanPhone);
    return { allowed: true };
  }

  // Check if already reached max attempts
  if (bruteForceData.attempts >= 5) {
    const remainingTime = Math.ceil((bruteForceData.firstAttempt + oneHour - now) / 1000 / 60);
    console.log(`🚫 Phone ${cleanPhone} has exceeded max attempts, blocked for ${remainingTime} more minutes`);
    return { allowed: false, remainingTime };
  }

  return { allowed: true };
}

/**
 * Record failed OTP attempt for brute-force protection
 */
export function recordFailedAttempt(phone: string): void {
  const cleanPhone = phone.replace(/^\+91/, '').replace(/\D/g, '');
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  const existing = bruteForceStore.get(cleanPhone);

  if (!existing) {
    bruteForceStore.set(cleanPhone, {
      attempts: 1,
      firstAttempt: now
    });
  } else {
    // Reset if more than an hour has passed
    if (now - existing.firstAttempt > oneHour) {
      bruteForceStore.set(cleanPhone, {
        attempts: 1,
        firstAttempt: now
      });
    } else {
      existing.attempts++;

      // Block for remaining time if reached max attempts
      if (existing.attempts >= 5) {
        existing.blockedUntil = existing.firstAttempt + oneHour;
      }
    }
  }

  console.log(`⚠️ Failed attempt recorded for ${cleanPhone}. Total attempts: ${bruteForceStore.get(cleanPhone)?.attempts}`);
}

/**
 * Store OTP for verification
 */
export async function storeOTP(phone: string, otp: string): Promise<void> {
  const cleanPhone = phone.replace(/^\+91/, '').replace(/\D/g, '');

  console.log('💾 Storing OTP Debug:');
  console.log('📱 Input phone:', phone);
  console.log('📱 Cleaned phone:', cleanPhone);
  console.log('🔢 OTP to store:', otp, '(type:', typeof otp, ')');

  const otpData = {
    otp,
    timestamp: Date.now(),
    attempts: 0
  };

  // Use Redis in production, memory in development
  if (process.env.NODE_ENV === 'production') {
    try {
      const redis = await getRedisClient();
      if (redis) {
        await redis.setEx(`otp:${cleanPhone}`, 300, JSON.stringify(otpData)); // 5 minutes expiry
        console.log('💾 OTP stored in Redis');
        return;
      }
    } catch (error) {
      console.error('❌ Redis storage failed, falling back to memory:', error);
    }
  }

  // Fallback to memory storage
  otpStore.set(cleanPhone, otpData);
  console.log('💾 OTP stored in memory');
  console.log('🗂️ Current OTP store:', Array.from(otpStore.entries()));

  // Clean up expired OTPs (5 minutes)
  setTimeout(() => {
    otpStore.delete(cleanPhone);
  }, 5 * 60 * 1000);
}

/**
 * Verify OTP with Redis support and enhanced brute-force protection
 */
export async function verifyOTP(phone: string, otp: string): Promise<boolean> {
  const cleanPhone = phone.replace(/^\+91/, '').replace(/\D/g, '');

  console.log('🔍 OTP Verification Debug:');
  console.log('📱 Input phone:', phone);
  console.log('📱 Cleaned phone:', cleanPhone);
  console.log('🔢 Input OTP:', otp);

  // Check brute-force protection first
  const bruteForceCheck = checkBruteForceProtection(cleanPhone);
  if (!bruteForceCheck.allowed) {
    console.log('🚫 Brute-force protection triggered');
    return false;
  }

  let stored: { otp: string; timestamp: number; attempts: number } | null = null;

  // Try to get from Redis in production
  if (process.env.NODE_ENV === 'production') {
    try {
      const redis = await getRedisClient();
      if (redis) {
        const redisData = await redis.get(`otp:${cleanPhone}`);
        if (redisData) {
          stored = JSON.parse(redisData);
          console.log('💾 OTP retrieved from Redis');
        }
      }
    } catch (error) {
      console.error('❌ Redis retrieval failed, falling back to memory:', error);
    }
  }

  // Fallback to memory storage
  if (!stored) {
    stored = otpStore.get(cleanPhone) || null;
    console.log('💾 OTP retrieved from memory');
  }

  console.log('💾 Stored data:', stored);

  if (!stored) {
    console.log('❌ No OTP found for phone:', cleanPhone);
    recordFailedAttempt(cleanPhone);
    return false;
  }

  // Check if OTP is expired (5 minutes)
  const timeElapsed = Date.now() - stored.timestamp;
  const isExpired = timeElapsed > 5 * 60 * 1000;
  console.log('⏰ Time elapsed:', Math.floor(timeElapsed / 1000), 'seconds');
  console.log('⏰ Is expired:', isExpired);

  if (isExpired) {
    console.log('❌ OTP expired, deleting...');
    await deleteOTP(cleanPhone);
    recordFailedAttempt(cleanPhone);
    return false;
  }

  // Check attempts limit (3 attempts per OTP)
  console.log('🔄 Current attempts:', stored.attempts);
  if (stored.attempts >= 3) {
    console.log('❌ Too many attempts for this OTP, deleting...');
    await deleteOTP(cleanPhone);
    recordFailedAttempt(cleanPhone);
    return false;
  }

  // Increment attempts
  stored.attempts++;
  console.log('🔄 Incremented attempts to:', stored.attempts);

  // Update stored data with new attempt count
  await updateOTPAttempts(cleanPhone, stored);

  // Verify OTP
  console.log('🔍 Comparing OTPs:');
  console.log('🔍 Stored OTP:', stored.otp, '(type:', typeof stored.otp, ')');
  console.log('🔍 Input OTP:', otp, '(type:', typeof otp, ')');
  console.log('🔍 Are equal:', stored.otp === otp);

  if (stored.otp === otp) {
    console.log('✅ OTP verified successfully, deleting...');
    await deleteOTP(cleanPhone);
    return true;
  }

  console.log('❌ OTP mismatch');
  recordFailedAttempt(cleanPhone);
  return false;
}

/**
 * Delete OTP from storage (Redis or memory)
 */
async function deleteOTP(cleanPhone: string): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    try {
      const redis = await getRedisClient();
      if (redis) {
        await redis.del(`otp:${cleanPhone}`);
        return;
      }
    } catch (error) {
      console.error('❌ Redis deletion failed:', error);
    }
  }

  otpStore.delete(cleanPhone);
}

/**
 * Update OTP attempts in storage
 */
async function updateOTPAttempts(cleanPhone: string, otpData: { otp: string; timestamp: number; attempts: number }): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    try {
      const redis = await getRedisClient();
      if (redis) {
        const ttl = await redis.ttl(`otp:${cleanPhone}`);
        if (ttl > 0) {
          await redis.setEx(`otp:${cleanPhone}`, ttl, JSON.stringify(otpData));
        }
        return;
      }
    } catch (error) {
      console.error('❌ Redis update failed:', error);
    }
  }

  otpStore.set(cleanPhone, otpData);
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
  
  // Allow resend after 30 seconds
  return Date.now() - lastSent > 30 * 1000;
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
