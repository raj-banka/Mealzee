# 📱 Free SMS OTP Setup Guide - Mealzee

## 🎯 Overview

This guide will help you set up a completely free SMS OTP authentication system for Mealzee using Fast2SMS, which provides ₹50 free credit after signup.

## 🚀 Quick Setup (5 minutes)

### Step 1: Sign up for Fast2SMS

1. **Visit Fast2SMS**: Go to [https://www.fast2sms.com/](https://www.fast2sms.com/)
2. **Sign Up**: Click "Sign Up" and create your account
3. **Verify Phone**: Complete phone verification
4. **Get Free Credit**: You'll receive ₹50 free credit automatically

### Step 2: Get Your API Key

1. **Login** to your Fast2SMS dashboard
2. **Go to Dev API**: Navigate to "Dev API" section
3. **Copy API Key**: Copy your API authorization key
4. **Save Key**: It looks like: `weBQKBrtZzLnD2ZUEnUYJIO40zZGnjgZm3BA1SAUd0qZ56gHm0k3X45DWR9c`

### Step 3: Configure Your Application

1. **Create `.env.local` file** in your project root:
```bash
# Fast2SMS Configuration
FAST2SMS_API_KEY=your_api_key_here
```

2. **Replace `your_api_key_here`** with your actual API key from Step 2

### Step 4: Test the System

1. **Start your development server**:
```bash
npm run dev
```

2. **Test OTP flow**:
   - Go to http://localhost:3000
   - Click any "Order Now" button
   - Enter your phone number
   - Check your phone for the OTP SMS
   - Enter the OTP to complete authentication

## 📊 Free Credit Usage

- **₹50 Free Credit** = ~200 OTP SMS messages
- **OTP SMS Cost**: ₹0.25 per SMS
- **Perfect for**: Development, testing, and small-scale deployment

## 🔧 API Details

### OTP SMS Route
- **Endpoint**: `https://www.fast2sms.com/dev/bulkV2`
- **Method**: POST
- **Route**: `otp`
- **Message Format**: "Your OTP: {otp_code}"

### Rate Limiting
- **60-second cooldown** between OTP requests
- **3 verification attempts** per OTP
- **5-minute OTP expiry**

## 🛡️ Security Features

✅ **Real SMS Delivery**: Actual SMS sent to phone numbers  
✅ **Rate Limiting**: Prevents spam and abuse  
✅ **OTP Expiry**: 5-minute timeout for security  
✅ **Attempt Limiting**: Maximum 3 verification attempts  
✅ **Phone Validation**: Indian phone number format validation  

## 🔄 How It Works

1. **User enters phone number** → System validates format
2. **Generate 6-digit OTP** → Store temporarily in memory
3. **Send via Fast2SMS API** → Real SMS delivered to user
4. **User enters OTP** → System verifies against stored OTP
5. **Authentication complete** → User logged in successfully

## 📱 Supported Features

- ✅ **Indian Phone Numbers**: +91 format support
- ✅ **6-digit OTP**: Standard format
- ✅ **Resend Functionality**: With 60-second cooldown
- ✅ **Auto-focus**: Smooth OTP input experience
- ✅ **Error Handling**: Comprehensive error messages

## 🆓 Cost Breakdown

| Service | Cost | Free Credit | SMS Count |
|---------|------|-------------|-----------|
| Fast2SMS | ₹0.25/SMS | ₹50 | ~200 SMS |
| WhatsApp | Free | N/A | Unlimited |
| Total Setup | **₹0** | **₹50** | **200+ messages** |

## 🔧 Troubleshooting

### Common Issues

**1. API Key Not Working**
- Verify you copied the complete API key
- Check for extra spaces or characters
- Ensure you're using the "Dev API" key

**2. SMS Not Received**
- Check phone number format (+91XXXXXXXXXX)
- Verify network connectivity
- Check spam/promotional SMS folder

**3. OTP Verification Failed**
- Ensure OTP is entered within 5 minutes
- Check for typos in OTP
- Try resending OTP after 60 seconds

**4. Rate Limiting**
- Wait 60 seconds between OTP requests
- Clear browser cache if needed
- Check console for error messages

### Debug Mode

Add this to your `.env.local` for debugging:
```bash
# Enable debug logging
NODE_ENV=development
```

## 🚀 Production Deployment

For production, consider:

1. **Upgrade Fast2SMS Plan**: For higher volume
2. **Add Redis**: For OTP storage instead of memory
3. **Database Integration**: Store user sessions
4. **Monitoring**: Track SMS delivery rates
5. **Backup Service**: Secondary SMS provider

## 📞 Support

- **Fast2SMS Support**: [Contact Fast2SMS](https://www.fast2sms.com/contact-us)
- **Documentation**: [Fast2SMS API Docs](https://docs.fast2sms.com)
- **Mealzee Admin**: WhatsApp +91 9204666105

## ✅ Setup Complete!

Your Mealzee application now has:
- ✅ **Free SMS OTP Authentication**
- ✅ **Real SMS Delivery**
- ✅ **₹50 Free Credit**
- ✅ **Production Ready**

**Next Steps**: Test the complete flow and start taking orders! 🍽️
