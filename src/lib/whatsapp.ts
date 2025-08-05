// Free WhatsApp Integration Service
// This service uses web.whatsapp.com for free messaging

import { WHATSAPP_CONFIG } from '@/lib/constants';

export interface WhatsAppOptions {
  message?: string;
  phoneNumber?: string;
}

export interface OrderData {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  planTitle: string;
  planDuration: string;
  planPrice: string;
  startDate: string;
  preferences?: string;
  orderId: string;
  dietaryPreference: 'vegetarian' | 'non-vegetarian';
  dob: string;
  referralCode?: string;
  referralName?: string;
  // Additional fields for individual dish orders
  orderType?: 'meal-plan' | 'individual-dish';
  dishDescription?: string;
  dishSpiceLevel?: string;
  dishCalories?: number;
  dishRating?: number;
  dishPrepTime?: string;
  dishQuantity?: number;
}

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  referenceId: string;
}

// Admin WhatsApp number for order notifications (normal WhatsApp account)
const ADMIN_PHONE = '919608036638';

/**
 * Opens WhatsApp with a pre-filled message (supports both personal and business accounts)
 */
export const openWhatsApp = ({ message, phoneNumber }: WhatsAppOptions = {}) => {
  const phone = phoneNumber || WHATSAPP_CONFIG.phoneNumber;

  // Clean and encode the message properly
  const cleanMessage = message || WHATSAPP_CONFIG.messages.generalInquiry;

  // Encode the message
  const encodedMessage = encodeURIComponent(cleanMessage);

  // Debug: Log the details
  console.log('📱 Original message:', cleanMessage);
  console.log('📱 Message length:', cleanMessage.length);
  console.log('📱 Phone number:', phone);
  console.log('📱 Encoded message length:', encodedMessage.length);

  // Try multiple URL formats for WhatsApp Business compatibility
  const urls = [
    // Format 1: Standard wa.me (works for personal accounts)
    `https://wa.me/${phone}?text=${encodedMessage}`,

    // Format 2: WhatsApp Business API format
    `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`,

    // Format 3: WhatsApp web format
    `https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`
  ];

  console.log('📱 Trying URL formats for WhatsApp Business compatibility:');
  urls.forEach((url, index) => {
    console.log(`📱 Format ${index + 1}:`, url.substring(0, 100) + '...');
  });

  // Try the WhatsApp Business API format first (most reliable for business accounts)
  const primaryUrl = urls[1]; // api.whatsapp.com format
  console.log('📱 Opening WhatsApp Business URL:', primaryUrl.substring(0, 100) + '...');

  // Open the URL
  const newWindow = window.open(primaryUrl, '_blank', 'noopener,noreferrer');

  // Fallback: If the window didn't open, try the standard format
  if (!newWindow) {
    console.log('📱 Fallback: Trying standard wa.me format');
    window.open(urls[0], '_blank', 'noopener,noreferrer');
  }
};

/**
 * Send order to admin - User-friendly automatic delivery
 */
export function sendOrderToWhatsApp(orderData: OrderData): boolean {
  try {
    console.log('📱 Processing order for admin notification...');

    // Format the order message
    const message = formatOrderMessage(orderData);

    // Send order via the most reliable method
    sendOrderToAdmin(orderData, message);

    return true;
  } catch (error) {
    console.error('Failed to process order:', error);
    return false;
  }
}

/**
 * Send order to admin WhatsApp - Optimized for normal WhatsApp account
 */
async function sendOrderToAdmin(orderData: OrderData, message: string) {
  console.log('📱 Sending order to normal WhatsApp account:', ADMIN_PHONE);

  // Send directly to WhatsApp with the order message
  sendToWhatsAppDirectly(message, ADMIN_PHONE);

  // Store order locally for admin reference
  storeOrderLocally(orderData);

  // Show success message to user
  showUserSuccessMessage(orderData);

  console.log('✅ Order sent to WhatsApp +91 9608036638');
}

/**
 * Send message directly to normal WhatsApp account
 */
function sendToWhatsAppDirectly(message: string, phoneNumber: string) {
  console.log('📱 Opening normal WhatsApp with order details...');
  console.log('📱 Target number: +91 9608036638');

  // Encode the message for URL (normal WhatsApp handles this better)
  const encodedMessage = encodeURIComponent(message);

  // Create WhatsApp URL with the message (normal accounts work better)
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  console.log('📱 WhatsApp URL length:', whatsappUrl.length);
  console.log('📱 Message preview:', message.substring(0, 100) + '...');
  console.log('📱 Opening WhatsApp for normal account...');

  // Open WhatsApp with the pre-filled message
  const whatsappWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

  if (whatsappWindow) {
    console.log('✅ WhatsApp opened successfully with order details');
  } else {
    console.log('❌ Failed to open WhatsApp - popup blocked?');
  }
}

/**
 * Store order locally for admin reference
 */
function storeOrderLocally(orderData: OrderData) {
  try {
    const orders = JSON.parse(localStorage.getItem('mealzee_orders') || '[]');
    orders.push({
      ...orderData,
      timestamp: new Date().toISOString(),
      status: 'pending'
    });
    localStorage.setItem('mealzee_orders', JSON.stringify(orders));
    console.log('✅ Order stored locally for admin reference');
  } catch (error) {
    console.log('❌ Failed to store order locally:', error);
  }
}

/**
 * Show success message to user
 */
function showUserSuccessMessage(orderData: OrderData) {
  // Create a clean success notification for the user
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #25D366, #128C7E);
      color: white;
      padding: 30px;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      z-index: 10000;
      font-family: Arial, sans-serif;
      text-align: center;
      max-width: 400px;
      animation: slideIn 0.5s ease-out;
    ">
      <style>
        @keyframes slideIn {
          from { opacity: 0; transform: translate(-50%, -60%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
      </style>
      <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
      <h2 style="margin: 0 0 10px 0; font-size: 24px;">Order Placed Successfully!</h2>
      <p style="margin: 0 0 15px 0; opacity: 0.9; font-size: 16px;">
        Order #${orderData.orderId} for ${orderData.planTitle}
      </p>
      <p style="margin: 0; font-size: 14px; opacity: 0.8;">
        We'll contact you shortly to confirm your order details.
      </p>
    </div>
  `;

  document.body.appendChild(notification);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOut 0.3s ease-in forwards';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }, 4000);

  // Add slideOut animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideOut {
      from { opacity: 1; transform: translate(-50%, -50%); }
      to { opacity: 0; transform: translate(-50%, -60%); }
    }
  `;
  document.head.appendChild(style);
}

// Removed clipboard functions for cleaner user experience

// Removed complex API functions - using direct WhatsApp URL method for simplicity

// Removed unused functions for cleaner code

// Removed test functions for production-ready code

/**
 * Specialized function for WhatsApp Business accounts
 */
export const openWhatsAppBusiness = ({ message, phoneNumber }: WhatsAppOptions = {}) => {
  const phone = phoneNumber || WHATSAPP_CONFIG.phoneNumber;
  const cleanMessage = message || WHATSAPP_CONFIG.messages.generalInquiry;

  console.log('📱 Opening WhatsApp Business for phone:', phone);
  console.log('📱 Message preview:', cleanMessage.substring(0, 100) + '...');

  // For WhatsApp Business, try different approaches
  const encodedMessage = encodeURIComponent(cleanMessage);

  // Method 1: WhatsApp Business API URL (most reliable)
  const businessUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;

  // Method 2: Standard wa.me URL as fallback
  const standardUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

  // Method 3: WhatsApp Web URL as second fallback
  const webUrl = `https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;

  console.log('📱 Business URL length:', businessUrl.length);
  console.log('📱 Trying WhatsApp Business API URL...');

  try {
    // Try opening the business URL
    const businessWindow = window.open(businessUrl, '_blank', 'noopener,noreferrer');

    if (!businessWindow || businessWindow.closed) {
      console.log('📱 Business URL failed, trying standard wa.me...');
      const standardWindow = window.open(standardUrl, '_blank', 'noopener,noreferrer');

      if (!standardWindow || standardWindow.closed) {
        console.log('📱 Standard URL failed, trying web WhatsApp...');
        window.open(webUrl, '_blank', 'noopener,noreferrer');
      }
    } else {
      console.log('📱 WhatsApp Business URL opened successfully!');
    }
  } catch (error) {
    console.error('📱 Error opening WhatsApp Business:', error);
    // Final fallback
    window.open(standardUrl, '_blank', 'noopener,noreferrer');
  }
};

// Contact functionality removed - now using email service



/**
 * Format order data for WhatsApp message - Clean and URL-safe
 */
export function formatOrderMessage(orderData: OrderData): string {
  const isIndividualDish = orderData.orderType === 'individual-dish';

  // Create a clean message that works well with WhatsApp URL encoding
  const message = `*New ${isIndividualDish ? 'Individual Dish' : 'Meal Plan'} Order from Mealzee Website*

*Customer Details:*
Name: ${orderData.customerName}
Phone: ${orderData.phone}
DOB: ${orderData.dob || 'N/A'}
Dietary Preference: ${orderData.dietaryPreference}

*Order Details:*
${isIndividualDish ? 'Dish' : 'Plan'}: ${orderData.planTitle}
${isIndividualDish && orderData.dishQuantity && orderData.dishQuantity > 1 ? `Quantity: ${orderData.dishQuantity}` : ''}
${isIndividualDish ? '' : `Duration: ${orderData.planDuration}`}
Price: Rs.${orderData.planPrice}
${isIndividualDish ? `Order Date: ${new Date().toLocaleDateString()}` : `Start Date: ${orderData.startDate}`}

${isIndividualDish && orderData.dishDescription ? `*Dish Description:*
${orderData.dishDescription}
` : ''}${isIndividualDish ? `*Dish Details:*
${orderData.dishSpiceLevel ? `Spice Level: ${orderData.dishSpiceLevel}` : ''}
${orderData.dishCalories ? `Calories: ${orderData.dishCalories} cal${orderData.dishQuantity && orderData.dishQuantity > 1 ? ` (${orderData.dishCalories * orderData.dishQuantity} cal total)` : ''}` : ''}
${orderData.dishRating ? `Rating: ${orderData.dishRating}⭐` : ''}
${orderData.dishPrepTime ? `Prep Time: ${orderData.dishPrepTime}` : ''}

` : ''}*Delivery Address:*
${orderData.address}

*Special Preferences:*
${orderData.preferences || 'None'}

*Referral:*
Code: ${orderData.referralCode || 'No referral'}
Name: ${orderData.referralName || 'No referral'}

*Order ID:* #${orderData.orderId}

*Timestamp:* ${new Date().toLocaleString()}

Please process this ${isIndividualDish ? 'dish' : 'meal plan'} order.

Thank you!`;

  return message;
}

// Contact message formatting removed - now using email service
