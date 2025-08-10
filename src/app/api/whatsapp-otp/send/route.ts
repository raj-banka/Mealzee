import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppVerification } from '@/lib/sms-whatsapp';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    console.log('📱 WhatsApp OTP Request received for phone:', phone);

    // Validate input
    if (!phone) {
      console.log('❌ No phone number provided');
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Send WhatsApp OTP using Message Central
    const result = await sendWhatsAppVerification(phone);

    if (result.success) {
      console.log('✅ WhatsApp OTP sent successfully for:', phone);
      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully via WhatsApp'
      });
    } else {
      console.log('❌ WhatsApp OTP sending failed:', result.error);
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to send WhatsApp OTP' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Error in whatsapp-otp/send API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}