/**
 * Message Central API integration for WhatsApp OTP verification
 */

// Constants for Message Central API from environment variables
const CUSTOMER_ID = process.env.MESSAGECENTRAL_CLIENT_ID;
const AUTH_TOKEN = process.env.MESSAGECENTRAL_TOKEN;
const BASE_URL = process.env.MESSAGECENTRAL_BASE_URL || 'https://cpaas.messagecentral.com/verification/v3/send';
const VALIDATE_URL = process.env.MESSAGECENTRAL_VALIDATE_URL || 'https://cpaas.messagecentral.com/verification/v3/validateOtp';

/**
 * Send OTP via WhatsApp using Message Central API
 * @param phoneNumber - Phone number without country code
 * @param countryCode - Country code (default: 91 for India)
 * @returns Promise with verification ID and status
 */
export async function sendWhatsAppOTP(phoneNumber: string, countryCode: string = '91'): Promise<{ success: boolean; verificationId?: string; error?: string }> {
  try {
    if (!CUSTOMER_ID || !AUTH_TOKEN) {
      console.error('Message Central credentials missing: set MESSAGECENTRAL_CLIENT_ID and MESSAGECENTRAL_TOKEN');
      return { success: false, error: 'Message Central credentials not configured' };
    }
    // Remove any non-numeric characters from phone number
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
    
    // Construct the URL with query parameters
    const url = `${BASE_URL}?countryCode=${countryCode}&customerId=${CUSTOMER_ID}&flowType=SMS&mobileNumber=${cleanPhoneNumber}`;
    
    console.log('📤 Sending WhatsApp OTP request to:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: ( { 'authToken': AUTH_TOKEN as string, 'Content-Type': 'application/json' } as Record<string,string> )
    });
    
    const data = await response.json();
    
    console.log('📥 Message Central API Response:', {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data: data
    });

    console.log('📋 Raw response data structure:', JSON.stringify(data, null, 2));
    
    // Check for successful response
    if (response.ok) {
      console.log('📋 Message Central API Response Data:', JSON.stringify(data, null, 2));

      if (data.status === 'SUCCESS') {
        // Success response - check for verification ID
        const verificationId = data.verificationId || data.verification_id || data.id || data.requestId;

        if (verificationId) {
          console.log('✅ WhatsApp OTP sent successfully, verification ID:', verificationId);
          return {
            success: true,
            verificationId: verificationId
          };
        } else {
          // Success but no verification ID - generate one
          const generatedId = `generated_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
          console.log('✅ WhatsApp OTP sent successfully (no verification ID in response, generated:', generatedId + ')');

          return {
            success: true,
            verificationId: generatedId
          };
        }
      } else {
        // API returned a non-SUCCESS status
        console.error('❌ Message Central API non-success status:', data.status);
        console.error('❌ Full response data:', JSON.stringify(data, null, 2));
        return {
          success: false,
          error: data.message || data.error || `API returned status: ${data.status}`
        };
      }
    } else {
      // HTTP error
      console.error('❌ HTTP error sending WhatsApp OTP:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      
      // Special handling for REQUEST_ALREADY_EXISTS - this means OTP is still being sent
      if (response.status === 400 && (data.message || '').includes('REQUEST_ALREADY_EXISTS')) {
        console.log('ℹ️ REQUEST_ALREADY_EXISTS - OTP request is already pending, but OTP should still be delivered');
        console.log('📋 REQUEST_ALREADY_EXISTS response data:', JSON.stringify(data, null, 2));

        // Check if verification ID is provided in the error response (nested in data object)
        const verificationId = data.verificationId ||
                              data.verification_id ||
                              data.id ||
                              data.requestId ||
                              (data.data && data.data.verificationId) ||
                              (data.data && data.data.verification_id) ||
                              (data.data && data.data.id);

        if (verificationId) {
          console.log('✅ Found verification ID in REQUEST_ALREADY_EXISTS response:', verificationId);
          return {
            success: true, // Mark as success since we have the verification ID
            verificationId: verificationId
          };
        } else {
          return {
            success: false, // Keep as false so the calling code can handle this specific case
            error: 'REQUEST_ALREADY_EXISTS'
          };
        }
      }
      
      // Special case: API returns error="SUCCESS" which is actually a success
      if (data.error === 'SUCCESS' || data.message === 'SUCCESS') {
        console.log('⚠️ API returned error="SUCCESS" - treating as success');
        const verificationId = data.verificationId ||
                              data.verification_id ||
                              data.id ||
                              data.requestId ||
                              `success_fallback_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

        return {
          success: true,
          verificationId: verificationId
        };
      }

      return {
        success: false,
        error: data.message || data.error || `HTTP ${response.status}: Failed to send OTP via WhatsApp`
      };
    }
  } catch (error) {
    console.error('Exception sending WhatsApp OTP:', error);
    return {
      success: false,
      error: 'Service unavailable. Please try again later.'
    };
  }
}

/**
 * Verify OTP received via WhatsApp
 * @param phoneNumber - Phone number without country code
 * @param verificationId - Verification ID received from sendWhatsAppOTP
 * @param otpCode - OTP code entered by user
 * @param countryCode - Country code (default: 91 for India)
 * @returns Promise with verification result
 */
export async function verifyWhatsAppOTP(
  phoneNumber: string, 
  verificationId: string, 
  otpCode: string, 
  countryCode: string = '91'
): Promise<{ success: boolean; error?: string }> {
  try {
    // Remove any non-numeric characters
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
    const cleanOtpCode = otpCode.replace(/\D/g, '');
    
    // Construct the URL with query parameters
    const url = `${VALIDATE_URL}?countryCode=${countryCode}&mobileNumber=${cleanPhoneNumber}&verificationId=${verificationId}&customerId=${CUSTOMER_ID}&code=${cleanOtpCode}`;

    console.log('🔍 Message Central verification request:');
    console.log(`  - URL: ${url}`);
    console.log(`  - Phone: ${cleanPhoneNumber}`);
    console.log(`  - Verification ID: ${verificationId}`);
    console.log(`  - OTP Code: ${cleanOtpCode}`);

    if (!CUSTOMER_ID || !AUTH_TOKEN) {
      console.error('Message Central credentials missing: set MESSAGECENTRAL_CLIENT_ID and MESSAGECENTRAL_TOKEN');
      return { success: false, error: 'Message Central credentials not configured' };
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: ( { 'authToken': AUTH_TOKEN as string } as Record<string,string> )
    });

    const data = await response.json();

    console.log('📋 Message Central verification response:');
    console.log(`  - Status: ${response.status}`);
    console.log(`  - OK: ${response.ok}`);
    console.log(`  - Data: ${JSON.stringify(data, null, 2)}`);

    if (response.ok && data.status === 'SUCCESS') {
      console.log('✅ Message Central verification successful');
      return {
        success: true
      };
    } else {
      console.error('❌ Message Central verification failed:', data);
      return {
        success: false,
        error: data.message || data.error || 'Invalid OTP. Please try again.'
      };
    }
  } catch (error) {
    console.error('Exception verifying WhatsApp OTP:', error);
    return {
      success: false,
      error: 'Service unavailable. Please try again later.'
    };
  }
}