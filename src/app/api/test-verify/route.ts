import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP, validateOTP, validatePhoneNumber, getOTPStoreDebug } from '@/lib/sms';

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json();

    console.log('🔍 Test Verify API called:');
    console.log('📱 Phone:', phone);
    console.log('🔢 OTP:', otp);

    // Get current store state
    const storeState = getOTPStoreDebug();
    console.log('🗂️ Current OTP store:', storeState);

    // Validate input
    const phoneValid = validatePhoneNumber(phone);
    const otpValid = validateOTP(otp);
    
    console.log('✅ Phone valid:', phoneValid);
    console.log('✅ OTP valid:', otpValid);

    // Try to verify
    const isValid = verifyOTP(phone, otp);
    console.log('🔍 Verification result:', isValid);

    return NextResponse.json({
      success: true,
      debug: {
        phone,
        otp,
        phoneValid,
        otpValid,
        isValid,
        storeState,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in test-verify API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}