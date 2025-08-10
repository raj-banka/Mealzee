/**
 * Test OTP verification for specific phone number
 */

const BASE_URL = 'http://localhost:3000';
const PHONE = '9142801457'; // Your specific phone number
const OTP = '4903'; // Your OTP

async function testSpecificPhone() {
  console.log(`🔍 Testing OTP verification for phone: ${PHONE} with OTP: ${OTP}\n`);
  
  try {
    // Step 1: Check current OTP store
    console.log('📊 Step 1: Current OTP store...');
    const debugResponse = await fetch(`${BASE_URL}/api/debug-otp`);
    const debugData = await debugResponse.json();
    console.log('OTP Store:', JSON.stringify(debugData, null, 2));
    
    // Find the entry for our phone
    const phoneEntry = debugData.otpStore.find(entry => entry.phone === PHONE);
    if (!phoneEntry) {
      console.log(`❌ No OTP entry found for phone ${PHONE}`);
      console.log('💡 Available phones in store:', debugData.otpStore.map(e => e.phone));
      return;
    }
    
    console.log(`\n📋 Found entry for ${PHONE}:`);
    console.log(`  - Verification ID: ${phoneEntry.verificationId}`);
    console.log(`  - Is Fallback: ${phoneEntry.verificationId.startsWith('fallback_')}`);
    console.log(`  - Attempts: ${phoneEntry.attempts}`);
    console.log(`  - Time elapsed: ${phoneEntry.timeElapsed} seconds`);
    console.log(`  - Expires in: ${phoneEntry.expiresIn} seconds`);
    console.log(`  - Is expired: ${phoneEntry.isExpired}`);
    
    if (phoneEntry.isExpired) {
      console.log('❌ OTP has expired. Please request a new one.');
      return;
    }
    
    if (phoneEntry.attempts >= 3) {
      console.log('❌ Too many attempts. Please request a new OTP.');
      return;
    }
    
    // Step 2: Try verification
    console.log(`\n🔢 Step 2: Verifying OTP ${OTP} for phone ${PHONE}...`);
    const verifyResponse = await fetch(`${BASE_URL}/api/whatsapp-otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: PHONE, otp: OTP })
    });
    
    const verifyData = await verifyResponse.json();
    console.log('Verify response status:', verifyResponse.status);
    console.log('Verify response:', JSON.stringify(verifyData, null, 2));
    
    if (verifyData.success) {
      console.log('✅ OTP verified successfully!');
    } else {
      console.log('❌ OTP verification failed:', verifyData.error);
      
      // Provide specific guidance based on error
      if (verifyData.error === 'VERIFICATION_EXPIRED') {
        console.log('💡 This could mean:');
        console.log('   - The OTP has actually expired (>5 minutes)');
        console.log('   - The verification ID is invalid (fallback ID issue)');
        console.log('   - Message Central API rejected the verification');
      } else if (verifyData.error === 'WRONG_OTP_PROVIDED') {
        console.log('💡 The OTP code is incorrect. Please check the WhatsApp message.');
      }
    }
    
    // Step 3: Check store after verification
    console.log('\n📊 Step 3: OTP store after verification...');
    const debugResponse2 = await fetch(`${BASE_URL}/api/debug-otp`);
    const debugData2 = await debugResponse2.json();
    
    const phoneEntry2 = debugData2.otpStore.find(entry => entry.phone === PHONE);
    if (phoneEntry2) {
      console.log(`📋 Updated entry for ${PHONE}:`);
      console.log(`  - Attempts: ${phoneEntry.attempts} → ${phoneEntry2.attempts}`);
      console.log(`  - Still in store: Yes`);
    } else {
      console.log(`📋 Entry for ${PHONE} was removed from store (verification completed or failed)`);
    }
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  }
}

testSpecificPhone();
