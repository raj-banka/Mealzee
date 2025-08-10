# WhatsApp OTP Verification System

This guide explains how to use the WhatsApp OTP verification system implemented with Message Central.

## Overview

The WhatsApp OTP verification system allows users to verify their phone numbers using WhatsApp instead of SMS. This provides a more reliable and cost-effective way to send OTPs, especially in regions where SMS delivery might be unreliable.

## Implementation Details

### 1. Message Central Integration

The system uses Message Central's API to send and verify OTPs via WhatsApp. The integration is implemented in:

- `src/lib/message-central.ts` - Core API integration with Message Central
- `src/lib/sms-whatsapp.ts` - WhatsApp OTP service with rate limiting and brute-force protection

### 2. API Endpoints

Two API endpoints are available for sending and verifying OTPs:

- `POST /api/whatsapp-otp/send` - Sends an OTP via WhatsApp
- `POST /api/whatsapp-otp/verify` - Verifies the OTP received via WhatsApp

### 3. React Component

A ready-to-use React component is available for easy integration:

- `src/components/auth/WhatsAppOTPForm.tsx` - Form component for WhatsApp OTP verification

## How to Use

### 1. Environment Configuration

Make sure the following environment variables are set in your `.env` file:

```
MESSAGECENTRAL_BASE_URL=https://cpaas.messagecentral.com/verification/v3/send
MESSAGECENTRAL_VALIDATE_URL=https://cpaas.messagecentral.com/verification/v3/validateOtp
MESSAGECENTRAL_CUSTOMER_ID=C-04D759A264204D4
MESSAGECENTRAL_AUTH_TOKEN=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLTA0RDc1OUEyNjQyMDRENCIsImlhdCI6MTc1NDY3NTA5OCwiZXhwIjoxOTEyMzU1MDk4fQ.yzjMLm3A2UKZkPhLaUAlsURgSGnzM7XPAh0c6zg5NWRN3Ze6-EHF-TTbEP4ekFVK6dUyZH_okJMHX52mVXuwow
```

### 2. Using the React Component

Import and use the WhatsAppOTPForm component in your React pages:

```tsx
import WhatsAppOTPForm from '@/components/auth/WhatsAppOTPForm';

export default function YourPage() {
  const handleVerificationSuccess = (phone: string) => {
    console.log('Phone verified:', phone);
    // Handle successful verification
  };
  
  return (
    <div>
      <h1>Verify Your Phone</h1>
      <WhatsAppOTPForm 
        onSuccess={handleVerificationSuccess}
        buttonText="Verify Phone Number"
        successMessage="Phone number verified successfully!"
      />
    </div>
  );
}
```

### 3. Direct API Usage

If you prefer to use the API directly:

```typescript
// Send OTP
const sendOTP = async (phone: string) => {
  const response = await fetch('/api/whatsapp-otp/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ phone })
  });
  
  return await response.json();
};

// Verify OTP
const verifyOTP = async (phone: string, otp: string) => {
  const response = await fetch('/api/whatsapp-otp/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ phone, otp })
  });
  
  return await response.json();
};
```

## Security Features

The WhatsApp OTP verification system includes several security features:

1. **Rate Limiting**: Users can only request a new OTP every 30 seconds
2. **Brute-Force Protection**: After 5 failed attempts, the user is blocked for 1 hour
3. **OTP Expiry**: OTPs expire after 5 minutes
4. **Attempt Limiting**: Only 3 verification attempts are allowed per OTP

## Testing

You can test the WhatsApp OTP verification system using the test page:

- Visit `/test-whatsapp-otp` to test the WhatsApp OTP verification

## Troubleshooting

If you encounter issues with the WhatsApp OTP verification:

1. Check that the environment variables are correctly set
2. Ensure the phone number is in the correct format (10 digits for Indian numbers)
3. Check the server logs for any error messages
4. Verify that the Message Central account is active and has sufficient credits

## Message Central Dashboard

You can monitor your WhatsApp OTP usage and performance in the Message Central dashboard:

- Dashboard URL: https://cpaas.messagecentral.com/dashboard
- Login with your Message Central credentials

## Support

For any issues or questions regarding the WhatsApp OTP verification system, please contact:

- Email: support@mealzee.com
- Phone: +91 9204666105