// Backup SMS Service for Real OTP Delivery
// This provides real SMS delivery while Firebase is being set up

interface SMSResponse {
  success: boolean;
  message: string;
  otp?: string;
}

// Store OTP temporarily for verification
let currentOTP: string | null = null;
let otpPhoneNumber: string | null = null;
let otpTimestamp: number | null = null;

/**
 * Generate a 6-digit OTP
 */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send SMS using Fast2SMS (Free tier available)
 */
export async function sendBackupSMS(phoneNumber: string): Promise<SMSResponse> {
  try {
    console.log('📱 Sending backup SMS to:', phoneNumber);
    
    // Generate OTP
    const otp = generateOTP();
    currentOTP = otp;
    otpPhoneNumber = phoneNumber;
    otpTimestamp = Date.now();
    
    // Format phone number (remove +91 if present)
    const cleanPhone = phoneNumber.replace(/^\+91/, '');
    
    // SMS message
    const message = `Your Mealzee verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`;
    
    // Fast2SMS API call
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': process.env.FAST2SMS_API_KEY || 'YOUR_FAST2SMS_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'v3',
        sender_id: 'MEALZE',
        message: message,
        language: 'english',
        flash: 0,
        numbers: cleanPhone
      })
    });
    
    const data = await response.json();
    
    if (data.return === true) {
      console.log('✅ Backup SMS sent successfully');
      return {
        success: true,
        message: 'OTP sent successfully',
        otp: otp // For development logging
      };
    } else {
      console.error('❌ Fast2SMS failed:', data);
      return {
        success: false,
        message: 'Failed to send SMS'
      };
    }
    
  } catch (error) {
    console.error('❌ Backup SMS error:', error);
    return {
      success: false,
      message: 'SMS service error'
    };
  }
}

/**
 * Verify OTP sent via backup SMS
 */
export function verifyBackupOTP(otp: string, phoneNumber: string): boolean {
  try {
    console.log('🔢 Verifying backup OTP:', otp);
    
    // Check if OTP exists
    if (!currentOTP || !otpPhoneNumber || !otpTimestamp) {
      console.error('❌ No OTP found for verification');
      return false;
    }
    
    // Check phone number match
    if (otpPhoneNumber !== phoneNumber) {
      console.error('❌ Phone number mismatch');
      return false;
    }
    
    // Check OTP expiry (10 minutes)
    const now = Date.now();
    const otpAge = now - otpTimestamp;
    const maxAge = 10 * 60 * 1000; // 10 minutes
    
    if (otpAge > maxAge) {
      console.error('❌ OTP expired');
      currentOTP = null;
      otpPhoneNumber = null;
      otpTimestamp = null;
      return false;
    }
    
    // Check OTP match
    if (currentOTP !== otp) {
      console.error('❌ Invalid OTP');
      return false;
    }
    
    // OTP verified successfully
    console.log('✅ Backup OTP verified successfully');
    
    // Clear OTP after successful verification
    currentOTP = null;
    otpPhoneNumber = null;
    otpTimestamp = null;
    
    return true;
    
  } catch (error) {
    console.error('❌ OTP verification error:', error);
    return false;
  }
}

/**
 * Alternative: Use TextLocal SMS API (India-specific)
 */
export async function sendTextLocalSMS(phoneNumber: string): Promise<SMSResponse> {
  try {
    console.log('📱 Sending TextLocal SMS to:', phoneNumber);
    
    const otp = generateOTP();
    currentOTP = otp;
    otpPhoneNumber = phoneNumber;
    otpTimestamp = Date.now();
    
    const cleanPhone = phoneNumber.replace(/^\+91/, '');
    const message = `Your Mealzee OTP is ${otp}. Valid for 10 minutes.`;
    
    const response = await fetch('https://api.textlocal.in/send/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        apikey: process.env.TEXTLOCAL_API_KEY || 'YOUR_TEXTLOCAL_API_KEY',
        numbers: cleanPhone,
        message: message,
        sender: 'MEALZE'
      })
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('✅ TextLocal SMS sent successfully');
      return {
        success: true,
        message: 'OTP sent successfully',
        otp: otp
      };
    } else {
      console.error('❌ TextLocal failed:', data);
      return {
        success: false,
        message: 'Failed to send SMS'
      };
    }
    
  } catch (error) {
    console.error('❌ TextLocal SMS error:', error);
    return {
      success: false,
      message: 'SMS service error'
    };
  }
}

/**
 * Free SMS service using MSG91 (Alternative)
 */
export async function sendMSG91SMS(phoneNumber: string): Promise<SMSResponse> {
  try {
    console.log('📱 Sending MSG91 SMS to:', phoneNumber);
    
    const otp = generateOTP();
    currentOTP = otp;
    otpPhoneNumber = phoneNumber;
    otpTimestamp = Date.now();
    
    const cleanPhone = phoneNumber.replace(/^\+91/, '');
    
    const response = await fetch('https://api.msg91.com/api/v5/otp', {
      method: 'POST',
      headers: {
        'authkey': process.env.MSG91_API_KEY || 'YOUR_MSG91_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        template_id: process.env.MSG91_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
        mobile: cleanPhone,
        authkey: process.env.MSG91_API_KEY || 'YOUR_MSG91_API_KEY',
        otp: otp
      })
    });
    
    const data = await response.json();
    
    if (data.type === 'success') {
      console.log('✅ MSG91 SMS sent successfully');
      return {
        success: true,
        message: 'OTP sent successfully',
        otp: otp
      };
    } else {
      console.error('❌ MSG91 failed:', data);
      return {
        success: false,
        message: 'Failed to send SMS'
      };
    }
    
  } catch (error) {
    console.error('❌ MSG91 SMS error:', error);
    return {
      success: false,
      message: 'SMS service error'
    };
  }
}