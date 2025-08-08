# Message Central SMS Gateway Configuration

## 🚨 URGENT: Configuration Required

The OTP system has been successfully updated to use Message Central SMS Gateway instead of Fast2SMS. However, you need to provide the correct configuration details.

## 📋 Required Configuration

Please update your `.env.local` file with the correct Message Central API details:

```env
# Message Central SMS Gateway Configuration
SMS_API_BASE_URL=https://your-actual-message-central-api-url.com
SMS_API_TOKEN=your-actual-jwt-token-here
SMS_CLIENT_ID=your-actual-client-id-here
```

## 🔧 What You Need to Provide

### 1. SMS API Base URL
**Current placeholder**: `https://your-message-central-api-base-url.com`
**What I need**: Your actual Message Central API base URL

Example formats:
- `https://api.messagecentral.com`
- `https://sms.messagecentral.com/api/v1`
- `https://your-custom-domain.com/api`

### 2. JWT Token
**Current token**: `eyJhbGciOiJIUzUxMiJ9...` (from your original request)
**Question**: Is this token still valid or do you have a newer one?

### 3. Client ID
**Current ID**: `C-04D759A264204D4` (from your original request)
**Question**: Is this still correct?

## 🧪 Testing the Configuration

Once you provide the correct details:

1. **Update `.env.local`** with your actual values
2. **Test the API** by visiting `/test-otp`
3. **Check console logs** for detailed debugging information

## 🔍 How to Find Your Message Central Details

If you're not sure about your configuration:

1. **Login to Message Central Dashboard**
2. **Go to API Settings/Configuration**
3. **Look for**:
   - API Endpoint/Base URL
   - JWT Token/API Key
   - Client ID/Account ID

## 📱 API Request Format

The system will make requests like this:

```javascript
POST {SMS_API_BASE_URL}/sms/send
Headers:
  Authorization: Bearer {SMS_API_TOKEN}
  Content-Type: application/json
  X-Client-ID: {SMS_CLIENT_ID}

Body:
{
  "to": "+919876543210",
  "message": "Mealzee OTP: 123456. Valid for 5 minutes. Do not share."
}
```

## ✅ Expected Response Format

Your Message Central API should respond with:

```json
{
  "status": "success",
  "messageId": "some-unique-message-id"
}
```

## 🚨 Current Status

- ✅ **Code Updated**: Fast2SMS completely replaced with Message Central
- ✅ **Security Enhanced**: Brute-force protection and Redis support added
- ✅ **Testing Ready**: Test page available at `/test-otp`
- ❌ **Configuration Needed**: Actual Message Central API details required

## 🔧 Quick Fix Steps

1. **Provide your actual Message Central API details**
2. **I'll update the configuration immediately**
3. **Test the system to ensure it works**
4. **Deploy to production**

## 📞 What to Send Me

Please provide:

```
SMS_API_BASE_URL=your-actual-url-here
SMS_API_TOKEN=your-actual-token-here
SMS_CLIENT_ID=your-actual-client-id-here
```

Or let me know if you need help finding these details from your Message Central account.

## 🔍 Debugging

If you're getting errors, check:

1. **Console logs** - Detailed error messages
2. **Network tab** - API request/response details
3. **Message Central dashboard** - API usage and errors
4. **Environment variables** - Correct values loaded

The system is ready to go - we just need your actual API configuration! 🚀
