'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Types
export interface User {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  address: string;
  sector?: string;
  city?: string;
  dietaryPreference: 'vegetarian' | 'non-vegetarian';
  dateOfBirth: string; // Format: YYYY-MM-DD
  isAuthenticated: boolean;
  referralCode?: string;
  referralName?: string;
  referralCount?: number;
}

export interface MealPlan {
  id: string;
  title: string;
  duration: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  description: string;
  features: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  time: string;
  spiceLevel: 'mild' | 'medium' | 'spicy';
  isVeg: boolean;
  calories?: number;
}

export interface AppState {
  user: User | null;
  selectedMealPlan: MealPlan | null;
  selectedDish: MenuItem | null;
  isAuthModalOpen: boolean;
  isOrderModalOpen: boolean;
  isMealPlanSelectionOpen: boolean;
  orderFlow: 'idle' | 'auth' | 'meal-selection' | 'order-confirmation';
  orderType: 'meal-plan' | 'individual-dish';
}

// Actions
type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT_USER' }
  | { type: 'SET_SELECTED_MEAL_PLAN'; payload: MealPlan }
  | { type: 'CLEAR_SELECTED_MEAL_PLAN' }
  | { type: 'SET_SELECTED_DISH'; payload: MenuItem }
  | { type: 'CLEAR_SELECTED_DISH' }
  | { type: 'OPEN_AUTH_MODAL' }
  | { type: 'CLOSE_AUTH_MODAL' }
  | { type: 'OPEN_ORDER_MODAL' }
  | { type: 'CLOSE_ORDER_MODAL' }
  | { type: 'OPEN_MEAL_PLAN_SELECTION' }
  | { type: 'CLOSE_MEAL_PLAN_SELECTION' }
  | { type: 'SET_ORDER_FLOW'; payload: AppState['orderFlow'] }
  | { type: 'SET_ORDER_TYPE'; payload: AppState['orderType'] }
  | { type: 'RESET_ORDER_FLOW' };

// Initial state
const initialState: AppState = {
  user: null,
  selectedMealPlan: null,
  selectedDish: null,
  isAuthModalOpen: false,
  isOrderModalOpen: false,
  isMealPlanSelectionOpen: false,
  orderFlow: 'idle',
  orderType: 'meal-plan',
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    
    case 'LOGOUT_USER':
      return {
        ...state,
        user: null,
        selectedMealPlan: null,
        selectedDish: null,
        isAuthModalOpen: false,
        isOrderModalOpen: false,
        isMealPlanSelectionOpen: false,
        orderFlow: 'idle',
        orderType: 'meal-plan',
      };
    
    case 'SET_SELECTED_MEAL_PLAN':
      return {
        ...state,
        selectedMealPlan: action.payload,
      };
    
    case 'CLEAR_SELECTED_MEAL_PLAN':
      return {
        ...state,
        selectedMealPlan: null,
      };
    
    case 'SET_SELECTED_DISH':
      return {
        ...state,
        selectedDish: action.payload,
        orderType: 'individual-dish',
      };
    
    case 'CLEAR_SELECTED_DISH':
      return {
        ...state,
        selectedDish: null,
      };
    
    case 'OPEN_AUTH_MODAL':
      return {
        ...state,
        isAuthModalOpen: true,
        isOrderModalOpen: false,
        isMealPlanSelectionOpen: false,
      };
    
    case 'CLOSE_AUTH_MODAL':
      return {
        ...state,
        isAuthModalOpen: false,
      };
    
    case 'OPEN_ORDER_MODAL':
      return {
        ...state,
        isOrderModalOpen: true,
        isAuthModalOpen: false,
        isMealPlanSelectionOpen: false,
      };
    
    case 'CLOSE_ORDER_MODAL':
      return {
        ...state,
        isOrderModalOpen: false,
      };
    
    case 'OPEN_MEAL_PLAN_SELECTION':
      return {
        ...state,
        isMealPlanSelectionOpen: true,
        isAuthModalOpen: false,
        isOrderModalOpen: false,
      };
    
    case 'CLOSE_MEAL_PLAN_SELECTION':
      return {
        ...state,
        isMealPlanSelectionOpen: false,
      };
    
    case 'SET_ORDER_FLOW':
      return {
        ...state,
        orderFlow: action.payload,
      };
    
    case 'SET_ORDER_TYPE':
      return {
        ...state,
        orderType: action.payload,
      };
    
    case 'RESET_ORDER_FLOW':
      return {
        ...state,
        orderFlow: 'idle',
        isAuthModalOpen: false,
        isOrderModalOpen: false,
        isMealPlanSelectionOpen: false,
      };
    
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  login: (userData: Omit<User, 'id' | 'isAuthenticated'>) => Promise<void>;
  logout: () => void;
  selectMealPlan: (plan: MealPlan) => void;
  clearSelectedMealPlan: () => void;
  selectDish: (dish: MenuItem) => void;
  clearSelectedDish: () => void;
  startOrderFlow: (preSelectedPlan?: MealPlan) => void;
  startDishOrderFlow: (dish: MenuItem) => void;
  isLoggedIn: () => boolean;
} | null>(null);

// Provider component
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const router = useRouter();

  // Load user data and selected meal plan from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('mealzee_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        dispatch({ type: 'SET_USER', payload: userData });
      } catch (error) {
        console.error('Error loading user data:', error);
        localStorage.removeItem('mealzee_user');
      }
    }

    const savedMealPlan = localStorage.getItem('mealzee_selected_plan');
    if (savedMealPlan) {
      try {
        const mealPlanData = JSON.parse(savedMealPlan);
        dispatch({ type: 'SET_SELECTED_MEAL_PLAN', payload: mealPlanData });
      } catch (error) {
        console.error('Error loading meal plan data:', error);
        localStorage.removeItem('mealzee_selected_plan');
      }
    }
  }, []);

  // Save user data to localStorage when user changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('mealzee_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('mealzee_user');
    }
  }, [state.user]);

  // Save selected meal plan to localStorage when it changes
  useEffect(() => {
    if (state.selectedMealPlan) {
      localStorage.setItem('mealzee_selected_plan', JSON.stringify(state.selectedMealPlan));
    } else {
      localStorage.removeItem('mealzee_selected_plan');
    }
  }, [state.selectedMealPlan]);

  // Helper functions
  const login = async (userData: Omit<User, 'id' | 'isAuthenticated'>) => {
    // Create a local temporary user so UI can proceed immediately
    const tempUser: User = {
      ...userData,
      id: Date.now().toString(), // temporary local id
      isAuthenticated: true,
    };
    dispatch({ type: 'SET_USER', payload: tempUser });

    // Attempt to reconcile with backend user record so we store the real DB id
    try {
      // Try to fetch existing user by phone
      const phone = encodeURIComponent(userData.phone);
      const res = await fetch(`/api/user/profile?phone=${phone}`);
      let serverUser: any = null;

      if (res.ok) {
        const data = await res.json();
        serverUser = data.user || null;
      }

      if (!serverUser) {
        // Create a user on the backend if not present. Send any available profile fields.
        const createRes = await fetch('/api/user/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: userData.phone,
            profile: {
              name: userData.fullName || null,
              dob: userData.dateOfBirth || null,
              referredByCode: userData.referralCode || undefined,
              referralName: userData.referralName || undefined,
              address: userData.address || undefined,
              sector: userData.sector || undefined,
              dietaryPreference: userData.dietaryPreference || undefined,
            }
          })
        });

        if (createRes.ok) {
          const created = await createRes.json();
          serverUser = created.user || null;
        }
      }

      if (serverUser) {
        // Map server shape to our User type, while preserving local details when missing on server
        const serverAddress = Array.isArray(serverUser.addresses) && serverUser.addresses.length > 0
          ? serverUser.addresses[0]
          : (serverUser.address || '');

        const mergedUser: User = {
          id: serverUser.id,
          fullName: userData.fullName || serverUser.name || '',
          email: serverUser.email || userData.email,
          phone: serverUser.phone || userData.phone,
          address: userData.address || serverAddress || '',
          sector: userData.sector || serverUser.sector || undefined,
          city: serverUser.city || userData.city,
          dietaryPreference: userData.dietaryPreference || 'vegetarian',
          dateOfBirth: userData.dateOfBirth || (serverUser.dob ? String(serverUser.dob).split('T')[0] : ''),
          isAuthenticated: true,
          referralCode: serverUser.referralCode || userData.referralCode,
          referralName: serverUser.referralName || userData.referralName || undefined,
          referralCount: serverUser.referralCount ?? userData.referralCount ?? 0,
        };

        dispatch({ type: 'SET_USER', payload: mergedUser });
      }
    } catch (err) {
      console.warn('Failed to reconcile user with backend, continuing with local user:', err);
      // Keep the temporary local user so UI isn't blocked
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT_USER' });
    try {
      // Navigate back to home page after logout
      router.push('/');
    } catch (e) {
      // fallback: no-op
    }
  };

  const selectMealPlan = (plan: MealPlan) => {
    dispatch({ type: 'SET_SELECTED_MEAL_PLAN', payload: plan });
  };

  const clearSelectedMealPlan = () => {
    dispatch({ type: 'CLEAR_SELECTED_MEAL_PLAN' });
  };

  const selectDish = (dish: MenuItem) => {
    dispatch({ type: 'SET_SELECTED_DISH', payload: dish });
  };

  const clearSelectedDish = () => {
    dispatch({ type: 'CLEAR_SELECTED_DISH' });
  };

  const isLoggedIn = () => {
    return state.user?.isAuthenticated || false;
  };

  const startOrderFlow = (preSelectedPlan?: MealPlan) => {
    // Set order type to meal plan
    dispatch({ type: 'SET_ORDER_TYPE', payload: 'meal-plan' });
    
    // If a meal plan is pre-selected, set it
    if (preSelectedPlan) {
      dispatch({ type: 'SET_SELECTED_MEAL_PLAN', payload: preSelectedPlan });
    }

    // Determine the flow based on user state and meal plan selection
    if (!isLoggedIn()) {
      // Scenario C: User not logged in
      dispatch({ type: 'SET_ORDER_FLOW', payload: 'auth' });
      dispatch({ type: 'OPEN_AUTH_MODAL' });
    } else if (state.selectedMealPlan || preSelectedPlan) {
      // Scenario A: User logged in and meal plan selected
      dispatch({ type: 'SET_ORDER_FLOW', payload: 'order-confirmation' });
      dispatch({ type: 'OPEN_ORDER_MODAL' });
    } else {
      // Scenario B: User logged in but no meal plan selected
      dispatch({ type: 'SET_ORDER_FLOW', payload: 'meal-selection' });
      dispatch({ type: 'OPEN_MEAL_PLAN_SELECTION' });
    }
  };

  const startDishOrderFlow = (dish: MenuItem) => {
    // Set order type to individual dish and select the dish
    dispatch({ type: 'SET_ORDER_TYPE', payload: 'individual-dish' });
    dispatch({ type: 'SET_SELECTED_DISH', payload: dish });

    // Determine the flow based on user state
    if (!isLoggedIn()) {
      // User not logged in - show auth modal first
      dispatch({ type: 'SET_ORDER_FLOW', payload: 'auth' });
      dispatch({ type: 'OPEN_AUTH_MODAL' });
    } else {
      // User logged in - go directly to order confirmation
      dispatch({ type: 'SET_ORDER_FLOW', payload: 'order-confirmation' });
      dispatch({ type: 'OPEN_ORDER_MODAL' });
    }
  };

  const value = {
    state,
    dispatch,
    login,
    logout,
    selectMealPlan,
    clearSelectedMealPlan,
    selectDish,
    clearSelectedDish,
    startOrderFlow,
    startDishOrderFlow,
    isLoggedIn,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Export types for use in other components
export type { AppAction };
