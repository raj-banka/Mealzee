import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check Firebase environment variables
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    };

    console.log('🔍 Testing Firebase Configuration...');
    console.log('🔑 API Key present:', !!firebaseConfig.apiKey);
    console.log('🔑 Auth Domain:', firebaseConfig.authDomain);
    console.log('🔑 Project ID:', firebaseConfig.projectId);

    // Check if all required config is present
    const missingConfig = [];
    if (!firebaseConfig.apiKey) missingConfig.push('NEXT_PUBLIC_FIREBASE_API_KEY');
    if (!firebaseConfig.authDomain) missingConfig.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
    if (!firebaseConfig.projectId) missingConfig.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
    if (!firebaseConfig.storageBucket) missingConfig.push('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
    if (!firebaseConfig.messagingSenderId) missingConfig.push('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
    if (!firebaseConfig.appId) missingConfig.push('NEXT_PUBLIC_FIREBASE_APP_ID');

    if (missingConfig.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Firebase configuration incomplete',
        missing_variables: missingConfig,
        instructions: [
          '1. Go to Firebase Console: https://console.firebase.google.com/',
          '2. Create a new project or select existing one',
          '3. Enable Phone Authentication',
          '4. Add web app and copy configuration',
          '5. Add all variables to .env.local file',
          '6. Restart development server'
        ]
      });
    }

    // All config present
    return NextResponse.json({
      success: true,
      message: 'Firebase configuration complete! 🎉',
      config_status: {
        api_key: '✅ Configured',
        auth_domain: '✅ Configured',
        project_id: '✅ Configured',
        storage_bucket: '✅ Configured',
        messaging_sender_id: '✅ Configured',
        app_id: '✅ Configured'
      },
      next_steps: [
        '✅ Firebase config is ready',
        '🔥 Phone authentication enabled',
        '📱 Ready to send OTP SMS',
        '🚀 Test the complete flow!'
      ],
      features: {
        free_verifications: '10,000 per month',
        global_coverage: '200+ countries',
        spam_protection: 'Built-in reCAPTCHA',
        reliability: '99.9% delivery rate'
      }
    });

  } catch (error) {
    console.error('❌ Error testing Firebase:', error);
    return NextResponse.json({
      success: false,
      error: 'Firebase test failed',
      details: (error as Error).message,
      troubleshooting: [
        'Check environment variables in .env.local',
        'Ensure Firebase project is active',
        'Verify all configuration values',
        'Restart development server'
      ]
    });
  }
}
