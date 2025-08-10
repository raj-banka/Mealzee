// WhatsApp OTP Debug Test Script
// This script helps debug the WhatsApp OTP verification flow

const BASE_URL = 'http://localhost:3002';
const TEST_PHONE = '9142801457';

async function debugWhatsAppOTP() {
  console.log('🧪 WhatsApp OTP Debug Test\n');
  
  try {
    // Step 1: Check current OTP store
    console.log('📊 Step 1: Checking current OTP store...');
    const debugResponse = await fetch(`${BASE_URL}/api/debug-otp`);
    const debugData = await debugResponse.json();
    console.log('Debug data:', JSON.stringify(debugData, null, 2));
    
    // Step 2: Try to send OTP
    console.log('\n📤 Step 2: Attempting to send WhatsApp OTP...');
    const sendResponse = await fetch(`${BASE_URL}/api/whatsapp-otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: TEST_PHONE })
    });
    
    console.log('Send response status:', sendResponse.status);
    const sendData = await sendResponse.json();
    console.log('Send response:', JSON.stringify(sendData, null, 2));
    
    // Step 3: Check OTP store after send attempt
    console.log('\n📊 Step 3: Checking OTP store after send attempt...');
    const debugResponse2 = await fetch(`${BASE_URL}/api/debug-otp`);
    const debugData2 = await debugResponse2.json();
    console.log('Debug data after send:', JSON.stringify(debugData2, null, 2));
    
    // Step 4: Test verification with dummy OTP
    console.log('\n🔐 Step 4: Testing verification with dummy OTP (1234)...');
    const verifyResponse = await fetch(`${BASE_URL}/api/whatsapp-otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: TEST_PHONE, otp: '1234' })
    });
    
    console.log('Verify response status:', verifyResponse.status);
    const verifyData = await verifyResponse.json();
    console.log('Verify response:', JSON.stringify(verifyData, null, 2));
    
    // Step 5: Final OTP store check
    console.log('\n📊 Step 5: Final OTP store check...');
    const debugResponse3 = await fetch(`${BASE_URL}/api/debug-otp`);
    const debugData3 = await debugResponse3.json();
    console.log('Final debug data:', JSON.stringify(debugData3, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the debug test
debugWhatsAppOTP();
