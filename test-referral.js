// Quick test to verify referral message changes
const { createReferralMessage } = require('./src/utils/referral.ts');

// Test the updated referral message
const testCode = 'MEAL911290';
const testName = 'raj';

console.log('Updated Referral Message:');
console.log('========================');
console.log(createReferralMessage(testCode, testName));
console.log('========================');
