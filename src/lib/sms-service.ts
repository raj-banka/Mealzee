/**
 * SMS Service for sending OTP messages
 * Uses the new SMS Gateway API
 */

interface SMSResponse {
  status: string;
  messageId?: string;
  error?: string;
}

interface SMSRequestBody {
  to: string;
  message: string;
}

interface SMSConfig {
  baseUrl: string;
  token: string;
  clientId: string;
}

/**
 * SMS Service Class
 */
export class SMSService {
  private config: SMSConfig;

  constructor() {
    this.config = {
      baseUrl: process.env.SMS_API_BASE_URL || '',
      token: process.env.SMS_API_TOKEN || '',
      clientId: process.env.SMS_CLIENT_ID || ''
    };
  }

  /**
   * Validate SMS configuration
   */
  private validateConfig(): boolean {
    const { baseUrl, token, clientId } = this.config;
    
    if (!baseUrl || !token || !clientId) {
      console.error('❌ SMS Gateway configuration missing:', {
        baseUrl: !baseUrl,
        token: !token,
        clientId: !clientId
      });
      return false;
    }
    
    return true;
  }

  /**
   * Send SMS message
   * @param to - Phone number with country code (+91xxxxxxxxxx)
   * @param message - Message content
   * @returns Promise<boolean> - Success status
   */
  async sendSMS(to: string, message: string): Promise<boolean> {
    try {
      if (!this.validateConfig()) {
        return false;
      }

      const requestBody: SMSRequestBody = {
        to,
        message
      };

      console.log('📤 Sending SMS request to gateway...');
      console.log('📤 Request URL:', `${this.config.baseUrl}/sms/send`);
      console.log('📤 Request body:', requestBody);

      const response = await fetch(`${this.config.baseUrl}/sms/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.token}`,
          'Content-Type': 'application/json',
          'X-Client-ID': this.config.clientId
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ SMS Gateway API error:', response.status, errorText);
        return false;
      }

      const data: SMSResponse = await response.json();
      console.log('📥 Response data:', data);

      if (data.status === 'success' && data.messageId) {
        console.log('✅ SMS sent successfully. Message ID:', data.messageId);
        return true;
      } else {
        console.error('❌ SMS Gateway returned error:', data.error || 'Unknown error');
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending SMS:', error);
      return false;
    }
  }

  /**
   * Send OTP SMS with Mealzee branding
   * @param phone - Phone number (10 digits or with +91)
   * @param otp - 6-digit OTP
   * @returns Promise<boolean> - Success status
   */
  async sendOTP(phone: string, otp: string): Promise<boolean> {
    // Clean and format phone number
    const cleanPhone = phone.replace(/^\+91/, '').replace(/\D/g, '');
    
    if (cleanPhone.length !== 10) {
      console.error('❌ Invalid phone number format. Length:', cleanPhone.length);
      return false;
    }

    const formattedPhone = `+91${cleanPhone}`;
    const message = `Mealzee OTP: ${otp}. Valid for 5 minutes. Do not share.`;

    return this.sendSMS(formattedPhone, message);
  }

  /**
   * Send custom message
   * @param phone - Phone number (10 digits or with +91)
   * @param message - Custom message content
   * @returns Promise<boolean> - Success status
   */
  async sendMessage(phone: string, message: string): Promise<boolean> {
    // Clean and format phone number
    const cleanPhone = phone.replace(/^\+91/, '').replace(/\D/g, '');
    
    if (cleanPhone.length !== 10) {
      console.error('❌ Invalid phone number format. Length:', cleanPhone.length);
      return false;
    }

    const formattedPhone = `+91${cleanPhone}`;
    return this.sendSMS(formattedPhone, message);
  }

  /**
   * Test SMS service configuration
   * @returns Promise<boolean> - Configuration test result
   */
  async testConfiguration(): Promise<boolean> {
    try {
      if (!this.validateConfig()) {
        return false;
      }

      // Test with a simple ping to the base URL
      const response = await fetch(this.config.baseUrl, {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${this.config.token}`,
          'X-Client-ID': this.config.clientId
        }
      });

      console.log('🔧 SMS Gateway test response:', response.status);
      return response.status < 500; // Accept any non-server error
    } catch (error) {
      console.error('❌ SMS Gateway configuration test failed:', error);
      return false;
    }
  }

  /**
   * Get service status
   * @returns Object with configuration status
   */
  getStatus(): { configured: boolean; config: Partial<SMSConfig> } {
    const isConfigured = this.validateConfig();
    
    return {
      configured: isConfigured,
      config: {
        baseUrl: this.config.baseUrl ? '✓ Configured' : '✗ Missing',
        token: this.config.token ? '✓ Configured' : '✗ Missing',
        clientId: this.config.clientId ? '✓ Configured' : '✗ Missing'
      }
    };
  }
}

// Export singleton instance
export const smsService = new SMSService();

// Export individual functions for backward compatibility
export async function sendOTPSMS(phone: string, otp: string): Promise<boolean> {
  return smsService.sendOTP(phone, otp);
}

export async function sendCustomSMS(phone: string, message: string): Promise<boolean> {
  return smsService.sendMessage(phone, message);
}

export async function testSMSService(): Promise<boolean> {
  return smsService.testConfiguration();
}

export function getSMSServiceStatus() {
  return smsService.getStatus();
}

/**
 * Utility function to format phone number for SMS
 * @param phone - Phone number in any format
 * @returns Formatted phone number (+91xxxxxxxxxx) or null if invalid
 */
export function formatPhoneForSMS(phone: string): string | null {
  const cleanPhone = phone.replace(/^\+91/, '').replace(/\D/g, '');
  
  if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
    return null;
  }
  
  return `+91${cleanPhone}`;
}

/**
 * Validate SMS message content
 * @param message - Message to validate
 * @returns Validation result
 */
export function validateSMSMessage(message: string): { valid: boolean; error?: string } {
  if (!message || message.trim().length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }
  
  if (message.length > 160) {
    return { valid: false, error: 'Message too long (max 160 characters)' };
  }
  
  return { valid: true };
}
