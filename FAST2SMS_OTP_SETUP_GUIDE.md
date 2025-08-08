# 🚀 Fast2SMS OTP Setup Guide - ₹0.25 per OTP

## 🎯 **Current Issue**
You're being charged **₹5 per OTP** instead of **₹0.25 per OTP** because:
1. OTP route requires website verification
2. System is falling back to expensive 'q' (quick) route
3. Need to use DLT approved templates

## 📋 **Step-by-Step Solution**

### **Step 1: Complete Website Verification**
1. **Login** to your Fast2SMS dashboard: https://www.fast2sms.com/
2. **Go to OTP Message** section in the left menu
3. **Complete Website Verification**:
   - Add your website URL: `https://yourdomain.com` (or localhost for testing)
   - Verify ownership by adding meta tag or uploading file
   - Wait for approval (usually 24-48 hours)

### **Step 2: Create DLT Template (Required for OTP Route)**
1. **Go to DLT Templates** section
2. **Create New Template**:
   ```
   Template: Your OTP is {#var#}. Valid for {#var#} minutes. Do not share with anyone.
   Category: Transactional
   Template Type: OTP
   ```
3. **Submit for approval** (takes 1-2 business days)
4. **Note the Template ID** once approved

### **Step 3: Update Code with Template ID**
Once you get the DLT template approved, update the code:

```typescript
// In src/lib/sms.ts
const requestBody = {
  sender_id: 'FSTSMS',
  message: `Your OTP is ${otp}. Valid for 5 minutes. Do not share with anyone.`,
  language: 'english',
  route: 'otp',
  numbers: cleanPhone,
  template_id: 'YOUR_APPROVED_TEMPLATE_ID' // Add this line
};
```

## 💰 **Cost Comparison**

| Route | Cost per SMS | Current Status |
|-------|-------------|----------------|
| `otp` | ₹0.25 | ❌ Requires verification |
| `q` (quick) | ₹5.00 | ✅ Currently using (expensive!) |
| `p` (promotional) | ₹0.25 | ⚠️ May go to spam |

## 🔧 **Temporary Solution (While Waiting for Approval)**

If you need immediate ₹0.25 per SMS, you can try the promotional route:

```typescript
// Temporary cheaper option
const requestBody = {
  sender_id: 'TXTLCL',
  message: `Mealzee OTP: ${otp}. Valid for 5 minutes.`,
  language: 'english',
  route: 'p', // Promotional route - ₹0.25
  numbers: cleanPhone
};
```

**Note**: Promotional messages may go to spam folder.

## 📱 **Alternative: Use Different SMS Provider**

If Fast2SMS verification takes too long, consider these alternatives:

### **1. TextLocal (₹0.25 per SMS)**
- No DLT verification required for testing
- Instant setup
- Good delivery rates

### **2. MSG91 (₹0.20 per SMS)**
- Competitive pricing
- Good API documentation
- Fast setup

### **3. Twilio (₹0.30 per SMS)**
- International provider
- Excellent reliability
- Easy integration

## 🚨 **Immediate Action Required**

1. **Login to Fast2SMS dashboard NOW**
2. **Start website verification process**
3. **Create DLT template**
4. **Monitor your current SMS costs** - you're losing ₹4.75 per OTP!

## 📊 **Cost Impact**

If you send 100 OTPs per day:
- **Current cost**: ₹500/day (₹15,000/month)
- **Target cost**: ₹25/day (₹750/month)
- **Savings**: ₹475/day (₹14,250/month)

## 🔍 **How to Check Current Route Usage**

Check your Fast2SMS dashboard:
1. Go to **Reports** → **SMS Reports**
2. Look for **Route** column
3. If you see 'q' or 'quick' → You're paying ₹5 per SMS
4. If you see 'otp' → You're paying ₹0.25 per SMS

## ✅ **Next Steps**

1. **Immediate**: Complete Fast2SMS website verification
2. **Short-term**: Create and get DLT template approved
3. **Long-term**: Consider switching to cheaper SMS provider if needed

**Time is money! Every day you delay costs you ₹475+ in extra SMS charges!**
