# Firebase Console Setup Guide

## 🎯 Required Firebase Console Configuration

To make the OTP integration work properly, you need to configure a few settings in your Firebase Console.

### 1. Enable Phone Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **mealzee-30a2e**
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Phone** provider
5. Click **Enable**
6. Save the changes

### 2. Configure Authorized Domains

1. In **Authentication** → **Settings** → **Authorized domains**
2. Make sure these domains are added:
   - `localhost` (for development)
   - `mealzee-30a2e.firebaseapp.com` (default)
   - Your production domain (when deploying)

### 3. Add Test Phone Numbers (Optional for Development)

1. In **Authentication** → **Settings** → **Phone numbers for testing**
2. Add test phone numbers with their corresponding OTP codes:
   - Phone: `+919876543210` → OTP: `123456`
   - Phone: `+919999999999` → OTP: `654321`

This allows testing without consuming SMS quota or sending real SMS.

### 4. Configure reCAPTCHA (Web)

1. In **Authentication** → **Settings** → **reCAPTCHA**
2. Ensure **reCAPTCHA Enterprise** is enabled (recommended)
3. Or use **reCAPTCHA v2** for basic protection

### 5. Set Usage Quotas (Optional)

1. Go to **Authentication** → **Usage**
2. Monitor your phone authentication usage
3. Set up billing alerts if needed

## 🔧 Development vs Production

### Development Mode:
- Use test phone numbers to avoid SMS charges
- Test with localhost domain
- Monitor console logs for debugging

### Production Mode:
- Remove test phone numbers
- Add your production domain to authorized domains
- Set up proper billing for SMS charges
- Monitor usage and costs

## 📱 SMS Charges

**Important**: Firebase Phone Authentication charges for SMS messages:
- **Free Tier**: Limited free SMS per month
- **Paid Tier**: Per-SMS charges apply
- **Test Numbers**: Don't consume SMS quota

## 🛠️ Troubleshooting

### Common Issues:

1. **"reCAPTCHA verification failed"**
   - Check authorized domains
   - Ensure reCAPTCHA is properly configured
   - Try clearing browser cache

2. **"Invalid phone number"**
   - Ensure phone number includes country code (+91)
   - Check phone number format
   - Verify the number is valid

3. **"Too many requests"**
   - Firebase rate limiting activated
   - Wait before trying again
   - Use test phone numbers for development

4. **"OTP not received"**
   - Check SMS quota/billing
   - Verify phone number is correct
   - Check spam/blocked messages

### Debug Steps:

1. Check browser console for error messages
2. Verify Firebase project configuration
3. Test with known working phone number
4. Use Firebase Console logs for debugging

## ✅ Verification Checklist

Before going live, ensure:

- [ ] Phone Authentication is enabled
- [ ] Authorized domains are configured
- [ ] reCAPTCHA is working
- [ ] Test phone numbers work (development)
- [ ] Real phone numbers work (production)
- [ ] SMS billing is set up (production)
- [ ] Usage monitoring is configured

## 🎉 Ready to Test!

Once configured, you can test the OTP integration:

1. **Development**: http://localhost:3000/test-firebase-otp
2. **Main App**: http://localhost:3000 (click login button)

The system will now send real SMS OTP to phone numbers and authenticate users through Firebase!