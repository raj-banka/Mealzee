/**
 * Test OTP verification with a mock OTP
 * This helps test the verification flow without needing the actual OTP
 */

const BASE_URL = 'http://localhost:3000';
const TEST_PHONE = '9876543210';

async function testVerification() {
  console.log('🧪 Testing OTP Verification Flow...\n');
  
  try {
    // Step 1: Check current state
    console.log('📊 Step 1: Checking current OTP store...');
    const debugResponse = await fetch(`${BASE_URL}/api/debug-otp`);
    const debugData = await debugResponse.json();
    console.log('Current OTP store:', JSON.stringify(debugData, null, 2));
    
    if (debugData.otpStore.length === 0) {
      console.log('❌ No OTP requests found. Please send an OTP first:');
      console.log('💡 Run: node debug-otp-flow.js');
      return;
    }
    
    const otpData = debugData.otpStore[0];
    console.log('\n📋 Found OTP data:');
    console.log(`  - Phone: ${otpData.phone}`);
    console.log(`  - Verification ID: ${otpData.verificationId}`);
    console.log(`  - Time elapsed: ${otpData.timeElapsed} seconds`);
    console.log(`  - Expires in: ${otpData.expiresIn} seconds`);
    console.log(`  - Is expired: ${otpData.isExpired}`);
    
    if (otpData.isExpired) {
      console.log('❌ OTP has expired. Please request a new one.');
      return;
    }
    
    // Step 2: Test with invalid OTP first
    console.log('\n🧪 Step 2: Testing with invalid OTP (123456)...');
    const invalidResponse = await fetch(`${BASE_URL}/api/whatsapp-otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: TEST_PHONE, otp: '123456' })
    });
    
    const invalidData = await invalidResponse.json();
    console.log('Invalid OTP response:', JSON.stringify(invalidData, null, 2));
    
    if (!invalidData.success) {
      console.log('✅ Good! Invalid OTP was correctly rejected.');
    } else {
      console.log('⚠️ Warning: Invalid OTP was accepted (this might be a problem).');
    }
    
    // Step 3: Show instructions for real OTP
    console.log('\n📱 Step 3: Ready for real OTP verification');
    console.log('💡 When you receive the OTP on WhatsApp, run:');
    console.log(`💡 node debug-otp-flow.js verify YOUR_OTP_HERE`);
    console.log('\n📋 Current verification details:');
    console.log(`  - Verification ID: ${otpData.verificationId}`);
    console.log(`  - Expires in: ${otpData.expiresIn} seconds`);
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  }
}

testVerification();
