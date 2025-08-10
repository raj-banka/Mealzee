import { NextRequest, NextResponse } from 'next/server';
import { verifyWhatsAppOTP } from '@/lib/sms-whatsapp';

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json();

    console.log('🔢 WhatsApp OTP Verification request for phone:', phone);

    // Validate input
    if (!phone || !otp) {
      console.log('❌ Missing phone number or OTP');
      return NextResponse.json(
        { success: false, error: 'Phone number and OTP are required' },
        { status: 400 }
      );
    }

    // Verify WhatsApp OTP using Message Central
    const result = await verifyWhatsAppOTP(phone, otp);

    if (result.success) {
      console.log('✅ WhatsApp OTP verified successfully for:', phone);
      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully'
      });
    } else {
      console.log('❌ WhatsApp OTP verification failed:', result.error);
      return NextResponse.json(
        { success: false, error: result.error || 'Invalid OTP' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('❌ Error in whatsapp-otp/verify API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}