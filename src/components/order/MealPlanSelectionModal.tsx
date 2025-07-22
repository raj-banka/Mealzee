'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Utensils, CheckCircle } from 'lucide-react';
import { useApp, MealPlan } from '@/contexts/AppContext';

interface MealPlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mealPlans: MealPlan[] = [
  {
    id: 'breakfast-lunch-dinner',
    title: 'Breakfast, Lunch & Dinner',
    duration: '1 Month',
    originalPrice: 3899,
    discountedPrice: 3399,
    discount: 12,
    description: 'Complete meal solution for the entire day',
    features: ['3 Meals Daily', 'Balanced Nutrition', 'Fresh Ingredients', 'Home Delivery']
  },
  {
    id: 'breakfast-dinner',
    title: 'Breakfast & Dinner',
    duration: '1 Month',
    originalPrice: 3499,
    discountedPrice: 2899,
    discount: 17,
    description: 'Perfect for working professionals',
    features: ['2 Meals Daily', 'Morning & Evening', 'Quick Service', 'Healthy Options']
  },
  {
    id: 'breakfast-lunch',
    title: 'Breakfast & Lunch',
    duration: '1 Month',
    originalPrice: 3499,
    discountedPrice: 2899,
    discount: 17,
    description: 'Ideal for students and day workers',
    features: ['2 Meals Daily', 'Energy Boost', 'Fresh Preparation', 'Timely Delivery']
  },
  {
    id: 'lunch-dinner',
    title: 'Lunch & Dinner',
    duration: '1 Month',
    originalPrice: 3499,
    discountedPrice: 2899,
    discount: 17,
    description: 'Great for evening shift workers',
    features: ['2 Meals Daily', 'Afternoon & Night', 'Satisfying Portions', 'Quality Assured']
  }
];

const MealPlanSelectionModal: React.FC<MealPlanSelectionModalProps> = ({ isOpen, onClose }) => {
  const { state, dispatch, selectMealPlan } = useApp();

  const handlePlanSelect = (plan: MealPlan) => {
    selectMealPlan(plan);
    
    // Close meal plan selection and open order modal
    dispatch({ type: 'CLOSE_MEAL_PLAN_SELECTION' });
    dispatch({ type: 'SET_ORDER_FLOW', payload: 'order-confirmation' });
    dispatch({ type: 'OPEN_ORDER_MODAL' });
  };

  const handleClose = () => {
    dispatch({ type: 'CLOSE_MEAL_PLAN_SELECTION' });
    dispatch({ type: 'RESET_ORDER_FLOW' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-3xl p-8 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Choose Your Meal Plan
                </h2>
                <p className="text-gray-600">
                  Select the perfect meal combination for your lifestyle
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Meal Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mealPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 cursor-pointer border-2 transition-all duration-300 ${
                    state.selectedMealPlan?.id === plan.id 
                      ? 'border-green-500 shadow-lg' 
                      : 'border-transparent hover:border-green-300 hover:shadow-md'
                  }`}
                  onClick={() => handlePlanSelect(plan)}
                >
                  {/* Plan Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shadow-sm">
                        <img
                          src="/pic.png"
                          alt="Meal Plan"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {plan.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{plan.duration}</span>
                        </div>
                      </div>
                    </div>
                    
                    {state.selectedMealPlan?.id === plan.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="p-1 bg-green-500 rounded-full"
                      >
                        <CheckCircle className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-2xl font-bold text-green-600">
                        ₹{plan.discountedPrice}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        ₹{plan.originalPrice}
                      </span>
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                        {plan.discount}% off
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Select Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full mt-4 py-3 rounded-xl font-semibold transition-colors ${
                      state.selectedMealPlan?.id === plan.id
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-green-600 border border-green-600 hover:bg-green-50'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlanSelect(plan);
                    }}
                  >
                    {state.selectedMealPlan?.id === plan.id ? 'Selected' : 'Select Plan'}
                  </motion.button>
                </motion.div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={handleClose}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
              
              {state.selectedMealPlan && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    dispatch({ type: 'CLOSE_MEAL_PLAN_SELECTION' });
                    dispatch({ type: 'SET_ORDER_FLOW', payload: 'order-confirmation' });
                    dispatch({ type: 'OPEN_ORDER_MODAL' });
                  }}
                  className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <span>Continue to Order</span>
                  <CheckCircle className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MealPlanSelectionModal;
