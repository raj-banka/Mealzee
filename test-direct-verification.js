/**
 * Test direct verification API call to see detailed logs
 */

const BASE_URL = 'http://localhost:3000';
const TEST_PHONE = '9876543210';
const TEST_OTP = '123456'; // Invalid OTP for testing

async function testDirectVerification() {
  console.log('🔍 Testing Direct Verification API...\n');
  
  try {
    // Step 1: Check current state
    console.log('📊 Step 1: Current OTP store state...');
    const debugResponse = await fetch(`${BASE_URL}/api/debug-otp`);
    const debugData = await debugResponse.json();
    console.log('OTP Store:', JSON.stringify(debugData, null, 2));
    
    if (debugData.otpStore.length === 0) {
      console.log('❌ No OTP data found. Please send an OTP first.');
      return;
    }
    
    const otpData = debugData.otpStore[0];
    console.log(`\n📋 Using verification data:`);
    console.log(`  - Phone: ${otpData.phone}`);
    console.log(`  - Verification ID: ${otpData.verificationId}`);
    console.log(`  - Attempts: ${otpData.attempts}`);
    console.log(`  - Expired: ${otpData.isExpired}`);
    
    // Step 2: Make verification request
    console.log(`\n🔢 Step 2: Testing verification with OTP: ${TEST_OTP}`);
    
    const verifyResponse = await fetch(`${BASE_URL}/api/whatsapp-otp/verify`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        phone: TEST_PHONE, 
        otp: TEST_OTP 
      })
    });
    
    console.log(`📋 Response status: ${verifyResponse.status}`);
    console.log(`📋 Response OK: ${verifyResponse.ok}`);
    
    const verifyData = await verifyResponse.json();
    console.log('📋 Response data:', JSON.stringify(verifyData, null, 2));
    
    // Step 3: Check state after verification
    console.log('\n📊 Step 3: OTP store state after verification...');
    const debugResponse2 = await fetch(`${BASE_URL}/api/debug-otp`);
    const debugData2 = await debugResponse2.json();
    console.log('OTP Store after:', JSON.stringify(debugData2, null, 2));
    
    // Compare attempts
    if (debugData2.otpStore.length > 0) {
      const newAttempts = debugData2.otpStore[0].attempts;
      const oldAttempts = otpData.attempts;
      console.log(`\n📈 Attempts changed: ${oldAttempts} → ${newAttempts}`);
    }
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  }
}

testDirectVerification();
