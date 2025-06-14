import { WHATSAPP_CONFIG } from '@/lib/constants';

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
