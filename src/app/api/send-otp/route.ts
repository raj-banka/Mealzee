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
    const smsSent = await sendOTPSMS(phone, otp);

    if (!smsSent) {
      console.log('❌ SMS sending failed, using development fallback');

      // Development fallback: Log OTP to console for testing
      console.log('🔧 DEVELOPMENT MODE: OTP for', phone, 'is:', otp);
      console.log('🔧 Use this OTP to test the verification flow');

      // Store OTP for verification even if SMS failed
      storeOTP(phone, otp);
      markOTPSent(phone);

      return NextResponse.json({
        success: true,
        message: 'OTP generated (check console for development OTP)',
        development_mode: true,
        note: 'SMS service configuration needed - using console OTP for testing'
      });
    }

    // Store OTP for verification
    storeOTP(phone, otp);
    markOTPSent(phone);

    console.log('✅ OTP sent successfully to:', phone);
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // Don't send OTP in response for security
    });

  } catch (error) {
    console.error('❌ Error in send-otp API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
