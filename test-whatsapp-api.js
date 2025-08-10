// Simple test script to verify WhatsApp OTP API endpoints
// Using built-in fetch (Node.js 18+)

const BASE_URL = 'http://localhost:3000';
const TEST_PHONE = '9142801457'; // Your phone number

async function testWhatsAppOTP() {
  console.log('🧪 Testing WhatsApp OTP API endpoints...\n');
  
  try {
    // Test 1: Send OTP
    console.log('📤 Step 1: Sending WhatsApp OTP...');
    const sendResponse = await fetch(`${BASE_URL}/api/whatsapp-otp/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone: TEST_PHONE })
    });
    
    const sendResult = await sendResponse.json();
    console.log('Send OTP Response:', sendResult);
    
    if (sendResult.success) {
      console.log('✅ WhatsApp OTP sent successfully!');
      console.log('📱 Please check your WhatsApp for the OTP message');
      console.log('\n⏳ Waiting for you to receive the OTP...');
      console.log('💡 Once you receive the OTP, you can test verification manually');
    } else {
      console.log('❌ Failed to send WhatsApp OTP:', sendResult.error);
      
      if (sendResult.error === 'REQUEST_ALREADY_EXISTS') {
        console.log('💡 This means there\'s already a pending OTP request for this number.');
        console.log('📱 Please check your WhatsApp for any existing OTP message.');
        console.log('⏰ Or wait a few minutes and try again.');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testWhatsAppOTP();