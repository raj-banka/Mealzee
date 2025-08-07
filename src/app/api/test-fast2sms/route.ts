import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.FAST2SMS_API_KEY;
    
    console.log('🔑 Testing Fast2SMS API Key...');
    console.log('🔑 API Key configured:', apiKey ? 'Yes' : 'No');
    console.log('🔑 API Key length:', apiKey?.length || 0);
    console.log('🔑 API Key (first 10 chars):', apiKey?.substring(0, 10) + '...');

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Fast2SMS API key not configured',
        details: 'Check .env.local file'
      });
    }

    // Test API key with a simple balance check
    const response = await fetch('https://www.fast2sms.com/dev/wallet', {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache'
      }
    });

    console.log('📥 Balance check response status:', response.status);
    const data = await response.json();
    console.log('📥 Balance check response:', JSON.stringify(data, null, 2));

    if (response.ok && data.return) {
      return NextResponse.json({
        success: true,
        message: 'Fast2SMS API key is valid',
        balance: data.wallet || 'Unknown',
        details: data
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Fast2SMS API key validation failed',
        status: response.status,
        details: data
      });
    }

  } catch (error) {
    console.error('❌ Error testing Fast2SMS API:', error);
    return NextResponse.json({
      success: false,
      error: 'Error testing Fast2SMS API: ' + (error as Error).message
    });
  }
}