import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check Message Central configuration
    const config = {
      MESSAGECENTRAL_BASE_URL: process.env.MESSAGECENTRAL_BASE_URL,
      MESSAGECENTRAL_VALIDATE_URL: process.env.MESSAGECENTRAL_VALIDATE_URL,
      MESSAGECENTRAL_TOKEN: process.env.MESSAGECENTRAL_TOKEN ? '✅ Configured' : '❌ Missing',
      MESSAGECENTRAL_CLIENT_ID: process.env.MESSAGECENTRAL_CLIENT_ID,
    };

    console.log('🔧 Message Central Configuration Check:', config);

    return NextResponse.json({
      success: true,
      message: 'Message Central Configuration Check',
      config: config,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error checking Message Central config:', error);
    return NextResponse.json(
      { success: false, error: 'Configuration check failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number required' },
        { status: 400 }
      );
    }

    // Test Message Central API connection (without actually sending OTP)
    const MESSAGECENTRAL_BASE_URL = process.env.MESSAGECENTRAL_BASE_URL;
    const MESSAGECENTRAL_TOKEN = process.env.MESSAGECENTRAL_TOKEN;

    if (!MESSAGECENTRAL_BASE_URL || !MESSAGECENTRAL_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'Message Central configuration missing' },
        { status: 500 }
      );
    }

    console.log('🧪 Testing Message Central API connection...');
    console.log('📤 URL:', MESSAGECENTRAL_BASE_URL);

    // Test API connectivity (you might want to use a test endpoint if available)
    const testResponse = await fetch(MESSAGECENTRAL_BASE_URL.replace('/send', '/test') || MESSAGECENTRAL_BASE_URL, {
      method: 'HEAD',
      headers: {
        'Authorization': `Bearer ${MESSAGECENTRAL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📥 Test response status:', testResponse.status);

    return NextResponse.json({
      success: true,
      message: 'Message Central API test completed',
      apiStatus: testResponse.status,
      apiStatusText: testResponse.statusText,
      phone: phone,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Message Central API test error:', error);
    return NextResponse.json(
      { success: false, error: 'API test failed: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
