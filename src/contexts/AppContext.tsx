'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Types
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dietaryPreference: 'vegetarian' | 'non-vegetarian';
  dateOfBirth: string; // Format: YYYY-MM-DD
  isAuthenticated: boolean;
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

export interface AppState {
  user: User | null;
  selectedMealPlan: MealPlan | null;
  isAuthModalOpen: boolean;
  isOrderModalOpen: boolean;
  isMealPlanSelectionOpen: boolean;
  orderFlow: 'idle' | 'auth' | 'meal-selection' | 'order-confirmation';
}

// Actions
type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT_USER' }
  | { type: 'SET_SELECTED_MEAL_PLAN'; payload: MealPlan }
  | { type: 'CLEAR_SELECTED_MEAL_PLAN' }
  | { type: 'OPEN_AUTH_MODAL' }
  | { type: 'CLOSE_AUTH_MODAL' }
  | { type: 'OPEN_ORDER_MODAL' }
  | { type: 'CLOSE_ORDER_MODAL' }
  | { type: 'OPEN_MEAL_PLAN_SELECTION' }
  | { type: 'CLOSE_MEAL_PLAN_SELECTION' }
  | { type: 'SET_ORDER_FLOW'; payload: AppState['orderFlow'] }
  | { type: 'RESET_ORDER_FLOW' };

// Initial state
const initialState: AppState = {
  user: null,
  selectedMealPlan: null,
  isAuthModalOpen: false,
  isOrderModalOpen: false,
  isMealPlanSelectionOpen: false,
  orderFlow: 'idle',
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
        isAuthModalOpen: false,
        isOrderModalOpen: false,
        isMealPlanSelectionOpen: false,
        orderFlow: 'idle',
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
  login: (userData: Omit<User, 'id' | 'isAuthenticated'>) => void;
  logout: () => void;
  selectMealPlan: (plan: MealPlan) => void;
  startOrderFlow: (preSelectedPlan?: MealPlan) => void;
  isLoggedIn: () => boolean;
} | null>(null);

// Provider component
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load user data from localStorage on mount
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
  }, []);

  // Save user data to localStorage when user changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('mealzee_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('mealzee_user');
    }
  }, [state.user]);

  // Helper functions
  const login = (userData: Omit<User, 'id' | 'isAuthenticated'>) => {
    const user: User = {
      ...userData,
      id: Date.now().toString(), // Simple ID generation
      isAuthenticated: true,
    };
    dispatch({ type: 'SET_USER', payload: user });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT_USER' });
  };

  const selectMealPlan = (plan: MealPlan) => {
    dispatch({ type: 'SET_SELECTED_MEAL_PLAN', payload: plan });
  };

  const isLoggedIn = () => {
    return state.user?.isAuthenticated || false;
  };

  const startOrderFlow = (preSelectedPlan?: MealPlan) => {
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

  const value = {
    state,
    dispatch,
    login,
    logout,
    selectMealPlan,
    startOrderFlow,
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
