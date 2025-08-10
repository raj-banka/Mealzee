// Simple test script to verify WhatsApp OTP
// Run this after receiving the OTP on WhatsApp

const BASE_URL = 'http://localhost:3000';
const TEST_PHONE = '9142801457'; // Your phone number

// Get OTP from command line argument
const otp = process.argv[2];

if (!otp) {
  console.log('❌ Please provide the OTP as an argument');
  console.log('Usage: node test-whatsapp-verify.js <OTP>');
  console.log('Example: node test-whatsapp-verify.js 1234');
  process.exit(1);
}

async function testWhatsAppVerification() {
  console.log('🧪 Testing WhatsApp OTP verification...\n');
  
  try {
    console.log(`🔐 Verifying OTP: ${otp} for phone: ${TEST_PHONE}`);
    
    const verifyResponse = await fetch(`${BASE_URL}/api/whatsapp-otp/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        phone: TEST_PHONE,
        otp: otp
      })
    });
    
    const verifyResult = await verifyResponse.json();
    console.log('Verify OTP Response:', verifyResult);
    
    if (verifyResult.success) {
      console.log('✅ WhatsApp OTP verified successfully!');
      console.log('🎉 Authentication completed!');
    } else {
      console.log('❌ Failed to verify WhatsApp OTP:', verifyResult.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testWhatsAppVerification();