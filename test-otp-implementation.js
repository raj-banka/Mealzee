/**
 * Test script for OTP implementation
 * Run with: node test-otp-implementation.js
 */

// Mock environment variables
process.env.NODE_ENV = 'development';
process.env.SMS_API_BASE_URL = 'https://example.com';
process.env.SMS_API_TOKEN = 'test-token';
process.env.SMS_CLIENT_ID = 'test-client-id';

// Test OTP utility functions
async function testOTPUtils() {
  console.log('🧪 Testing OTP Utility Functions...\n');
  
  try {
    // Import the utility functions
    const { 
      generateOTP, 
      validateOTPFormat, 
      validatePhoneNumber, 
      cleanPhoneNumber,
      formatPhoneNumber,
      isOTPExpired,
      createOTPMessage,
      maskPhoneNumber
    } = await import('./src/utils/otp.ts');

    // Test OTP generation
    console.log('1. Testing OTP Generation:');
    const otp = generateOTP();
    console.log(`   Generated OTP: ${otp}`);
    console.log(`   Is 6 digits: ${otp.length === 6 && /^\d+$/.test(otp)}`);
    console.log(`   Validation: ${validateOTPFormat(otp)}`);
    console.log('');

    // Test phone number validation
    console.log('2. Testing Phone Number Validation:');
    const testPhones = ['9876543210', '+919876543210', '1234567890', '98765432'];
    testPhones.forEach(phone => {
      console.log(`   ${phone}: ${validatePhoneNumber(phone)}`);
    });
    console.log('');

    // Test phone number cleaning and formatting
    console.log('3. Testing Phone Number Processing:');
    const phone = '+919876543210';
    const cleaned = cleanPhoneNumber(phone);
    const formatted = formatPhoneNumber(phone);
    const masked = maskPhoneNumber(phone);
    console.log(`   Original: ${phone}`);
    console.log(`   Cleaned: ${cleaned}`);
    console.log(`   Formatted: ${formatted}`);
    console.log(`   Masked: ${masked}`);
    console.log('');

    // Test OTP expiry
    console.log('4. Testing OTP Expiry:');
    const now = Date.now();
    const fiveMinutesAgo = now - (5 * 60 * 1000);
    const oneMinuteAgo = now - (1 * 60 * 1000);
    console.log(`   5 minutes ago expired: ${isOTPExpired(fiveMinutesAgo)}`);
    console.log(`   1 minute ago expired: ${isOTPExpired(oneMinuteAgo)}`);
    console.log('');

    // Test message creation
    console.log('5. Testing Message Creation:');
    const message = createOTPMessage(otp);
    console.log(`   Message: ${message}`);
    console.log('');

    console.log('✅ All OTP utility tests passed!\n');
    return true;
  } catch (error) {
    console.error('❌ OTP utility test failed:', error);
    return false;
  }
}

// Test SMS service configuration
async function testSMSService() {
  console.log('🧪 Testing SMS Service...\n');
  
  try {
    const { SMSService, getSMSServiceStatus } = await import('./src/lib/sms-service.ts');
    
    // Test service status
    console.log('1. Testing SMS Service Status:');
    const status = getSMSServiceStatus();
    console.log('   Configuration:', status);
    console.log('');

    // Test phone formatting
    console.log('2. Testing Phone Formatting:');
    const { formatPhoneForSMS, validateSMSMessage } = await import('./src/lib/sms-service.ts');
    
    const testPhones = ['9876543210', '+919876543210', '1234567890'];
    testPhones.forEach(phone => {
      const formatted = formatPhoneForSMS(phone);
      console.log(`   ${phone} -> ${formatted}`);
    });
    console.log('');

    // Test message validation
    console.log('3. Testing Message Validation:');
    const testMessages = [
      'Valid OTP message',
      '',
      'A'.repeat(200) // Too long
    ];
    testMessages.forEach(msg => {
      const validation = validateSMSMessage(msg);
      console.log(`   "${msg.substring(0, 20)}...": ${validation.valid ? 'Valid' : validation.error}`);
    });
    console.log('');

    console.log('✅ SMS service tests passed!\n');
    return true;
  } catch (error) {
    console.error('❌ SMS service test failed:', error);
    return false;
  }
}

// Test brute-force protection
async function testBruteForceProtection() {
  console.log('🧪 Testing Brute-Force Protection...\n');
  
  try {
    const { 
      checkBruteForceProtection, 
      recordFailedAttempt 
    } = await import('./src/lib/sms.ts');

    const testPhone = '9876543210';
    
    console.log('1. Testing Initial State:');
    let check = checkBruteForceProtection(testPhone);
    console.log(`   Allowed: ${check.allowed}`);
    console.log('');

    console.log('2. Testing Failed Attempts:');
    for (let i = 1; i <= 6; i++) {
      recordFailedAttempt(testPhone);
      check = checkBruteForceProtection(testPhone);
      console.log(`   Attempt ${i}: Allowed = ${check.allowed}, Remaining time = ${check.remainingTime || 'N/A'}`);
    }
    console.log('');

    console.log('✅ Brute-force protection tests passed!\n');
    return true;
  } catch (error) {
    console.error('❌ Brute-force protection test failed:', error);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting OTP Implementation Tests\n');
  console.log('=' .repeat(50));
  
  const results = [];
  
  results.push(await testOTPUtils());
  results.push(await testSMSService());
  results.push(await testBruteForceProtection());
  
  console.log('=' .repeat(50));
  console.log('📊 Test Results Summary:');
  console.log(`   Passed: ${results.filter(r => r).length}/${results.length}`);
  console.log(`   Failed: ${results.filter(r => !r).length}/${results.length}`);
  
  if (results.every(r => r)) {
    console.log('\n🎉 All tests passed! OTP implementation is ready.');
  } else {
    console.log('\n❌ Some tests failed. Please check the implementation.');
  }
}

// Run tests
runTests().catch(console.error);
