'use client';

import React from 'react';
import { useApp } from '@/contexts/AppContext';
import AuthModal from '@/components/auth/AuthModal';
import MealPlanSelectionModal from '@/components/order/MealPlanSelectionModal';
import OrderModal from '@/components/order/OrderModal';

/**
 * OrderFlowManager handles the complete order flow logic:
 * 
 * Scenario A - User is logged in AND has selected a meal plan:
 * - Proceed directly to order confirmation (OrderModal)
 * 
 * Scenario B - User is logged in BUT no meal plan selected:
 * - Show meal plan selection interface first (MealPlanSelectionModal)
 * - After meal selection, proceed to order confirmation
 * 
 * Scenario C - User is NOT logged in:
 * - Show login modal first (AuthModal)
 * - After successful login, show meal plan selection
 * - After meal selection, proceed to order confirmation
 */

const OrderFlowManager: React.FC = () => {
  const { state, dispatch } = useApp();

  return (
    <>
      {/* Authentication Modal */}
      <AuthModal
        isOpen={state.isAuthModalOpen}
        onClose={() => {
          dispatch({ type: 'CLOSE_AUTH_MODAL' });
          dispatch({ type: 'RESET_ORDER_FLOW' });
        }}
      />

      {/* Meal Plan Selection Modal */}
      <MealPlanSelectionModal
        isOpen={state.isMealPlanSelectionOpen}
        onClose={() => {
          dispatch({ type: 'CLOSE_MEAL_PLAN_SELECTION' });
          dispatch({ type: 'RESET_ORDER_FLOW' });
        }}
      />

      {/* Order Confirmation Modal */}
      <OrderModal
        isOpen={state.isOrderModalOpen}
        onClose={() => {
          dispatch({ type: 'CLOSE_ORDER_MODAL' });
          dispatch({ type: 'RESET_ORDER_FLOW' });
        }}
        selectedPlan={state.selectedMealPlan || undefined}
        selectedDish={state.selectedDish || undefined}
        orderType={state.orderType}
      />
    </>
  );
};

export default OrderFlowManager;
