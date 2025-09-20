// User Types
export interface User {
  id: string;
  phone?: string;
  name?: string | null;
  email?: string | null;
  avatar?: string;
  addresses?: Address[];
  referralCode?: string;
  referredByCode?: string | null;
  referralName?: string | null;
  dietaryPreference?: string | null;
  sector?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Address {
  id: string;
  userId: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

// Tiffin Service Types
export interface TiffinService {
  id: string;
  name: string;
  description: string;
  ownerName: string;
  image: string;
  coverImage?: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  deliverySlots: DeliverySlot[];
  deliveryFee: number;
  minimumOrder: number;
  isOpen: boolean;
  address: string;
  serviceArea: string;
  coordinates?: { lat: number; lng: number };
  maxDeliveryRadius?: number;

  dailyMenus: DailyMenu[];
  features: string[];
  subscriptionPlans: SubscriptionPlan[];
}

export interface DeliverySlot {
  id: string;
  name: string;
  time: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  isAvailable: boolean;
}

export interface DailyMenu {
  id: string;
  date: string; // YYYY-MM-DD format
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks' | 'Full Day Meal';
  items: MenuItem[];
  specialNote?: string;
  isAvailable: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  duration: number; // in days
  mealTypes: string[];
  pricePerDay: number;
  totalPrice: number;
  discount: number; // percentage
  features: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  category: string; // e.g., 'Main Course', 'Side Dish', 'Dessert', 'Beverage'
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
  spiceLevel?: 'Mild' | 'Medium' | 'Hot' | 'Extra Hot';
  allergens?: string[];
  nutritionInfo?: NutritionInfo;
  ingredients?: string[];
  portionSize?: 'Small' | 'Medium' | 'Large';
  isAvailable: boolean;
  preparationTime?: number;
  isSignatureDish?: boolean;
  dietaryTags?: string[]; // e.g., 'Low Carb', 'High Protein', 'Diabetic Friendly'
  rating?: number;
  reviews?: number;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sodium?: number;
}

export interface Customization {
  id: string;
  name: string;
  type: 'radio' | 'checkbox' | 'select';
  required: boolean;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

// Cart Types
export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  customizations: SelectedCustomization[];
  specialInstructions?: string;
  totalPrice: number;
}

export interface SelectedCustomization {
  customizationId: string;
  optionId: string;
  name: string;
  price: number;
}

export interface Cart {
  id: string;
  userId?: string;
  tiffinServiceId: string;
  tiffinService: TiffinService;
  items: CartItem[];
  subscriptionPlan?: SubscriptionPlan;
  deliverySlot?: DeliverySlot;
  startDate?: string; // For subscriptions
  endDate?: string; // For subscriptions
  subtotal: number;
  deliveryFee: number;
  tax: number;
  subscriptionDiscount?: number;
  total: number;
  promoCode?: string;
  discount?: number;
}

// Subscription Types
export interface Subscription {
  id: string;
  userId: string;
  tiffinServiceId: string;
  plan: SubscriptionPlan;
  startDate: string;
  endDate: string;
  deliverySlot: DeliverySlot;
  deliveryAddress: Address;
  status: SubscriptionStatus;
  mealPreferences?: MealPreferences;
  specialInstructions?: string;
  totalAmount: number;
  paidAmount: number;
  remainingDays: number;
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionStatus =
  | 'active'
  | 'paused'
  | 'cancelled'
  | 'completed'
  | 'pending_payment';

export interface MealPreferences {
  spiceLevel?: 'Mild' | 'Medium' | 'Hot' | 'Extra Hot';
  dietaryRestrictions?: string[];
  allergies?: string[];
  preferredCuisines?: string[];
  avoidIngredients?: string[];
  portionSize?: 'Small' | 'Medium' | 'Large';
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  tiffinServiceId: string;
  tiffinService: TiffinService;
  items: CartItem[];
  orderType: 'one_time' | 'subscription';
  subscriptionId?: string; // If part of a subscription
  deliveryDate: string; // YYYY-MM-DD
  deliverySlot: DeliverySlot;
  status: OrderStatus;
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  promoCode?: string;
  discount?: number;
  subscriptionDiscount?: number;
  estimatedDeliveryTime: Date;
  actualDeliveryTime?: Date;
  specialInstructions?: string;
  mealPreferences?: MealPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled';

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay' | 'google_pay' | 'cash';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  user: Pick<User, 'name' | 'avatar'>;
  restaurantId: string;
  orderId: string;
  rating: number;
  comment?: string;
  images?: string[];
  createdAt: Date;
}

// Search and Filter Types
export interface SearchFilters {
  cuisine?: string[];
  priceRange?: string[];
  rating?: number;
  deliveryTime?: number;
  features?: string[];
  sortBy?: 'rating' | 'delivery_time' | 'price' | 'distance';
}

export interface SearchResult {
  totalCount: number;
  hasMore: boolean;
}



// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export interface AddressForm {
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
