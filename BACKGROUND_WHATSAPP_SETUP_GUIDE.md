# 🔧 Background WhatsApp Integration Setup Guide

## 📋 Overview

This guide explains how to set up the background WhatsApp integration that sends orders to your restaurant's WhatsApp (6299367631) without disrupting the user experience.

## 🎯 **What This Achieves**

✅ **Seamless User Experience**: Users never leave your website  
✅ **No WhatsApp Redirects**: Orders sent completely in background  
✅ **Professional Appearance**: Maintains enterprise-level look  
✅ **Reliable Delivery**: Multiple fallback methods ensure you get orders  
✅ **Zero User Interaction**: Fully automated order transmission  

---

## 🛠️ **Setup Options (Choose One)**

### **Option 1: Make.com Webhook (Recommended - Easiest)**

#### **Step 1: Create Make.com Account**
1. Go to [make.com](https://make.com)
2. Sign up for free account
3. Create new scenario

#### **Step 2: Setup WhatsApp Module**
1. Add "WhatsApp Business" module
2. Connect your WhatsApp Business account
3. Set message template

#### **Step 3: Add Webhook Trigger**
1. Add "Webhooks" > "Custom webhook" as trigger
2. Copy the webhook URL
3. Add to your `.env.local` file:
```bash
NEXT_PUBLIC_WEBHOOK_URL=https://hook.eu1.make.com/your-webhook-id
```

#### **Step 4: Configure Message Formatting**
```javascript
// In Make.com, format the message like this:
🍽️ *New Order from Mealzee Website*

*Customer Details:*
Name: {{data.customerName}}
Phone: {{data.phone}}
Email: {{data.email}}

*Order Details:*
Plan: {{data.planTitle}}
Duration: {{data.planDuration}}
Price: ₹{{data.planPrice}}
Start Date: {{data.startDate}}

*Delivery Address:*
{{data.address}}

*Special Preferences:*
{{data.preferences}}

*Order ID:* #{{data.orderId}}
*Timestamp:* {{timestamp}}

Please process this order and contact customer for confirmation.
```

---

### **Option 2: Twilio WhatsApp API**

#### **Step 1: Setup Twilio Account**
1. Go to [twilio.com](https://twilio.com)
2. Sign up and verify your account
3. Get WhatsApp sandbox access

#### **Step 2: Get Credentials**
1. Account SID from Twilio Console
2. Auth Token from Twilio Console
3. WhatsApp sandbox number

#### **Step 3: Environment Variables**
Add to your `.env.local` file:
```bash
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
```

---

### **Option 3: WhatsApp Business API (Advanced)**

#### **Step 1: Facebook Developer Account**
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create app with WhatsApp Business API
3. Complete business verification

#### **Step 2: Get API Credentials**
1. WhatsApp Business API Token
2. Phone Number ID
3. Webhook verification

#### **Step 3: Environment Variables**
Add to your `.env.local` file:
```bash
WHATSAPP_TOKEN=your_business_api_token
WHATSAPP_PHONE_ID=your_phone_number_id
```

---

### **Option 4: Email Fallback (Backup Method)**

#### **Step 1: Email Service**
1. Choose email service (SendGrid, Mailgun, etc.)
2. Get API credentials
3. Verify sender domain

#### **Step 2: Environment Variables**
Add to your `.env.local` file:
```bash
EMAIL_SERVICE_API_KEY=your_email_api_key
RESTAURANT_EMAIL=orders@mealzee.com
```

---

## 🚀 **Quick Start (Recommended)**

### **For Immediate Testing:**

1. **Create `.env.local` file** in your project root:
```bash
# Copy from .env.example and fill in your values
NEXT_PUBLIC_WEBHOOK_URL=https://hook.eu1.make.com/your-webhook-id
RESTAURANT_PHONE=916299367631
```

2. **Test the integration:**
   - Place a test order on your website
   - Check if webhook receives the data
   - Verify WhatsApp message is sent to 6299367631

3. **Monitor the logs:**
   - Check browser console for success/error messages
   - Verify API responses in Network tab

---

## 🔄 **How It Works**

### **User Journey (Seamless):**
```
1. User fills order form
   ↓
2. Clicks "Confirm Order"
   ↓
3. Sees "Processing Order..." (1.5 seconds)
   ↓
4. Order data sent to API endpoint (/api/send-whatsapp)
   ↓
5. API tries multiple sending methods:
   - Webhook service (Make.com/Zapier)
   - Twilio WhatsApp API
   - WhatsApp Business API
   - Email fallback
   - Database storage
   ↓
6. User sees professional success screen
   ↓
7. ✅ YOU RECEIVE ORDER ON WHATSAPP!
```

### **Background Process (Invisible to User):**
```
Frontend → API Route → Webhook/Service → WhatsApp → Restaurant
```

---

## 🧪 **Testing Your Setup**

### **Test Order Flow:**
1. Go to your website: http://localhost:3001
2. Select a meal plan
3. Fill order details
4. Click "Confirm Order"
5. Check if you receive WhatsApp message

### **Test Contact Form:**
1. Go to contact page: http://localhost:3001/contact
2. Fill contact form
3. Click "Send Message"
4. Check if you receive WhatsApp message

### **Debug Issues:**
1. Open browser console (F12)
2. Look for API call logs
3. Check Network tab for failed requests
4. Verify environment variables are set

---

## 📱 **WhatsApp Message Format**

### **Order Message You'll Receive:**
```
🍽️ *New Order from Mealzee Website*

*Customer Details:*
Name: John Doe
Phone: +91 9876543210
Email: john@example.com

*Order Details:*
Plan: Premium Lunch Plan
Duration: 1 Month
Price: ₹2999
Start Date: 2024-12-25

*Delivery Address:*
123 Main Street, Sector 4, B.S. City

*Special Preferences:*
No spicy food, vegetarian only

*Order ID:* #123456
*Timestamp:* 25/12/2024, 2:30:45 PM

Please process this order and contact customer for confirmation.
```

### **Contact Message You'll Receive:**
```
🍽️ *Contact Form Submission - Mealzee Website*

*Name:* Jane Smith
*Email:* jane@example.com
*Phone:* +91 9876543210
*Subject:* Delivery Inquiry

*Message:*
Hi, I wanted to know if you deliver to Sector 5 area.

*Reference ID:* #789012
*Timestamp:* 25/12/2024, 3:15:30 PM
---
Sent from Mealzee Contact Form
```

---

## 🔧 **Troubleshooting**

### **Common Issues:**

#### **1. No WhatsApp Messages Received**
- Check environment variables are set correctly
- Verify webhook URL is active
- Test API endpoint manually
- Check service account permissions

#### **2. API Errors in Console**
- Verify API route is accessible
- Check request payload format
- Ensure all required fields are present
- Test with different browsers

#### **3. Webhook Not Triggering**
- Verify webhook URL is correct
- Check Make.com/Zapier scenario is active
- Test webhook with manual trigger
- Verify JSON payload structure

#### **4. WhatsApp Business API Issues**
- Verify business verification status
- Check API token permissions
- Ensure phone number is verified
- Test with WhatsApp API explorer

---

## 🎯 **Production Deployment**

### **Before Going Live:**

1. **Test All Methods:**
   - Test webhook integration
   - Verify fallback methods work
   - Test error handling

2. **Set Production Environment Variables:**
   ```bash
   # In your hosting platform (Vercel, Netlify, etc.)
   NEXT_PUBLIC_WEBHOOK_URL=your_production_webhook_url
   WHATSAPP_TOKEN=your_production_token
   RESTAURANT_PHONE=916299367631
   ```

3. **Monitor Performance:**
   - Set up logging for failed sends
   - Monitor API response times
   - Track successful delivery rates

4. **Backup Plans:**
   - Email notifications as fallback
   - Database storage for manual processing
   - Admin dashboard for order management

---

## ✅ **Success Checklist**

- [ ] Environment variables configured
- [ ] Webhook service setup (Make.com/Zapier)
- [ ] Test order placed successfully
- [ ] WhatsApp message received on 6299367631
- [ ] Contact form tested
- [ ] No user redirects to WhatsApp
- [ ] Professional success screens working
- [ ] Error handling tested
- [ ] Production deployment ready

---

## 🍱 **Your Mealzee website now has true background WhatsApp integration!**

**Result**: Users experience a seamless, professional ordering system while you receive all orders instantly on WhatsApp without any user disruption! 🚀📱✅
