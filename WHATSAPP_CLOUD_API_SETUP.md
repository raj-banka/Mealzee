# 📱 WhatsApp Cloud API Setup Guide - Get Orders on Your WhatsApp

## 🎯 Overview

This guide will help you set up WhatsApp Cloud API to automatically receive order notifications on your WhatsApp (9204666105) without any user interference.

---

## 🚀 **Quick Setup (15 Minutes)**

### **Step 1: Create Meta Developer Account**

1. **Go to Meta for Developers:**
   - Visit: https://developers.facebook.com
   - Click "Get Started"
   - Log in with your Facebook account

2. **Create New App:**
   - Click "Create App"
   - Select "Business" as app type
   - Enter app name: "Mealzee Orders"
   - Enter contact email
   - Click "Create App"

### **Step 2: Add WhatsApp Product**

1. **Add WhatsApp to Your App:**
   - In your app dashboard, click "Add Product"
   - Find "WhatsApp" and click "Set up"

2. **Get Your Credentials:**
   - You'll see the WhatsApp API setup page
   - Note down these values:
     - **Phone Number ID** (starts with numbers like 123456789012345)
     - **Access Token** (temporary token for testing)

### **Step 3: Get Permanent Access Token**

1. **Create System User:**
   - Go to "App Settings" > "Basic"
   - Scroll down to "System Users"
   - Click "Create System User"
   - Name: "Mealzee WhatsApp Bot"
   - Role: "Admin"

2. **Generate Permanent Token:**
   - Click on the system user you created
   - Click "Generate New Token"
   - Select your app
   - Select permissions: `whatsapp_business_messaging`
   - Click "Generate Token"
   - **Copy and save this token** (you won't see it again)

### **Step 4: Add Recipient Phone Number**

1. **Add Your Phone Number:**
   - In WhatsApp API setup, find "To" field
   - Enter: `919204666105`
   - Click "Send" to verify
   - Check your WhatsApp for verification code
   - Enter the code to verify

### **Step 5: Configure Your Website**

1. **Create `.env.local` file** in your project root:
```bash
# WhatsApp Cloud API Configuration
WHATSAPP_ACCESS_TOKEN=your_permanent_access_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
ADMIN_PHONE_NUMBER=919204666105
```

2. **Replace the values:**
   - `WHATSAPP_ACCESS_TOKEN`: Your permanent access token from Step 3
   - `WHATSAPP_PHONE_NUMBER_ID`: Your phone number ID from Step 2
   - `ADMIN_PHONE_NUMBER`: Your WhatsApp number (919204666105)

### **Step 6: Test the Integration**

1. **Restart your development server:**
```bash
npm run dev
```

2. **Place a test order:**
   - Go to http://localhost:3001
   - Select any meal plan
   - Fill order details
   - Click "Confirm Order"

3. **Check your WhatsApp:**
   - You should receive the order message on 9204666105
   - Message will be formatted exactly as specified

---

## 🔧 **Detailed Configuration**

### **Environment Variables Explained:**

```bash
# Primary Configuration (Required)
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxx
# This is your permanent access token from Meta Developer Console
# Starts with "EAA" and is very long (200+ characters)

WHATSAPP_PHONE_NUMBER_ID=123456789012345
# This is the Phone Number ID from WhatsApp Business API
# Found in your Meta Developer Console under WhatsApp > API Setup

ADMIN_PHONE_NUMBER=919204666105
# Your WhatsApp number where you want to receive orders
# Include country code (91 for India) but no + sign
```

### **Message Format You'll Receive:**

```
New Order from Mealzee Website

Customer Details:
Name: Raj
Phone: 
Email: rajbanka80@gmail.com

Order Details:
Plan: Breakfast, Lunch & Dinner
Duration: 1 Month
Price: ₹3399
Start Date: 2025-06-24

Delivery Address:
Sector 4, B.S. City, Delhi - 110001

Special Preferences:
None

Order ID: #338963
Timestamp: 6/23/2025, 11:42:18 PM

Please process this order and contact customer for confirmation.
```

---

## 🧪 **Testing & Troubleshooting**

### **Test Your Setup:**

1. **Check Environment Variables:**
```bash
# In your project directory, create .env.local with your actual values
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
ADMIN_PHONE_NUMBER=919204666105
```

2. **Test API Call:**
   - Place order on your website
   - Check browser console (F12) for logs:
   ```
   🚀 Sending via WhatsApp Cloud API...
   Phone Number ID: 123456789012345
   Admin Phone: 919204666105
   ✅ WhatsApp Cloud API Success: {...}
   ```

3. **Verify WhatsApp Receipt:**
   - Check your WhatsApp (9204666105)
   - You should receive the formatted order message

### **Common Issues & Solutions:**

#### **Issue 1: "WhatsApp Business Cloud API not configured"**
**Solution:**
- Verify `.env.local` file exists in project root
- Check environment variable names are exact
- Restart development server after adding variables

#### **Issue 2: "Invalid access token"**
**Solution:**
- Generate new permanent access token
- Make sure you're using permanent token, not temporary
- Check token has `whatsapp_business_messaging` permission

#### **Issue 3: "Phone number not verified"**
**Solution:**
- Add 919204666105 as recipient in Meta Developer Console
- Verify the number by receiving verification code
- Make sure number format is correct (no + sign)

#### **Issue 4: "Message not received"**
**Solution:**
- Check WhatsApp is connected to internet
- Verify phone number is correct in environment variables
- Check Meta Developer Console for API call logs

### **Debug Logs:**

Check browser console for these messages:
```
✅ Success: WhatsApp Cloud API Success: {message_id: "wamid.xxx"}
❌ Error: WhatsApp Cloud API Error: {error details}
❌ Not configured: WhatsApp Business Cloud API not configured
```

---

## 🔐 **Security Best Practices**

### **Environment Variables:**
- Never commit `.env.local` to version control
- Use different tokens for development and production
- Regenerate tokens if compromised

### **Access Token Security:**
- Store tokens securely
- Use permanent tokens for production
- Monitor token usage in Meta Developer Console

---

## 🚀 **Production Deployment**

### **For Production (Vercel, Netlify, etc.):**

1. **Add Environment Variables:**
   - In your hosting platform dashboard
   - Add the same variables from `.env.local`
   - Deploy your application

2. **Verify Production:**
   - Test order placement on live website
   - Check WhatsApp message receipt
   - Monitor API usage in Meta Console

### **Webhook Verification (Optional):**
- Set up webhook for delivery status
- Monitor message delivery rates
- Handle failed message scenarios

---

## 📊 **Monitoring & Analytics**

### **Meta Developer Console:**
- Monitor API usage
- Check message delivery status
- View error logs and debugging info

### **Application Logs:**
- Monitor console logs for API responses
- Track successful/failed message sends
- Set up alerts for API failures

---

## 🎯 **Expected Results**

### **After Setup:**
✅ Orders automatically sent to your WhatsApp  
✅ No user interference or redirects  
✅ Professional message formatting  
✅ Reliable delivery via official Meta API  
✅ Real-time order notifications  

### **User Experience:**
- Users place orders normally
- See professional success screen
- Never know about WhatsApp integration
- Seamless, enterprise-level experience

### **Admin Experience:**
- Receive instant WhatsApp notifications
- Complete order details included
- Professional message formatting
- Ready for immediate processing

---

## 🍱 **Your Mealzee orders will now automatically reach your WhatsApp!**

**Setup Time**: 15 minutes  
**Reliability**: Official Meta API  
**User Experience**: Zero interference  
**Admin Experience**: Instant WhatsApp notifications

Follow this guide to start receiving all orders automatically on WhatsApp 9204666105! 🚀📱✅
