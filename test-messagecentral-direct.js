/**
 * Test Message Central API directly to understand the responses
 */

const BASE_URL = 'http://localhost:3000';
const TEST_PHONE = '9876543210';

async function testMessageCentralDirect() {
  console.log('🔍 Testing Message Central API directly...\n');
  
  try {
    // Step 1: Test the Message Central test endpoint
    console.log('📊 Step 1: Testing Message Central configuration...');
    const testResponse = await fetch(`${BASE_URL}/api/test-messagecentral`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: TEST_PHONE })
    });
    
    const testData = await testResponse.json();
    console.log('Test response status:', testResponse.status);
    console.log('Test response:', JSON.stringify(testData, null, 2));
    
    // Step 2: Check current OTP store
    console.log('\n📊 Step 2: Current OTP store...');
    const debugResponse = await fetch(`${BASE_URL}/api/debug-otp`);
    const debugData = await debugResponse.json();
    console.log('OTP Store:', JSON.stringify(debugData, null, 2));
    
    // Step 3: Try to send OTP and capture detailed response
    console.log('\n📤 Step 3: Sending OTP with detailed logging...');
    const sendResponse = await fetch(`${BASE_URL}/api/whatsapp-otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: TEST_PHONE })
    });
    
    const sendData = await sendResponse.json();
    console.log('Send response status:', sendResponse.status);
    console.log('Send response headers:', Object.fromEntries(sendResponse.headers.entries()));
    console.log('Send response:', JSON.stringify(sendData, null, 2));
    
    // Step 4: Check OTP store after sending
    console.log('\n📊 Step 4: OTP store after sending...');
    const debugResponse2 = await fetch(`${BASE_URL}/api/debug-otp`);
    const debugData2 = await debugResponse2.json();
    console.log('OTP Store after send:', JSON.stringify(debugData2, null, 2));
    
    if (debugData2.otpStore.length > 0) {
      const latestOtp = debugData2.otpStore[debugData2.otpStore.length - 1];
      console.log('\n📋 Latest OTP entry:');
      console.log(`  - Phone: ${latestOtp.phone}`);
      console.log(`  - Verification ID: ${latestOtp.verificationId}`);
      console.log(`  - Is Fallback: ${latestOtp.verificationId.startsWith('fallback_')}`);
      console.log(`  - Timestamp: ${latestOtp.timestamp}`);
      console.log(`  - Expires in: ${latestOtp.expiresIn} seconds`);
      
      // Step 5: Test verification with invalid OTP
      console.log('\n🔢 Step 5: Testing verification with invalid OTP...');
      const verifyResponse = await fetch(`${BASE_URL}/api/whatsapp-otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: TEST_PHONE, otp: '000000' })
      });
      
      const verifyData = await verifyResponse.json();
      console.log('Verify response status:', verifyResponse.status);
      console.log('Verify response:', JSON.stringify(verifyData, null, 2));
      
      // Step 6: Check OTP store after verification attempt
      console.log('\n📊 Step 6: OTP store after verification attempt...');
      const debugResponse3 = await fetch(`${BASE_URL}/api/debug-otp`);
      const debugData3 = await debugResponse3.json();
      console.log('OTP Store after verify:', JSON.stringify(debugData3, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  }
}

testMessageCentralDirect();
