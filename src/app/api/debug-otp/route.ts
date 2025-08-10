import { NextRequest, NextResponse } from 'next/server';
import { getOTPStoreDebug, clearBruteForceProtection } from '@/lib/sms-whatsapp';

export async function GET(request: NextRequest) {
  try {
    const otpStore = getOTPStoreDebug();

    return NextResponse.json({
      success: true,
      otpStore: otpStore,
      count: otpStore.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in debug-otp API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, phone } = await request.json();

    if (action === 'clear-brute-force' && phone) {
      clearBruteForceProtection(phone);
      return NextResponse.json({
        success: true,
        message: `Brute force protection cleared for ${phone}`,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action or missing phone number' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in debug-otp POST API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}