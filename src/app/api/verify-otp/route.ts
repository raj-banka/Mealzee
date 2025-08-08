import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP, validateOTP, validatePhoneNumber, checkBruteForceProtection } from '@/lib/sms';

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json();

    console.log('🔍 OTP Verification API called:');
    console.log('📱 Phone:', phone);
    console.log('🔢 OTP:', otp);

    // Validate input
    if (!phone || !otp) {
      console.log('❌ Missing phone or OTP');
      return NextResponse.json(
        { success: false, error: 'Phone number and OTP are required' },
        { status: 400 }
      );
    }

    // Validate phone number format
    if (!validatePhoneNumber(phone)) {
      console.log('❌ Invalid phone number format:', phone);
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Validate OTP format
    if (!validateOTP(otp)) {
      console.log('❌ Invalid OTP format:', otp);
      return NextResponse.json(
        { success: false, error: 'Invalid OTP format' },
        { status: 400 }
      );
    }

    // Check brute-force protection
    const bruteForceCheck = checkBruteForceProtection(phone);
    if (!bruteForceCheck.allowed) {
      console.log('🚫 Brute-force protection triggered for phone:', phone);
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed attempts. Please try again in ${bruteForceCheck.remainingTime} minutes.`
        },
        { status: 429 }
      );
    }

    console.log('✅ Input validation passed, verifying OTP...');

    // Verify OTP (now async)
    const isValid = await verifyOTP(phone, otp);

    console.log('🔍 OTP verification result:', isValid);

    if (!isValid) {
      console.log('❌ OTP verification failed');
      return NextResponse.json(
        { success: false, error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    console.log('✅ OTP verification successful');
    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    console.error('Error in verify-otp API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
