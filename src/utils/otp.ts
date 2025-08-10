/**
 * OTP Utility Functions
 * Provides OTP generation, validation, and helper functions
 */

/**
 * Generate a secure 4-digit OTP
 * @returns {string} 4-digit OTP string
 */
export function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Validate OTP format (4 digits)
 * @param {string} otp - OTP to validate
 * @returns {boolean} True if valid format
 */
export function validateOTPFormat(otp: string): boolean {
  return /^\d{4}$/.test(otp);
}

/**
 * Validate Indian phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid Indian phone number
 */
export function validatePhoneNumber(phone: string): boolean {
  const cleanPhone = phone.replace(/^\+91/, '').replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(cleanPhone);
}

/**
 * Clean and format phone number
 * @param {string} phone - Phone number to clean
 * @returns {string} Cleaned phone number (10 digits)
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/^\+91/, '').replace(/\D/g, '');
}

/**
 * Format phone number for display
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number (+91 XXXXX XXXXX)
 */
export function formatPhoneNumber(phone: string): string {
  const cleanPhone = cleanPhoneNumber(phone);
  if (cleanPhone.length === 10) {
    return `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;
  }
  return phone;
}

/**
 * Check if OTP is expired
 * @param {number} timestamp - OTP creation timestamp
 * @param {number} expiryMinutes - Expiry time in minutes (default: 5)
 * @returns {boolean} True if expired
 */
export function isOTPExpired(timestamp: number, expiryMinutes: number = 5): boolean {
  const timeElapsed = Date.now() - timestamp;
  return timeElapsed > expiryMinutes * 60 * 1000;
}

/**
 * Get remaining time for OTP expiry
 * @param {number} timestamp - OTP creation timestamp
 * @param {number} expiryMinutes - Expiry time in minutes (default: 5)
 * @returns {number} Remaining seconds (0 if expired)
 */
export function getOTPRemainingTime(timestamp: number, expiryMinutes: number = 5): number {
  const timeElapsed = Date.now() - timestamp;
  const expiryTime = expiryMinutes * 60 * 1000;
  const remaining = expiryTime - timeElapsed;
  return Math.max(0, Math.floor(remaining / 1000));
}

/**
 * Create OTP message with branding
 * @param {string} otp - OTP code
 * @param {string} brand - Brand name (default: Mealzee)
 * @param {number} validityMinutes - Validity in minutes (default: 5)
 * @returns {string} Formatted OTP message
 */
export function createOTPMessage(
  otp: string, 
  brand: string = 'Mealzee', 
  validityMinutes: number = 5
): string {
  return `${brand} OTP: ${otp}. Valid for ${validityMinutes} minutes. Do not share.`;
}

/**
 * Mask phone number for display
 * @param {string} phone - Phone number to mask
 * @returns {string} Masked phone number (XXXXX67890)
 */
export function maskPhoneNumber(phone: string): string {
  const cleanPhone = cleanPhoneNumber(phone);
  if (cleanPhone.length === 10) {
    return `XXXXX${cleanPhone.slice(-5)}`;
  }
  return phone;
}

/**
 * Generate a random string for session/request IDs
 * @param {number} length - Length of the string (default: 8)
 * @returns {string} Random alphanumeric string
 */
export function generateRandomId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Rate limiting helper - check if action is allowed
 * @param {number} lastActionTime - Timestamp of last action
 * @param {number} cooldownSeconds - Cooldown period in seconds
 * @returns {boolean} True if action is allowed
 */
export function isActionAllowed(lastActionTime: number, cooldownSeconds: number): boolean {
  return Date.now() - lastActionTime > cooldownSeconds * 1000;
}

/**
 * Get remaining cooldown time
 * @param {number} lastActionTime - Timestamp of last action
 * @param {number} cooldownSeconds - Cooldown period in seconds
 * @returns {number} Remaining seconds (0 if cooldown is over)
 */
export function getRemainingCooldown(lastActionTime: number, cooldownSeconds: number): number {
  const elapsed = Date.now() - lastActionTime;
  const cooldownMs = cooldownSeconds * 1000;
  const remaining = cooldownMs - elapsed;
  return Math.max(0, Math.ceil(remaining / 1000));
}

/**
 * Validate environment variables for Message Central service
 * @returns {object} Validation result with missing variables
 */
export function validateMessageCentralConfig(): { valid: boolean; missing: string[] } {
  // Message Central configuration is hardcoded in the message-central.ts file
  // This function is kept for compatibility with existing code
  return {
    valid: true,
    missing: []
  };
}

/**
 * Log OTP operation for debugging
 * @param {string} operation - Operation type (send/verify/store)
 * @param {string} phone - Phone number (will be masked in logs)
 * @param {object} data - Additional data to log
 */
export function logOTPOperation(operation: string, phone: string, data: any = {}): void {
  const maskedPhone = maskPhoneNumber(phone);
  console.log(`🔐 OTP ${operation.toUpperCase()}:`, {
    phone: maskedPhone,
    timestamp: new Date().toISOString(),
    ...data
  });
}

/**
 * Validate environment variables for SMS service
 * @returns {object} Validation result with missing variables
 */
export function validateSMSConfig(): { valid: boolean; missing: string[] } {
  const required = ['SMS_API_BASE_URL', 'SMS_API_TOKEN', 'SMS_CLIENT_ID'];
  const missing = required.filter(key => !process.env[key]);
  
  return {
    valid: missing.length === 0,
    missing
  };
}
