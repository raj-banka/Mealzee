import { NextRequest, NextResponse } from 'next/server';
import { 
  generateOTP, 
  sendOTPSMS, 
  storeOTP, 
  validatePhoneNumber, 
  canResendOTP, 
  markOTPSent 
} from '@/lib/sms';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    console.log('📱 OTP Request received for phone:', phone);

    // Validate input
    if (!phone) {
      console.log('❌ No phone number provided');
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate phone number format
    if (!validatePhoneNumber(phone)) {
      console.log('❌ Invalid phone number format:', phone);
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format. Please use 10-digit Indian number.' },
        { status: 400 }
      );
    }

    // Check rate limiting
    if (!canResendOTP(phone)) {
      console.log('⏰ Rate limit hit for phone:', phone);
      return NextResponse.json(
        { success: false, error: 'Please wait 60 seconds before requesting another OTP' },
        { status: 429 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    console.log('🔢 Generated OTP for phone:', phone, '- OTP:', otp);

    // Send OTP SMS
    console.log('📤 Attempting to send SMS...');
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    try {
      const smsSent = await sendOTPSMS(phone, otp);

      // Store OTP for verification regardless of SMS success in development mode
      console.log('💾 Storing OTP for phone:', phone, 'OTP:', otp);
      storeOTP(phone, otp);
      markOTPSent(phone);

      if (!smsSent && !isDevelopment) {
        console.log('❌ SMS sending failed - sendOTPSMS returned false');
        return NextResponse.json(
          { success: false, error: 'Failed to send SMS. Please check your Fast2SMS account balance and API key.' },
          { status: 500 }
        );
      }

      console.log('✅ OTP processed successfully for:', phone);
      
      // Return response with development mode info
      return NextResponse.json({
        success: true,
        message: smsSent ? 'OTP sent successfully' : 'OTP generated (SMS failed but stored for development)',
        development_mode: isDevelopment,
        otp: isDevelopment ? otp : undefined,
        note: isDevelopment ? 'Development mode - OTP shown for testing' : undefined,
        sms_sent: smsSent
      });

    } catch (smsError) {
      console.error('❌ SMS sending error:', smsError);
      return NextResponse.json(
        { success: false, error: 'SMS service error: ' + (smsError as Error).message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Error in send-otp API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
