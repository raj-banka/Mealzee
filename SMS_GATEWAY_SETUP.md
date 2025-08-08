# SMS Gateway OTP Authentication Setup

This document provides complete setup instructions for the new SMS Gateway OTP authentication system that replaces Fast2SMS.

## 🚀 Features

- **New SMS Gateway Integration**: Custom SMS API with JWT authentication
- **Brute-Force Protection**: Max 5 attempts per phone number per hour
- **Rate Limiting**: 30 seconds between OTP requests
- **Redis Support**: Production-ready OTP storage with Redis
- **Development Mode**: In-memory storage with OTP display for testing
- **Secure**: Environment-based configuration with proper validation
- **ES Module Compliant**: Full Next.js 15+ compatibility

## 📋 Prerequisites

- Node.js 18+ 
- Next.js 15+
- Redis (for production)
- SMS Gateway API credentials

## 🔧 Installation

### 1. Install Dependencies

```bash
npm install redis
```

### 2. Environment Configuration

Update your `.env.local` file:

```env
# New SMS Gateway Configuration
SMS_API_BASE_URL=https://your-sms-api-base-url.com
SMS_API_TOKEN=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLTA0RDc1OUEyNjQyMDRENCIsImlhdCI6MTc1NDY3NTA5OCwiZXhwIjoxOTEyMzU1MDk4fQ.yzjMLm3A2UKZkPhLaUAlsURgSGnzM7XPAh0c6zg5NWRN3Ze6-EHF-TTbEP4ekFVK6dUyZH_okJMHX52mVXuwow
SMS_CLIENT_ID=C-04D759A264204D4

# Redis Configuration (for production OTP storage)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Application Configuration
NODE_ENV=development
```

### 3. Redis Setup (Production)

For production, install and configure Redis:

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install redis-server

# macOS
brew install redis

# Start Redis
redis-server
```

## 📁 File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── send-otp/
│   │   │   └── route.ts          # Send OTP API endpoint
│   │   └── verify-otp/
│   │       └── route.ts          # Verify OTP API endpoint
│   └── test-otp/
│       └── page.tsx              # Test page for OTP flow
├── lib/
│   ├── sms.ts                    # Main OTP logic with Redis support
│   └── sms-service.ts            # SMS Gateway service class
└── utils/
    └── otp.ts                    # OTP utility functions
```

## 🔑 API Endpoints

### Send OTP: `POST /api/send-otp`

**Request:**
```json
{
  "phone": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "development_mode": true,
  "otp": "123456",
  "sms_sent": true
}
```

### Verify OTP: `POST /api/verify-otp`

**Request:**
```json
{
  "phone": "9876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

## 🛡️ Security Features

### Brute-Force Protection
- Max 5 failed attempts per phone number per hour
- Automatic blocking with remaining time display
- Resets after 1 hour from first attempt

### Rate Limiting
- 30 seconds cooldown between OTP requests
- Prevents SMS spam and abuse

### OTP Security
- 6-digit random OTP generation
- 5-minute expiration time
- Max 3 verification attempts per OTP
- Automatic cleanup of expired OTPs

## 🧪 Testing

### 1. Test Page
Visit `/test-otp` to test the complete OTP flow with a user-friendly interface.

### 2. Development Mode
In development mode:
- OTPs are displayed in console and API responses
- Uses in-memory storage instead of Redis
- All security features remain active

### 3. API Testing
```bash
# Send OTP
curl -X POST http://localhost:3000/api/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210"}'

# Verify OTP
curl -X POST http://localhost:3000/api/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","otp":"123456"}'
```

## 📊 Monitoring & Debugging

### Console Logs
The system provides detailed console logs:
- 📱 Phone number processing
- 📤 SMS sending attempts
- 📥 API responses
- 💾 Storage operations
- 🔍 OTP verification
- 🚫 Security blocks

### Debug Endpoint
Use `/api/debug-otp` to view current OTP store state (development only).

## 🔄 Migration from Fast2SMS

The new system is a drop-in replacement:
1. Update environment variables
2. No code changes needed in your frontend
3. All existing API endpoints remain the same
4. Enhanced security features are automatically active

## 🚨 Error Handling

### Common Errors
- **SMS Gateway configuration missing**: Check environment variables
- **Invalid phone number**: Must be 10-digit Indian number starting with 6-9
- **Rate limit exceeded**: Wait 30 seconds between requests
- **Brute-force protection**: Wait up to 60 minutes after 5 failed attempts
- **OTP expired**: Request new OTP after 5 minutes
- **Too many attempts**: Max 3 attempts per OTP

### Error Response Format
```json
{
  "success": false,
  "error": "Error message describing the issue"
}
```

## 🔧 Configuration Options

### SMS Message Customization
Edit the message in `src/lib/sms-service.ts`:
```typescript
const message = `Mealzee OTP: ${otp}. Valid for 5 minutes. Do not share.`;
```

### Timing Configuration
Adjust timeouts in `src/lib/sms.ts`:
- OTP expiry: 5 minutes (300 seconds)
- Rate limiting: 30 seconds
- Brute-force window: 1 hour
- Max attempts per OTP: 3
- Max attempts per hour: 5

## 📈 Production Deployment

### 1. Environment Setup
```env
NODE_ENV=production
REDIS_URL=redis://your-redis-server:6379
REDIS_PASSWORD=your-redis-password
SMS_API_BASE_URL=https://your-production-sms-api.com
SMS_API_TOKEN=your-production-jwt-token
SMS_CLIENT_ID=your-production-client-id
```

### 2. Redis Configuration
Ensure Redis is properly configured with:
- Persistence enabled
- Appropriate memory limits
- Security (password, firewall)
- Monitoring

### 3. Monitoring
Monitor these metrics:
- SMS delivery rates
- OTP verification success rates
- Brute-force attempts
- Redis performance
- API response times

## 🆘 Support

For issues or questions:
1. Check console logs for detailed error information
2. Verify environment variable configuration
3. Test SMS gateway connectivity
4. Check Redis connection (production)
5. Review rate limiting and brute-force protection logs

## 📝 Changelog

### v2.0.0 (Current)
- ✅ Replaced Fast2SMS with new SMS Gateway
- ✅ Added Redis support for production
- ✅ Enhanced brute-force protection (5 attempts/hour)
- ✅ Improved error handling and logging
- ✅ Added comprehensive test page
- ✅ ES Module compliance for Next.js 15+
