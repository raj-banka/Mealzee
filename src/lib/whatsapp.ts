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
}

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  referenceId: string;
}

// Restaurant WhatsApp number
const RESTAURANT_PHONE = '919608036638';

/**
 * Opens WhatsApp with a pre-filled message (free method)
 */
export const openWhatsApp = ({ message, phoneNumber }: WhatsAppOptions = {}) => {
  const phone = phoneNumber || WHATSAPP_CONFIG.phoneNumber;
  const encodedMessage = encodeURIComponent(message || WHATSAPP_CONFIG.messages.generalInquiry);
  const url = `https://wa.me/${phone}?text=${encodedMessage}`;

  // Open in new tab/window
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Send order to restaurant WhatsApp using free web.whatsapp.com method
 */
export function sendOrderToWhatsApp(orderData: OrderData): boolean {
  try {
    const message = formatOrderMessage(orderData);
    openWhatsApp({
      message,
      phoneNumber: RESTAURANT_PHONE
    });

    return true;
  } catch (error) {
    console.error('Failed to send order to WhatsApp:', error);
    return false;
  }
}

/**
 * Send contact message to restaurant WhatsApp using free method
 */
export function sendContactToWhatsApp(contactData: ContactData): boolean {
  try {
    const message = formatContactMessage(contactData);
    openWhatsApp({
      message,
      phoneNumber: RESTAURANT_PHONE
    });

    return true;
  } catch (error) {
    console.error('Failed to send contact message to WhatsApp:', error);
    return false;
  }
}



/**
 * Format order data for WhatsApp message
 */
export function formatOrderMessage(orderData: OrderData): string {
  return `🍽️ *New Order from Mealzee Website*

👤 *Customer Details:*
Name: ${orderData.customerName}
Phone: ${orderData.phone}
Email: ${orderData.email}

🥘 *Order Details:*
Plan: ${orderData.planTitle}
Duration: ${orderData.planDuration}
Price: ₹${orderData.planPrice}
Start Date: ${orderData.startDate}

📍 *Delivery Address:*
${orderData.address}

📝 *Special Preferences:*
${orderData.preferences || 'None'}

🆔 *Order ID:* #${orderData.orderId}
⏰ *Timestamp:* ${new Date().toLocaleString()}

Please process this order and contact customer for confirmation.

Thank you! 🙏`;
}

/**
 * Format contact data for WhatsApp message
 */
export function formatContactMessage(contactData: ContactData): string {
  return `📞 *Contact Form Submission - Mealzee Website*

👤 *Contact Details:*
Name: ${contactData.name}
Email: ${contactData.email}
Phone: ${contactData.phone}
Subject: ${contactData.subject}

💬 *Message:*
${contactData.message}

🆔 *Reference ID:* #${contactData.referenceId}
⏰ *Timestamp:* ${new Date().toLocaleString()}

Please respond to this inquiry.

Thank you! 🙏`;
}
