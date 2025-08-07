import { WHATSAPP_CONFIG } from '@/lib/constants';
import { sendOrderToWhatsApp, OrderData } from '@/lib/whatsapp';

export interface WhatsAppOptions {
  message?: string;
  phoneNumber?: string;
}

/**
 * Opens WhatsApp with a pre-filled message
 */
export const openWhatsApp = ({ message, phoneNumber }: WhatsAppOptions = {}) => {
  const phone = phoneNumber || WHATSAPP_CONFIG.phoneNumber;
  const encodedMessage = encodeURIComponent(message || WHATSAPP_CONFIG.messages.generalInquiry);
  const url = `https://wa.me/${phone}?text=${encodedMessage}`;
  
  // Open in new tab/window
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Generate WhatsApp URL with message
 */
export const getWhatsAppUrl = ({ message, phoneNumber }: WhatsAppOptions = {}) => {
  const phone = phoneNumber || WHATSAPP_CONFIG.phoneNumber;
  const encodedMessage = encodeURIComponent(message || WHATSAPP_CONFIG.messages.generalInquiry);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
};

/**
 * Open WhatsApp for placing an order
 */
export const openWhatsAppForOrder = () => {
  openWhatsApp({
    message: WHATSAPP_CONFIG.messages.orderNow
  });
};

/**
 * Open WhatsApp for menu inquiry
 */
export const openWhatsAppForMenu = () => {
  openWhatsApp({
    message: WHATSAPP_CONFIG.messages.menuInquiry
  });
};

/**
 * Open WhatsApp for cart order with items
 */
export const openWhatsAppForCartOrder = (items: Array<{name: string, quantity: number, price: number}>, total: number) => {
  const itemsList = items.map(item => 
    `• ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`
  ).join('\n');
  
  const message = WHATSAPP_CONFIG.messages.cartOrder(itemsList, `₹${total}`);
  
  openWhatsApp({ message });
};

/**
 * Open WhatsApp for location-based order
 */
export const openWhatsAppForLocationOrder = (location: string) => {
  const message = WHATSAPP_CONFIG.messages.locationOrder(location);
  openWhatsApp({ message });
};

/**
 * Open WhatsApp for special offer inquiry
 */
export const openWhatsAppForSpecialOffer = (offerName: string) => {
  const message = WHATSAPP_CONFIG.messages.specialOffer(offerName);
  openWhatsApp({ message });
};

/**
 * Send menu item order to admin WhatsApp with standardized template
 */
export const sendMenuItemOrderToWhatsApp = (orderData: {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  itemName: string;
  itemPrice: string;
  quantity: number;
  totalPrice: string;
  specialInstructions?: string;
}) => {
  const orderId = Date.now().toString().slice(-6);

  const whatsappOrderData: OrderData = {
    customerName: orderData.customerName,
    phone: orderData.phone,
    email: orderData.email,
    address: orderData.address,
    planTitle: `${orderData.itemName} x${orderData.quantity}`,
    planDuration: 'Single Order',
    planPrice: orderData.totalPrice,
    startDate: new Date().toLocaleDateString(),
    preferences: orderData.specialInstructions,
    orderId: orderId,
    dietaryPreference: 'vegetarian', // default or dummy value
    dob: '' // default or dummy value
  };

  return sendOrderToWhatsApp(whatsappOrderData);
};

/**
 * Check if WhatsApp is available (mobile detection)
 */
export const isWhatsAppAvailable = (): boolean => {
  // Check if running on mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return isMobile;
};

/**
 * Get appropriate WhatsApp URL based on device
 */
export const getDeviceSpecificWhatsAppUrl = ({ message, phoneNumber }: WhatsAppOptions = {}) => {
  const phone = phoneNumber || WHATSAPP_CONFIG.phoneNumber;
  const encodedMessage = encodeURIComponent(message || WHATSAPP_CONFIG.messages.generalInquiry);
  
  // Use WhatsApp app URL for mobile, web URL for desktop
  if (isWhatsAppAvailable()) {
    return `whatsapp://send?phone=${phone}&text=${encodedMessage}`;
  } else {
    return `https://wa.me/${phone}?text=${encodedMessage}`;
  }
};
