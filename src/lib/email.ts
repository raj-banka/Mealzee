import nodemailer from 'nodemailer';

export interface OrderData {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  isTemporaryAddress?: boolean; // Flag to indicate if this is different from profile address
  mealPlan?: {
    title: string;
    duration: string;
    price: number;
    originalPrice?: number;
  };
  dish?: {
    name: string;
    price: number;
    quantity?: number;
    description?: string;
    spiceLevel?: string;
    calories?: number;
    rating?: number;
    preparationTime?: string;
    isVeg?: boolean;
  };
  orderType: 'meal-plan' | 'individual-dish';
  startDate?: string;
  preferences?: string;
  timestamp: string;
  totalAmount: number;
  // Additional fields to match WhatsApp template
  dob?: string;
  dietaryPreference?: 'vegetarian' | 'non-vegetarian';
  referralCode?: string;
  referralName?: string;
}

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  referenceId: string;
  timestamp: string;
}

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || '587'),
    secure: false, // Use STARTTLS
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
};

// Generate order email HTML template
const generateOrderEmailHTML = (orderData: OrderData): string => {
  const {
    orderId,
    customerName,
    customerPhone,
    customerEmail,
    address,
    mealPlan,
    dish,
    orderType,
    startDate,
    preferences,
    timestamp,
    totalAmount,
    dob,
    dietaryPreference,
    referralCode,
    referralName
  } = orderData;

  // Calculate the correct price for display - use individual dish price for single orders
  const isIndividualDish = orderType === 'individual-dish';
  const dishQuantity = dish?.quantity || 1;
  const dishTotalPrice = dish?.price ? dish.price * dishQuantity : totalAmount;
  const displayPrice = isIndividualDish ? dishTotalPrice : (mealPlan?.price || totalAmount);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Mealzee Order</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.4; color: #333; margin: 0; padding: 10px; }
        .container { max-width: 650px; margin: 0 auto; }
        .header { background: #00430D; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 22px; }
        .header p { margin: 8px 0 0 0; font-size: 16px; font-weight: 500; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .section { background: white; padding: 15px; margin: 12px 0; border-radius: 6px; border-left: 4px solid #00430D; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .section h3 { margin: 0 0 12px 0; font-size: 16px; color: #00430D; font-weight: 600; }
        .section p { margin: 6px 0; font-size: 14px; }
        .row { display: flex; flex-wrap: wrap; gap: 20px; }
        .col { flex: 1; min-width: 280px; }
        .data-row { color: #555; display: flex; align-items: flex-start; }
        .data-row strong { color: #00430D; font-weight: 600; margin-right: 8px; min-width: 130px; flex-shrink: 0; }
        .data-row .value { flex: 1; word-wrap: break-word; line-height: 1.4; }
        .total { background: #00430D; color: white; padding: 15px; text-align: center; border-radius: 6px; font-size: 18px; font-weight: bold; margin: 15px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .price-highlight { font-size: 16px; font-weight: 600; color: #00430D; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍽️ New Mealzee Order #${orderId}</h1>
          <p>₹${displayPrice} | ${new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}</p>
        </div>

        <div class="content">
          <div class="row">
            <div class="col">
              <div class="section">
                <h3>👤 Customer Details</h3>
                <p><span class="data-row"><strong>Name:</strong> <span class="value">${customerName}</span></span></p>
                <p><span class="data-row"><strong>Phone:</strong> <span class="value">${customerPhone}</span></span></p>
                <p><span class="data-row"><strong>DOB:</strong> <span class="value">${dob || 'N/A'}</span></span></p>
                <p><span class="data-row"><strong>Diet:</strong> <span class="value">${dietaryPreference === 'vegetarian' ? '🟢 Vegetarian' : dietaryPreference === 'non-vegetarian' ? '🔴 Non-Vegetarian' : 'N/A'}</span></span></p>
              </div>
            </div>

            <div class="col">
              <div class="section">
                <h3>🍽️ Order Details</h3>
                ${isIndividualDish && dish ? `
                  <p><span class="data-row"><strong>Dish:</strong> <span class="value">${dish.name}</span></span></p>
                  ${dishQuantity > 1 ? `<p><span class="data-row"><strong>Quantity:</strong> <span class="value">${dishQuantity}</span></span></p>` : ''}
                  <p><span class="data-row"><strong>Unit Price:</strong> <span class="value price-highlight">₹${dish.price}</span></span></p>
                  ${dishQuantity > 1 ? `<p><span class="data-row"><strong>Total Price:</strong> <span class="value price-highlight">₹${dishTotalPrice}</span></span></p>` : ''}
                  <p><span class="data-row"><strong>Type:</strong> <span class="value">${dish.isVeg ? '🟢 Vegetarian' : '🔴 Non-Vegetarian'}</span></span></p>
                  ${dish.spiceLevel ? `<p><span class="data-row"><strong>Spice Level:</strong> <span class="value">${dish.spiceLevel}</span></span></p>` : ''}
                  ${dish.calories ? `<p><span class="data-row"><strong>Calories:</strong> <span class="value">${dish.calories} cal ${dishQuantity > 1 ? `(${dish.calories * dishQuantity} cal total)` : ''}</span></span></p>` : ''}
                  ${dish.rating ? `<p><span class="data-row"><strong>Rating:</strong> <span class="value">${dish.rating}⭐</span></span></p>` : ''}
                  ${dish.preparationTime ? `<p><span class="data-row"><strong>Prep Time:</strong> <span class="value">${dish.preparationTime}</span></span></p>` : ''}
                ` : ''}
                ${!isIndividualDish && mealPlan ? `
                  <p><span class="data-row"><strong>Plan:</strong> <span class="value">${mealPlan.title}</span></span></p>
                  <p><span class="data-row"><strong>Duration:</strong> <span class="value">${mealPlan.duration}</span></span></p>
                  <p><span class="data-row"><strong>Price:</strong> <span class="value price-highlight">₹${mealPlan.price}</span></span></p>
                  ${startDate ? `<p><span class="data-row"><strong>Start Date:</strong> <span class="value">${new Date(startDate).toLocaleDateString('en-IN')}</span></span></p>` : ''}
                ` : ''}
              </div>
            </div>
          </div>

          ${isIndividualDish && dish?.description ? `
          <div class="section">
            <h3>📝 Dish Description</h3>
            <p><span class="data-row">${dish.description}</span></p>
          </div>
          ` : ''}

          <div class="section">
            <h3>� Delivery & Preferences</h3>
            <p><span class="data-row"><strong>Address:</strong> <span class="value">${address}</span></span></p>
            <p><span class="data-row"><strong>Preferences:</strong> <span class="value">${preferences || 'None'}</span></span></p>
            ${referralCode ? `<p><span class="data-row"><strong>Referral Code:</strong> <span class="value">${referralCode}</span></span></p>` : ''}
            ${referralName ? `<p><span class="data-row"><strong>Referral Name:</strong> <span class="value">${referralName}</span></span></p>` : ''}
          </div>

          <div class="total">
            Total: ₹${displayPrice} | Status: Pending | ${isIndividualDish ? 'One-time' : 'Subscription'}
          </div>

          <div class="footer">
            <p>Mealzee Order Management System | Auto-generated on ${new Date().toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send order notification email to admin
export const sendOrderNotificationEmail = async (orderData: OrderData): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    const adminEmail = process.env.ADMIN_EMAIL || 'mealzeeindia@gmail.com';
    
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: adminEmail,
      subject: `🚨 URGENT: New Mealzee Order #${orderData.orderId} - ₹${orderData.totalAmount} - Call Customer Now!`,
      html: generateOrderEmailHTML(orderData),
      text: `
*New ${orderData.orderType === 'meal-plan' ? 'Meal Plan' : 'Individual Dish'} Order from Mealzee Website*

*Customer Details:*
Name: ${orderData.customerName}
Phone: ${orderData.customerPhone}
DOB: ${orderData.dob || 'N/A'}
Dietary Preference: ${orderData.dietaryPreference || 'N/A'}

*Order Details:*
${orderData.orderType === 'meal-plan' && orderData.mealPlan ?
  `Plan: ${orderData.mealPlan.title}
Duration: ${orderData.mealPlan.duration}
Price: Rs.${orderData.mealPlan.price}
Start Date: ${orderData.startDate || 'N/A'}` :
  `Dish: ${orderData.dish?.name}
${orderData.dish?.quantity && orderData.dish.quantity > 1 ? `Quantity: ${orderData.dish.quantity}` : ''}
Unit Price: Rs.${orderData.dish?.price}
${orderData.dish?.quantity && orderData.dish.quantity > 1 ? `Total Price: Rs.${(orderData.dish?.price || 0) * orderData.dish.quantity}` : ''}
Type: ${orderData.dish?.isVeg ? '🟢 Vegetarian' : '🔴 Non-Vegetarian'}
${orderData.dish?.spiceLevel ? `Spice Level: ${orderData.dish.spiceLevel}` : ''}
${orderData.dish?.calories ? `Calories: ${orderData.dish.calories} cal${orderData.dish?.quantity && orderData.dish.quantity > 1 ? ` (${orderData.dish.calories * orderData.dish.quantity} cal total)` : ''}` : ''}
${orderData.dish?.rating ? `Rating: ${orderData.dish.rating}⭐` : ''}
${orderData.dish?.preparationTime ? `Prep Time: ${orderData.dish.preparationTime}` : ''}
Order Date: ${new Date().toLocaleDateString()}`
}

${orderData.orderType === 'individual-dish' && orderData.dish?.description ? `
*Dish Description:*
${orderData.dish.description}
` : ''}
*Delivery Address:*
${orderData.address}

*Special Preferences:*
${orderData.preferences || 'None'}

*Referral:*
Code: ${orderData.referralCode || 'No referral'}
Name: ${orderData.referralName || 'No referral'}

*Order ID:* #${orderData.orderId}

*Timestamp:* ${new Date().toLocaleString()}

Please process this ${orderData.orderType === 'meal-plan' ? 'meal plan' : 'dish'} order.

Thank you!
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Order notification email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('❌ Failed to send order notification email:', error);
    return false;
  }
};

// Generate contact email HTML template
const generateContactEmailHTML = (contactData: ContactData): string => {
  const {
    name,
    email,
    phone,
    subject,
    message,
    referenceId,
    timestamp
  } = contactData;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Contact Message - Mealzee</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.4; color: #333; margin: 0; padding: 10px; }
        .container { max-width: 650px; margin: 0 auto; }
        .header { background: #00430D; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 22px; }
        .header p { margin: 8px 0 0 0; font-size: 16px; font-weight: 500; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .section { background: white; padding: 15px; margin: 12px 0; border-radius: 6px; border-left: 4px solid #00430D; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .section h3 { margin: 0 0 12px 0; font-size: 16px; color: #00430D; font-weight: 600; }
        .section p { margin: 6px 0; font-size: 14px; }
        .data-row { color: #555; }
        .data-row strong { color: #00430D; font-weight: 600; margin-right: 8px; }
        .message-content { background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 3px solid #007bff; margin: 10px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .priority { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; border-radius: 4px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📞 New Contact Message #${referenceId}</h1>
          <p>${new Date(timestamp).toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}</p>
        </div>

        <div class="content">
          <div class="priority">
            <strong>⚡ Priority:</strong> New customer inquiry - Please respond within 2 hours
          </div>

          <div class="section">
            <h3>👤 Customer Details</h3>
            <p><span class="data-row"><strong>Name:</strong> <span class="value">${name}</span></span></p>
            <p><span class="data-row"><strong>Email:</strong> <span class="value">${email}</span></span></p>
            <p><span class="data-row"><strong>Phone:</strong> <span class="value">${phone}</span></span></p>
            <p><span class="data-row"><strong>Subject:</strong> <span class="value">${subject}</span></span></p>
          </div>

          <div class="section">
            <h3>💬 Message Content</h3>
            <div class="message-content">
              ${message.split('\n').map(line => `<p>${line}</p>`).join('')}
            </div>
          </div>

          <div class="section">
            <h3>📋 Reference Information</h3>
            <p><span class="data-row"><strong>Reference ID:</strong> <span class="value">#${referenceId}</span></span></p>
            <p><span class="data-row"><strong>Received:</strong> <span class="value">${new Date(timestamp).toLocaleString('en-IN')}</span></span></p>
            <p><span class="data-row"><strong>Source:</strong> <span class="value">Mealzee Website Contact Form</span></span></p>
          </div>

          <div class="footer">
            <p>Mealzee Contact Management System | Auto-generated on ${new Date().toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send contact notification email to admin
export const sendContactNotificationEmail = async (contactData: ContactData): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    const adminEmail = process.env.ADMIN_EMAIL || 'mealzeeindia@gmail.com';

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: adminEmail,
      subject: `📞 New Contact Message #${contactData.referenceId} - ${contactData.subject} - Please Respond!`,
      html: generateContactEmailHTML(contactData),
      text: `
📞 New Contact Message from Mealzee Website

Customer Details:
Name: ${contactData.name}
Email: ${contactData.email}
Phone: ${contactData.phone}
Subject: ${contactData.subject}

Message:
${contactData.message}

Reference ID: #${contactData.referenceId}
Timestamp: ${contactData.timestamp}

Please respond to this inquiry within 2 hours.

Thank you!
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Contact notification email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('❌ Failed to send contact notification email:', error);
    return false;
  }
};

// Test email configuration
export const testEmailConfiguration = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    return false;
  }
};
