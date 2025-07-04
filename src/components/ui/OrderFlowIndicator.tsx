'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Utensils, ShoppingCart, CheckCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const OrderFlowIndicator: React.FC = () => {
  const { state, isLoggedIn } = useApp();

  // Don't show indicator if no order flow is active
  if (state.orderFlow === 'idle') return null;

  const steps = [
    {
      id: 'auth',
      label: 'Login',
      icon: User,
      completed: isLoggedIn(),
      active: state.orderFlow === 'auth'
    },
    {
      id: 'meal-selection',
      label: 'Select Meal',
      icon: Utensils,
      completed: !!state.selectedMealPlan,
      active: state.orderFlow === 'meal-selection'
    },
    {
      id: 'order-confirmation',
      label: 'Order',
      icon: ShoppingCart,
      completed: false,
      active: state.orderFlow === 'order-confirmation'
    }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 bg-white rounded-full shadow-lg border border-gray-200 px-6 py-3"
      >
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = step.completed;
            const isActive = step.active;
            
            return (
              <React.Fragment key={step.id}>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                        ? 'bg-green-100 text-green-600 border-2 border-green-500'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isCompleted || isActive ? 'text-gray-800' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 h-0.5 ${
                      steps[index + 1].completed || (isCompleted && steps[index + 1].active)
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderFlowIndicator;
