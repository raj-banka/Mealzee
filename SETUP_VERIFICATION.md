# 🔧 Setup Verification Guide

## 📋 Current Status

Your WhatsApp integration is implemented but needs configuration to send actual messages. Here's how to verify and set it up:

---

## 🧪 **Step 1: Check Current Configuration**

### **Test Configuration Status:**
1. **Open your browser**
2. **Go to:** http://localhost:3001/api/test-whatsapp
3. **Check the response:**

#### **If Not Configured (Expected):**
```json
{
  "configured": false,
  "configuration": {
    "hasAccessToken": false,
    "hasPhoneNumberId": false,
    "adminPhone": "919204666105"
  },
  "instructions": {
    "setup": "Follow WHATSAPP_CLOUD_API_SETUP.md for configuration"
  }
}
```

#### **If Configured:**
```json
{
  "configured": true,
  "configuration": {
    "hasAccessToken": true,
    "hasPhoneNumberId": true,
    "adminPhone": "919204666105",
    "accessTokenPreview": "EAAxxxxxxx..."
  }
}
```

---

## 🚀 **Step 2: Quick Setup (15 Minutes)**

### **Option A: WhatsApp Cloud API (Recommended)**

1. **Get WhatsApp Cloud API Credentials:**
   - Follow: `WHATSAPP_CLOUD_API_SETUP.md`
   - Get Access Token and Phone Number ID from Meta

2. **Create `.env.local` file:**
```bash
# In your project root directory
WHATSAPP_ACCESS_TOKEN=your_access_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
ADMIN_PHONE_NUMBER=919204666105
```

3. **Restart development server:**
```bash
npm run dev
```

### **Option B: Alternative Methods**

If WhatsApp Cloud API setup is complex, you can use:
- **Make.com webhook** (5 minutes setup)
- **Zapier webhook** (5 minutes setup)
- **Twilio WhatsApp API** (10 minutes setup)

---

## 🧪 **Step 3: Test the Integration**

### **Test 1: API Configuration**
```bash
# Check if API is configured
curl http://localhost:3001/api/test-whatsapp
```

### **Test 2: Send Test Message**
```bash
# Send test message to your WhatsApp
curl -X POST http://localhost:3001/api/test-whatsapp
```

### **Test 3: Place Test Order**
1. Go to http://localhost:3001
2. Select any meal plan
3. Fill order details
4. Click "Confirm Order"
5. Check your WhatsApp (9204666105) for message

---

## 📱 **Expected WhatsApp Message**

When you place a test order, you should receive:

```
New Order from Mealzee Website

Customer Details:
Name: [Your Name]
Phone: [Your Phone]
Email: [Your Email]

Order Details:
Plan: [Selected Plan]
Duration: [Duration]
Price: ₹[Amount]
Start Date: [Date]

Delivery Address:
[Your Address]

Special Preferences:
[Preferences or "None"]

Order ID: #[Order ID]
Timestamp: [Current Date/Time]

Please process this order and contact customer for confirmation.
```

---

## 🔧 **Troubleshooting**

### **Issue 1: No WhatsApp Message Received**

#### **Check Console Logs:**
1. Place test order
2. Open browser console (F12)
3. Look for these messages:

**Success:**
```
🚀 Order automatically sent to admin WhatsApp
✅ Method used: WhatsApp Business Cloud API
📱 Message sent to +91 9204666105
```

**Not Configured:**
```
❌ WhatsApp Business Cloud API not configured
Required environment variables:
- WHATSAPP_ACCESS_TOKEN
- WHATSAPP_PHONE_NUMBER_ID
```

#### **Solutions:**
- **If not configured:** Follow WhatsApp Cloud API setup
- **If configured but failed:** Check token permissions
- **If all methods failed:** Check network connection

### **Issue 2: Environment Variables Not Working**

#### **Check File Location:**
- `.env.local` must be in project root (same level as `package.json`)
- File name must be exactly `.env.local`
- No spaces in variable names

#### **Check File Content:**
```bash
# Correct format
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
ADMIN_PHONE_NUMBER=919204666105

# Incorrect (don't use quotes)
WHATSAPP_ACCESS_TOKEN="EAAxxxxxxxxx"
```

#### **Restart Server:**
```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

### **Issue 3: WhatsApp Cloud API Errors**

#### **Common Errors:**
- **Invalid token:** Generate new permanent token
- **Phone not verified:** Add 919204666105 as recipient in Meta Console
- **Permission denied:** Ensure token has `whatsapp_business_messaging` permission

---

## 📊 **Verification Checklist**

### **Configuration:**
- [ ] `.env.local` file created in project root
- [ ] `WHATSAPP_ACCESS_TOKEN` set
- [ ] `WHATSAPP_PHONE_NUMBER_ID` set
- [ ] `ADMIN_PHONE_NUMBER` set to 919204666105
- [ ] Development server restarted

### **Testing:**
- [ ] GET `/api/test-whatsapp` shows configured: true
- [ ] POST `/api/test-whatsapp` sends test message successfully
- [ ] Test order placement sends message to WhatsApp
- [ ] Message format matches expected format

### **Production Ready:**
- [ ] WhatsApp messages received on 9204666105
- [ ] Order details are complete and accurate
- [ ] No user interference or redirects
- [ ] Professional success screens working

---

## 🎯 **Quick Actions**

### **Right Now (2 minutes):**
1. **Check current status:** http://localhost:3001/api/test-whatsapp
2. **See what's missing:** Review the configuration response
3. **Identify next step:** WhatsApp Cloud API setup or alternative

### **Next 15 minutes:**
1. **Set up WhatsApp Cloud API:** Follow `WHATSAPP_CLOUD_API_SETUP.md`
2. **Configure environment variables:** Create `.env.local`
3. **Test integration:** Send test message and place test order

### **Result:**
✅ Orders automatically sent to your WhatsApp  
✅ No user interference  
✅ Professional message formatting  
✅ Reliable delivery system

---

## 🍱 **Your Mealzee orders will reach your WhatsApp!**

**Current Status**: Integration implemented, needs configuration  
**Setup Time**: 15 minutes for WhatsApp Cloud API  
**Alternative**: 5 minutes for webhook services  
**Result**: Automatic order notifications on WhatsApp 9204666105

Choose your preferred setup method and start receiving orders! 🚀📱✅
