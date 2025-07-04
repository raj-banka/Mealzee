import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.FAST2SMS_API_KEY;

    console.log('🔍 Testing Fast2SMS Configuration...');
    console.log('🔑 API Key present:', !!apiKey);
    console.log('🔑 API Key length:', apiKey?.length || 0);
    console.log('🔑 API Key preview:', apiKey ? `${apiKey.substring(0, 10)}...` : 'Not found');

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Fast2SMS API key not configured',
        details: 'Please add FAST2SMS_API_KEY to your .env.local file',
        instructions: [
          '1. Create .env.local file in project root',
          '2. Add: FAST2SMS_API_KEY=your_api_key_here',
          '3. Restart development server: npm run dev'
        ]
      });
    }

    // Test API connection by checking wallet balance
    const response = await fetch('https://www.fast2sms.com/dev/wallet', {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Wallet API Response Status:', response.status);

    const data = await response.json();
    console.log('📡 Wallet API Response:', data);

    if (response.ok && data.return) {
      return NextResponse.json({
        success: true,
        message: 'Fast2SMS API connection successful! 🎉',
        wallet_balance: `₹${data.wallet}`,
        api_status: 'Connected',
        next_steps: [
          '✅ API key is working',
          '✅ Account has credit balance',
          '🚀 Ready to send OTP SMS!'
        ]
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Fast2SMS API connection failed',
        details: data.message || 'Invalid API key or service unavailable',
        status_code: data.status_code,
        troubleshooting: [
          '1. Verify API key from Fast2SMS dashboard',
          '2. Check if account is active',
          '3. Ensure you have credit balance',
          '4. Try generating a new API key'
        ]
      });
    }

  } catch (error) {
    console.error('❌ Error testing Fast2SMS:', error);
    return NextResponse.json({
      success: false,
      error: 'Connection test failed',
      details: (error as Error).message,
      common_issues: [
        'Network connectivity problems',
        'Firewall blocking requests',
        'Invalid API endpoint',
        'Server configuration issues'
      ]
    });
  }
}
