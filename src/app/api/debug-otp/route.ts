import { NextRequest, NextResponse } from 'next/server';
import { getOTPStoreDebug } from '@/lib/sms';

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