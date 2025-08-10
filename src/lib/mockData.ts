import { TiffinService, MenuItem, DailyMenu, SubscriptionPlan, DeliverySlot } from '@/types';

// Enhanced Menu Data for Mealzee
export const MENU_CATEGORIES = [
  {
    id: 'starters',
    name: 'Appetizers & Starters',
    description: 'Kickstart your meal with these irresistible bites',
    emoji: '🥗',
  },
  {
    id: 'mains',
    name: 'Main Courses',
    description: 'Hearty and satisfying dishes that hit the spot',
    emoji: '🍛',
  },
  {
    id: 'desserts',
    name: 'Sweet Endings',
    description: 'Indulgent desserts to complete your meal',
    emoji: '🍰',
  },
  {
    id: 'beverages',
    name: 'Refreshing Drinks',
    description: 'Quench your thirst with our signature beverages',
    emoji: '🥤',
  },
] as const;

// Comprehensive Menu Items for Mealzee
export const APPETIZERS: MenuItem[] = [
  {
    id: 'app1',
    name: 'Crispy Chicken Wings',
    description: 'Juicy wings tossed in our signature spicy glaze, served with cooling ranch dip',
    price: 299,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400',
    mealType: 'Lunch',
    category: 'Appetizers',
    isVegetarian: false,
    spiceLevel: 'Hot',
    ingredients: ['Chicken wings', 'Special sauce', 'Ranch dip'],
    isAvailable: true,
    preparationTime: 15,
    isSignatureDish: true,
    dietaryTags: ['High Protein', 'Spicy'],
    rating: 4.8,
    reviews: 156,
  },
  {
    id: 'app2',
    name: 'Loaded Nachos Supreme',
    description: 'Crispy tortilla chips loaded with cheese, jalapeños, and fresh guacamole',
    price: 249,
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400',
    mealType: 'Lunch',
    category: 'Appetizers',
    isVegetarian: true,
    spiceLevel: 'Medium',
    ingredients: ['Tortilla chips', 'Cheese', 'Jalapeños', 'Guacamole'],
    isAvailable: true,
    preparationTime: 10,
    dietaryTags: ['Vegetarian', 'Cheesy'],
    rating: 4.6,
    reviews: 89,
  },
  {
    id: 'app3',
    name: 'Paneer Tikka Skewers',
    description: 'Marinated cottage cheese cubes grilled to perfection with bell peppers',
    price: 279,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400',
    mealType: 'Lunch',
    category: 'Appetizers',
    isVegetarian: true,
    spiceLevel: 'Medium',
    ingredients: ['Paneer', 'Bell peppers', 'Yogurt marinade', 'Spices'],
    isAvailable: true,
    preparationTime: 20,
    isSignatureDish: true,
    dietaryTags: ['Vegetarian', 'High Protein', 'Grilled'],
    rating: 4.7,
    reviews: 134,
  },
];

export const MAIN_COURSES: MenuItem[] = [
  {
    id: 'main1',
    name: 'Butter Chicken Bonanza',
    description: 'Tender chicken pieces in rich, creamy tomato gravy served with basmati rice and naan',
    price: 449,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
    mealType: 'Lunch',
    category: 'Main Course',
    isVegetarian: false,
    spiceLevel: 'Medium',
    ingredients: ['Chicken', 'Tomato gravy', 'Cream', 'Basmati rice', 'Naan'],
    isAvailable: true,
    preparationTime: 25,
    isSignatureDish: true,
    dietaryTags: ['High Protein', 'Creamy', 'Popular'],
    rating: 4.9,
    reviews: 267,
  },
  {
    id: 'main2',
    name: 'Margherita Pizza Perfection',
    description: 'Hand-tossed pizza with fresh mozzarella, basil, and our signature tomato sauce',
    price: 399,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
    mealType: 'Lunch',
    category: 'Main Course',
    isVegetarian: true,
    spiceLevel: 'Mild',
    ingredients: ['Pizza dough', 'Mozzarella', 'Fresh basil', 'Tomato sauce'],
    isAvailable: true,
    preparationTime: 20,
    dietaryTags: ['Vegetarian', 'Cheesy', 'Italian'],
    rating: 4.7,
    reviews: 198,
  },
  {
    id: 'main3',
    name: 'Biryani Bliss Bowl',
    description: 'Aromatic basmati rice layered with spiced chicken and served with raita and pickle',
    price: 379,
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400',
    mealType: 'Lunch',
    category: 'Main Course',
    isVegetarian: false,
    spiceLevel: 'Hot',
    ingredients: ['Basmati rice', 'Chicken', 'Saffron', 'Yogurt', 'Spices'],
    isAvailable: true,
    preparationTime: 35,
    isSignatureDish: true,
    dietaryTags: ['High Protein', 'Aromatic', 'Traditional'],
    rating: 4.8,
    reviews: 234,
  },
  {
    id: 'main4',
    name: 'Paneer Makhani Paradise',
    description: 'Soft paneer cubes in rich, buttery tomato gravy with garlic naan',
    price: 349,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
    mealType: 'Lunch',
    category: 'Main Course',
    isVegetarian: true,
    spiceLevel: 'Medium',
    ingredients: ['Paneer', 'Tomato gravy', 'Butter', 'Garlic naan'],
    isAvailable: true,
    preparationTime: 20,
    dietaryTags: ['Vegetarian', 'High Protein', 'Creamy'],
    rating: 4.6,
    reviews: 145,
  },
];

export const DESSERTS: MenuItem[] = [
  {
    id: 'dessert1',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
    price: 199,
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400',
    mealType: 'Dinner',
    category: 'Desserts',
    isVegetarian: true,
    spiceLevel: 'Mild',
    ingredients: ['Dark chocolate', 'Butter', 'Eggs', 'Vanilla ice cream'],
    isAvailable: true,
    preparationTime: 15,
    isSignatureDish: true,
    dietaryTags: ['Sweet', 'Indulgent'],
    rating: 4.9,
    reviews: 89,
  },
  {
    id: 'dessert2',
    name: 'Gulab Jamun Delight',
    description: 'Soft, spongy milk dumplings soaked in aromatic sugar syrup',
    price: 149,
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400',
    mealType: 'Dinner',
    category: 'Desserts',
    isVegetarian: true,
    spiceLevel: 'Mild',
    ingredients: ['Milk powder', 'Sugar syrup', 'Cardamom', 'Rose water'],
    isAvailable: true,
    preparationTime: 10,
    dietaryTags: ['Traditional', 'Sweet'],
    rating: 4.7,
    reviews: 67,
  },
];

export const BEVERAGES: MenuItem[] = [
  {
    id: 'bev1',
    name: 'Fresh Lime Soda',
    description: 'Refreshing lime juice with sparkling water and a hint of mint',
    price: 89,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    mealType: 'Lunch',
    category: 'Beverages',
    isVegetarian: true,
    spiceLevel: 'Mild',
    ingredients: ['Fresh lime', 'Sparkling water', 'Mint', 'Sugar'],
    isAvailable: true,
    preparationTime: 5,
    dietaryTags: ['Refreshing', 'Natural'],
    rating: 4.5,
    reviews: 45,
  },
  {
    id: 'bev2',
    name: 'Mango Lassi Supreme',
    description: 'Creamy yogurt drink blended with fresh mango pulp and cardamom',
    price: 129,
    image: 'https://images.unsplash.com/photo-1553787499-6d7ad0b8d8b5?w=400',
    mealType: 'Lunch',
    category: 'Beverages',
    isVegetarian: true,
    spiceLevel: 'Mild',
    ingredients: ['Fresh mango', 'Yogurt', 'Cardamom', 'Sugar'],
    isAvailable: true,
    preparationTime: 5,
    isSignatureDish: true,
    dietaryTags: ['Creamy', 'Fruity', 'Traditional'],
    rating: 4.8,
    reviews: 78,
  },
];

// Combined menu for easy access
export const ALL_MENU_ITEMS = [
  ...APPETIZERS,
  ...MAIN_COURSES,
  ...DESSERTS,
  ...BEVERAGES,
];

// Delivery Slots
export const deliverySlots: DeliverySlot[] = [
  {
    id: 'breakfast',
    name: 'Breakfast',
    time: '8:00 AM - 10:00 AM',
    mealType: 'Breakfast',
    isAvailable: true,
  },
  {
    id: 'lunch',
    name: 'Lunch',
    time: '12:00 PM - 2:00 PM',
    mealType: 'Lunch',
    isAvailable: true,
  },
  {
    id: 'dinner',
    name: 'Dinner',
    time: '7:00 PM - 9:00 PM',
    mealType: 'Dinner',
    isAvailable: true,
  },
];

// Subscription Plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'lunch-weekly',
    name: 'Weekly Lunch Plan',
    description: 'Fresh lunch delivered for 7 days',
    duration: 7,
    mealTypes: ['Lunch'],
    pricePerDay: 12.99,
    totalPrice: 81.43, // 7 * 12.99 * 0.9 (10% discount)
    discount: 10,
    features: ['Home cooked meals', 'Fresh daily', 'Customizable spice level'],
  },
  {
    id: 'full-monthly',
    name: 'Monthly Full Meal Plan',
    description: 'Breakfast, lunch, and dinner for 30 days',
    duration: 30,
    mealTypes: ['Breakfast', 'Lunch', 'Dinner'],
    pricePerDay: 35.99,
    totalPrice: 917.74, // 30 * 35.99 * 0.85 (15% discount)
    discount: 15,
    features: ['All meals included', 'Maximum savings', 'Priority delivery', 'Custom meal preferences'],
  },
];

// Daily Menus
export const dailyMenus: DailyMenu[] = [
  {
    id: 'today-breakfast',
    date: new Date().toISOString().split('T')[0],
    mealType: 'Breakfast',
    items: APPETIZERS.slice(0, 2), // Using appetizers as breakfast items
    specialNote: 'Fresh morning delights prepared with love',
    isAvailable: true,
  },
  {
    id: 'today-lunch',
    date: new Date().toISOString().split('T')[0],
    mealType: 'Lunch',
    items: MAIN_COURSES.slice(0, 3), // Using main courses for lunch
    specialNote: 'Today\'s special: Authentic flavors that satisfy',
    isAvailable: true,
  },
  {
    id: 'today-dinner',
    date: new Date().toISOString().split('T')[0],
    mealType: 'Dinner',
    items: [...MAIN_COURSES.slice(2), ...DESSERTS], // Mix of mains and desserts
    specialNote: 'Evening comfort food with authentic flavors',
    isAvailable: true,
  },
];

// Main Tiffin Service
export const tiffinService: TiffinService = {
  id: '1',
  name: "Mama's Kitchen",
  description: 'Authentic home-cooked meals prepared with love and traditional recipes',
  ownerName: 'Chef Priya Sharma',
  image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
  coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
  specialties: ['North Indian', 'South Indian', 'Gujarati', 'Bengali'],
  rating: 4.8,
  reviewCount: 156,
  deliverySlots: deliverySlots,
  deliveryFee: 2.99,
  minimumOrder: 8.99,
  isOpen: true,
  address: '123 Home Street, Green Valley, Downtown',
  serviceArea: 'Downtown, Green Valley, Riverside, and surrounding areas within 5km',
  coordinates: { lat: 40.7128, lng: -74.0060 },
  maxDeliveryRadius: 5,
  dailyMenus: dailyMenus,
  features: [
    'Home Cooked',
    'Fresh Daily',
    'Healthy & Nutritious',
    'Vegetarian',
    'No Preservatives',
    'Traditional Recipes',
    'Hygienic Preparation',
    'Custom Portions'
  ],
  subscriptionPlans: subscriptionPlans,
};

// Today's Featured Meals
export const todaysFeaturedMeals = [
  ...APPETIZERS.slice(0, 2),
  ...MAIN_COURSES.slice(0, 2),
  ...DESSERTS.slice(0, 2),
];

// Popular meal categories for tiffin service
export const popularMealCategories = [
  {
    name: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=300',
    description: 'Start your meal right',
    itemCount: APPETIZERS.length
  },
  {
    name: 'Main Courses',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300',
    description: 'Hearty and satisfying',
    itemCount: MAIN_COURSES.length
  },
  {
    name: 'Desserts',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300',
    description: 'Sweet endings',
    itemCount: DESSERTS.length
  },
  {
    name: 'Beverages',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300',
    description: 'Refreshing drinks',
    itemCount: BEVERAGES.length
  },
];

// Customer testimonials specific to tiffin service
export const tiffinTestimonials = [
  {
    id: 1,
    name: 'Aarohi Sharma',
    role: 'Working Professional',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Mealzee has been a lifesaver! The food tastes just like home-cooked meals. The lunch subscription has saved me so much time and money.',
    location: 'Sector 4/A',
  },
  {
    id: 2,
    name: 'Priya Patel',
    role: 'New Mom',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'As a new mother, having fresh, healthy meals delivered daily has been amazing. The food is always on time and tastes incredible!',
    location: 'Sector 4/B',
  },
  {
    id: 3,
    name: 'Isha Gupta',
    role: 'College Student',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'The weekly meal plan is perfect for my budget. Mealzee\'s food reminds me of my mom\'s cooking. Highly recommend to all students!',
    location: 'Sector 4/C',
  },
  {
    id: 4,
    name: 'Sunita Agarwal',
    role: 'Senior Citizen',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'At my age, cooking daily was becoming difficult. Mealzee provides nutritious meals that are perfect for my dietary needs.',
    location: 'Sector 4/D',
  },
  {
    id: 5,
    name: 'Meera Joshi',
    role: 'IT Professional',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Working from home made me realize the importance of good food. Mealzee delivers fresh, tasty meals right to my doorstep.',
    location: 'Sector 4/E',
  },
  {
    id: 6,
    name: 'Kavita Singh',
    role: 'Teacher',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'The variety in their menu is amazing! My family loves the different cuisines they offer. Highly satisfied with their service.',
    location: 'Sector 4/F',
  },
];


