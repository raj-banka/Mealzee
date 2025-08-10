/**
 * Debug script for OTP flow testing
 * Run with: node debug-otp-flow.js
 */

const BASE_URL = 'http://localhost:3000';
const TEST_PHONE = '9876543210'; // Replace with your test phone number

async function debugOTPFlow() {
  console.log('🔍 Starting OTP Flow Debug...\n');
  
  try {
    // Step 1: Check current debug state
    console.log('📊 Step 1: Checking current OTP store...');
    const debugResponse = await fetch(`${BASE_URL}/api/debug-otp`);
    const debugData = await debugResponse.json();
    console.log('Debug data:', JSON.stringify(debugData, null, 2));
    console.log('');
    
    // Step 2: Clear any existing brute force protection
    console.log('🧹 Step 2: Clearing brute force protection...');
    const clearResponse = await fetch(`${BASE_URL}/api/debug-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'clear-brute-force', phone: TEST_PHONE })
    });
    const clearData = await clearResponse.json();
    console.log('Clear result:', clearData);
    console.log('');
    
    // Step 3: Send OTP
    console.log('📤 Step 3: Sending WhatsApp OTP...');
    const sendResponse = await fetch(`${BASE_URL}/api/whatsapp-otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: TEST_PHONE })
    });
    
    const sendData = await sendResponse.json();
    console.log('Send response status:', sendResponse.status);
    console.log('Send response:', JSON.stringify(sendData, null, 2));
    
    if (sendData.success) {
      console.log('✅ OTP sent successfully!');
      console.log('📱 Please check your WhatsApp for the OTP message');
      
      // Step 4: Check debug state after sending
      console.log('\n📊 Step 4: Checking OTP store after sending...');
      const debugResponse2 = await fetch(`${BASE_URL}/api/debug-otp`);
      const debugData2 = await debugResponse2.json();
      console.log('Debug data after send:', JSON.stringify(debugData2, null, 2));
      
      console.log('\n⏳ Waiting for you to receive the OTP...');
      console.log('💡 Once you receive the OTP, run this script again with the OTP:');
      console.log(`💡 node debug-otp-flow.js verify YOUR_OTP_HERE`);
      
    } else {
      console.log('❌ Failed to send OTP:', sendData.error);
      
      if (sendData.error === 'REQUEST_ALREADY_EXISTS') {
        console.log('💡 This means there\'s already a pending OTP request.');
        console.log('📱 Please check your WhatsApp for any existing OTP message.');
        console.log('💡 Or run: node debug-otp-flow.js verify YOUR_OTP_HERE');
      }
    }
    
  } catch (error) {
    console.error('❌ Error during debug:', error);
  }
}

async function verifyOTP(otp) {
  console.log('🔢 Starting OTP Verification Debug...\n');
  
  try {
    // Step 1: Check current debug state
    console.log('📊 Step 1: Checking current OTP store...');
    const debugResponse = await fetch(`${BASE_URL}/api/debug-otp`);
    const debugData = await debugResponse.json();
    console.log('Debug data before verify:', JSON.stringify(debugData, null, 2));
    console.log('');
    
    // Step 2: Verify OTP
    console.log('🔢 Step 2: Verifying OTP:', otp);
    const verifyResponse = await fetch(`${BASE_URL}/api/whatsapp-otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: TEST_PHONE, otp: otp })
    });
    
    const verifyData = await verifyResponse.json();
    console.log('Verify response status:', verifyResponse.status);
    console.log('Verify response:', JSON.stringify(verifyData, null, 2));
    
    if (verifyData.success) {
      console.log('✅ OTP verified successfully!');
    } else {
      console.log('❌ OTP verification failed:', verifyData.error);
      
      if (verifyData.error === 'VERIFICATION_EXPIRED') {
        console.log('💡 The OTP has expired. Please request a new one.');
        console.log('💡 Run: node debug-otp-flow.js');
      }
    }
    
    // Step 3: Check debug state after verification
    console.log('\n📊 Step 3: Checking OTP store after verification...');
    const debugResponse2 = await fetch(`${BASE_URL}/api/debug-otp`);
    const debugData2 = await debugResponse2.json();
    console.log('Debug data after verify:', JSON.stringify(debugData2, null, 2));
    
  } catch (error) {
    console.error('❌ Error during verification debug:', error);
  }
}

// Main execution
const args = process.argv.slice(2);
if (args.length > 0 && args[0] === 'verify' && args[1]) {
  verifyOTP(args[1]);
} else if (args.length > 0 && args[0] === 'verify') {
  console.log('❌ Please provide OTP: node debug-otp-flow.js verify YOUR_OTP_HERE');
} else {
  debugOTPFlow();
}
