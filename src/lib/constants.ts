// App Configuration
export const APP_CONFIG = {
  name: 'Mealzee',
  description: 'Better food for more people',
  tagline: 'Delicious meals delivered to your doorstep',
  version: '1.0.0',
  supportEmail: 'mealzeeindia@gmail.com',
  supportPhone: '+91 9204 666 105',
  whatsappNumber: '9204666105',
  domain: 'Mealzee.in',
  serviceLocation: 'Sector 4, Bokaro Steel City, Jharkhand',
  maxDeliveryRadius: 15, // km
} as const;

// Service Area Configuration - Jharkhand, Bokaro Steel City
export const SERVICE_AREA = {
  state: 'Jharkhand',
  city: 'Bokaro Steel City',
  district: 'Bokaro',
  pincode: '827004',
  coordinates: {
    lat: 23.671203, // Updated to Sector 4 center
    lng: 86.1573709
  },
  // Service radius in kilometers for each sector
  serviceRadius: 2.5, // 2.5km radius from each sector center
  // Sectors we deliver to with accurate coordinates
  serviceSectors: [
    { 
      name: 'Sector 3', 
      pincode: '827003', 
      coordinates: { lat: 23.669296, lng: 86.151115 },
      radius: 2.5 // km
    },
    { 
      name: 'Sector 4', 
      pincode: '827004', 
      coordinates: { lat: 23.671203, lng: 86.1573709 },
      radius: 2.5 // km
    },
    { 
      name: 'Sector 5', 
      pincode: '827005', 
      coordinates: { lat: 23.6655, lng: 86.1675 },
      radius: 2.5 // km
    }
  ],
  // All sectors for reference (including non-service areas)
  sectors: [
    { name: 'Sector 1', pincode: '827001', coordinates: { lat: 23.6693, lng: 86.1511 } },
    { name: 'Sector 2', pincode: '827002', coordinates: { lat: 23.6703, lng: 86.1521 } },
    { name: 'Sector 3', pincode: '827003', coordinates: { lat: 23.669296, lng: 86.151115 } },
    { name: 'Sector 4', pincode: '827004', coordinates: { lat: 23.671203, lng: 86.1573709 } },
    { name: 'Sector 5', pincode: '827005', coordinates: { lat: 23.6655, lng: 86.1675 } },
    { name: 'Sector 6', pincode: '827006', coordinates: { lat: 23.6743, lng: 86.1561 } },
    { name: 'Sector 7', pincode: '827007', coordinates: { lat: 23.6753, lng: 86.1571 } },
    { name: 'Sector 8', pincode: '827008', coordinates: { lat: 23.6763, lng: 86.1581 } },
    { name: 'Sector 9', pincode: '827009', coordinates: { lat: 23.6773, lng: 86.1591 } },
    { name: 'Sector 10', pincode: '827010', coordinates: { lat: 23.6783, lng: 86.1601 } },
    { name: 'Sector 11', pincode: '827011', coordinates: { lat: 23.6793, lng: 86.1611 } },
    { name: 'Sector 12', pincode: '827012', coordinates: { lat: 23.6803, lng: 86.1621 } }
  ],
  landmarks: [
    { name: 'Bokaro Steel Plant', coordinates: { lat: 23.6693, lng: 86.1511 } },
    { name: 'Bokaro Mall', coordinates: { lat: 23.6703, lng: 86.1521 } },
    { name: 'City Centre', coordinates: { lat: 23.6713, lng: 86.1531 } },
    { name: 'Bokaro Railway Station', coordinates: { lat: 23.6723, lng: 86.1541 } },
    { name: 'Jawaharlal Nehru Biological Park', coordinates: { lat: 23.6733, lng: 86.1551 } }
  ]
} as const;

// Social Media Links
export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/share/1ChfCcF4PW/',
  instagram: 'https://www.instagram.com/mealzeeindia/',
  twitter: 'https://x.com/Mealzeeindia?t=zITsF0h84cXd6ph8GDw2Bg&s=08',
  whatsapp: `https://wa.me/${APP_CONFIG.whatsappNumber}`,
} as const;

// WhatsApp Configuration
export const WHATSAPP_CONFIG = {
  phoneNumber: '919204666105', // Mealzee WhatsApp admin number
  adminPhoneNumber: '919204666105', // Admin number for order notifications
  baseUrl: 'https://wa.me/919204666105',
  businessApiUrl: 'https://api.whatsapp.com/send', // For WhatsApp Business accounts
  isBusinessAccount: false, // Set to false for normal WhatsApp account
  messages: {
    orderNow: 'Hi Mealzee! 🍽️ I would like to place an order. Please share your menu and pricing details.',
    generalInquiry: 'Hi Mealzee! I have some questions about your food delivery service.',
    cartOrder: (items: string, total: string) =>
      `Hi Mealzee! 🍽️ I would like to order:\n\n${items}\n\nTotal: ${total}\n\nPlease confirm my order and delivery details.`,
    locationOrder: (location: string) =>
      `Hi Mealzee! 🍽️ I would like to place an order for delivery to: ${location}. Please share your menu and confirm if you deliver to this area.`,
    menuInquiry: 'Hi Mealzee! 🍽️ Can you please share your complete menu with prices? I am interested in placing an order.',
    specialOffer: (offerName: string) =>
      `Hi Mealzee! 🍽️ I saw your "${offerName}" offer. Can you please provide more details and help me place an order?`,
  }
} as const;

// Enhanced Color Palette
export const COLORS = {
  primary: {
    olive: '#8B9A46',
    oliveLight: '#B1BF5B',
    oliveDark: '#6B7A36',
  },
  neutral: {
    white: '#F8F9FA',
    lightGray: '#E9ECEF',
    gray: '#6C757D',
    darkGray: '#2D3436',
    black: '#212529',
  },
  accent: {
    green: '#06D6A0',
    yellow: '#FFD60A',
    purple: '#7209B7',
  }
} as const;

// Meal Categories for Mealzee
export const MEAL_CATEGORIES = [
  {
    id: 'breakfast',
    name: 'Breakfast',
    emoji: '🍳',
    description: 'Start your day right with fresh morning delights',
    color: 'from-olive-400 via-olive-500 to-olive-600',
    bgColor: 'bg-gradient-to-br from-olive-50 to-olive-100',
  },
  {
    id: 'lunch',
    name: 'Lunch',
    emoji: '🍱',
    description: 'Wholesome midday meals that satisfy',
    color: 'from-emerald-400 via-teal-400 to-cyan-400',
    bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-100',
  },
  {
    id: 'dinner',
    name: 'Dinner',
    emoji: '🍽️',
    description: 'Perfect evening meals for every craving',
    color: 'from-violet-400 via-purple-400 to-fuchsia-400',
    bgColor: 'bg-gradient-to-br from-violet-50 to-purple-100',
  },

] as const;

// Navigation Links
export const NAV_LINKS = [
  { id: 'home', name: 'Home', href: '/' },
  { id: 'menu', name: 'Menu', href: '/menu' },
  { id: 'about', name: 'About', href: '/about' },
  { id: 'contact', name: 'Contact', href: '/contact' },
] as const;

// Special Offers
export const SPECIAL_OFFERS = [
  {
    id: 'veg-meals',
    title: 'Pure Veg Delights',
    description: 'Farm-fresh vegetarian meals that burst with authentic Indian flavors',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop&crop=center',
    color: 'from-emerald-400 to-green-500',
    discount: '25% OFF',
  },
  {
    id: 'birthday-special',
    title: 'Birthday Celebrations',
    description: 'Make every birthday unforgettable with our special celebration meals',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&h=400&fit=crop&crop=center',
    color: 'from-pink-400 to-rose-500',
    discount: 'Free Dessert',
  },
  {
    id: 'gift-vouchers',
    title: 'Gift of Good Food',
    description: 'Share the joy of delicious home-cooked meals with your loved ones',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&h=400&fit=crop&crop=center',
    color: 'from-purple-400 to-indigo-500',
    discount: 'Up to ₹500',
  },
  {
    id: 'family-feast',
    title: 'Family Feast Special',
    description: 'Complete family meals with traditional recipes and generous portions',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&crop=center',
    color: 'from-olive-400 to-olive-500',
    discount: '30% OFF',
  },
  {
    id: 'healthy-bowls',
    title: 'Healthy Bowl Collection',
    description: 'Nutritious and balanced meals perfect for your wellness journey',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop&crop=center',
    color: 'from-teal-400 to-cyan-500',
    discount: '20% OFF',
  },
  {
    id: 'comfort-classics',
    title: 'Comfort Food Classics',
    description: 'Soul-warming traditional dishes that remind you of home',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop&crop=center',
    color: 'from-olive-400 to-olive-500',
    discount: '15% OFF',
  },
] as const;



// Delivery Time Options
export const DELIVERY_TIME_OPTIONS = [
  { value: 30, label: 'Under 30 min' },
  { value: 45, label: 'Under 45 min' },
  { value: 60, label: 'Under 1 hour' },
  { value: 90, label: 'Under 1.5 hours' },
] as const;

// Rating Options
export const RATING_OPTIONS = [
  { value: 4.5, label: '4.5+ stars' },
  { value: 4.0, label: '4.0+ stars' },
  { value: 3.5, label: '3.5+ stars' },
  { value: 3.0, label: '3.0+ stars' },
] as const;

// Tiffin Service Features
export const TIFFIN_FEATURES = [
  'Home Cooked',
  'Fresh Daily',
  'Healthy & Nutritious',
  'Vegetarian',
  'Vegan Options',
  'Gluten-Free Available',
  'No Preservatives',
  'Organic Ingredients',
  'Custom Portions',
  'Diet Friendly',
  'Traditional Recipes',
  'Hygienic Preparation',
] as const;

// Subscription Plans
export const SUBSCRIPTION_PLANS = [
  {
    id: 'daily',
    name: 'Daily',
    description: 'Order day by day',
    minDays: 1,
    maxDays: 1,
    discount: 0,
  },
  {
    id: 'weekly',
    name: 'Weekly',
    description: '7 days subscription',
    minDays: 7,
    maxDays: 7,
    discount: 5, // 5% discount
  },
  {
    id: 'monthly',
    name: 'Monthly',
    description: '30 days subscription',
    minDays: 30,
    maxDays: 30,
    discount: 15, // 15% discount
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Choose your own duration',
    minDays: 3,
    maxDays: 90,
    discount: 10, // 10% discount for 3+ days
  },
] as const;

// Delivery Time Slots
export const DELIVERY_SLOTS = [
  { id: 'breakfast', name: 'Breakfast', time: '8:00 AM - 10:00 AM', mealType: 'Breakfast' },
  { id: 'lunch', name: 'Lunch', time: '12:00 PM - 2:00 PM', mealType: 'Lunch' },
  { id: 'evening', name: 'Evening Snacks', time: '4:00 PM - 6:00 PM', mealType: 'Snacks' },
  { id: 'dinner', name: 'Dinner', time: '7:00 PM - 9:00 PM', mealType: 'Dinner' },
] as const;



// Order Status
export const ORDER_STATUS_LABELS = {
  pending: 'Order Pending',
  confirmed: 'Order Confirmed',
  preparing: 'Preparing Your Food',
  ready: 'Ready for Pickup',
  picked_up: 'Out for Delivery',
  on_the_way: 'On the Way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
} as const;

export const ORDER_STATUS_COLORS = {
  pending: 'text-yellow-600 bg-yellow-100',
  confirmed: 'text-blue-600 bg-blue-100',
  preparing: 'text-olive-600 bg-olive-100',
  ready: 'text-purple-600 bg-purple-100',
  picked_up: 'text-indigo-600 bg-indigo-100',
  on_the_way: 'text-green-600 bg-green-100',
  delivered: 'text-green-700 bg-green-200',
  cancelled: 'text-red-600 bg-red-100',
} as const;

// Payment Methods
export const PAYMENT_METHODS = [
  { id: 'credit_card', name: 'Credit Card', icon: '💳' },
  { id: 'debit_card', name: 'Debit Card', icon: '💳' },
  { id: 'paypal', name: 'PayPal', icon: '🅿️' },
  { id: 'apple_pay', name: 'Apple Pay', icon: '🍎' },
  { id: 'google_pay', name: 'Google Pay', icon: '🅖' },
  { id: 'cash', name: 'Cash on Delivery', icon: '💵' },
] as const;

// Address Types
export const ADDRESS_TYPES = [
  { value: 'home', label: 'Home', icon: '🏠' },
  { value: 'work', label: 'Work', icon: '🏢' },
  { value: 'other', label: 'Other', icon: '📍' },
] as const;

// Animation Variants
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  bounce: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    exit: { opacity: 0, scale: 0.3 },
  },
} as const;

// Breakpoints
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Z-Index Layers
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 10000,
  modal: 10010,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
  navbar: 9999,
} as const;

// API Endpoints (for future backend integration)
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    profile: '/api/auth/profile',
  },
  orders: {
    create: '/api/orders',
    list: '/api/orders',
    detail: '/api/orders/:id',
    track: '/api/orders/:id/track',
  },
  cart: {
    get: '/api/cart',
    add: '/api/cart/add',
    update: '/api/cart/update',
    remove: '/api/cart/remove',
    clear: '/api/cart/clear',
  },
  user: {
    addresses: '/api/user/addresses',
    paymentMethods: '/api/user/payment-methods',
    preferences: '/api/user/preferences',
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection.',
  server: 'Server error. Please try again later.',
  validation: 'Please check your input and try again.',
  auth: 'Authentication failed. Please login again.',
  notFound: 'The requested resource was not found.',
  permission: 'You do not have permission to perform this action.',
  generic: 'Something went wrong. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  orderPlaced: 'Your order has been placed successfully!',
  profileUpdated: 'Your profile has been updated.',
  addressAdded: 'Address has been added successfully.',
  paymentAdded: 'Payment method has been added.',
  reviewSubmitted: 'Thank you for your review!',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  cart: 'mealzee_cart',
  user: 'mealzee_user',
  preferences: 'mealzee_preferences',
  recentSearches: 'mealzee_recent_searches',
} as const;
