'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Clock, Star, Utensils } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface MealPlan {
  id: string;
  title: string;
  duration: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  image: string;
  description: string;
  features: string[];
}

const mealPlans: MealPlan[] = [
  {
    id: 'breakfast-lunch-dinner',
    title: 'Breakfast, Lunch & Dinner',
    duration: '1 Month',
    originalPrice: 3899,
    discountedPrice: 3399,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop&crop=center',
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
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop&crop=center',
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
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=200&fit=crop&crop=center',
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
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=200&fit=crop&crop=center',
    description: 'Great for evening shift workers',
    features: ['2 Meals Daily', 'Afternoon & Night', 'Satisfying Portions', 'Quality Assured']
  }
];

const MealPlans: React.FC = () => {
  const { startOrderFlow, state } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleOrderNow = (plan: MealPlan) => {
    startOrderFlow(plan);
  };

  return (
    <section className="py-16 bg-olive-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">
            Choose Your Perfect
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Meal Plan
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Healthy | Affordable | Delicious
          </p>
        </motion.div>

        {/* Meal Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {mealPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`bg-gradient-to-br from-olive-100 to-olive-200 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                state.selectedMealPlan?.id === plan.id
                  ? 'border-olive-500 ring-2 ring-olive-200'
                  : selectedPlan === plan.id
                    ? 'border-olive-300'
                    : 'border-transparent'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <div className="flex items-center space-x-4">
                {/* Meal Image */}
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white shadow-md">
                  <img
                    src="/thali.png"
                    alt="Delicious Meal"
                    className="w-full h-full object-cover"
                  />
                  {state.selectedMealPlan?.id === plan.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-olive-500 rounded-full flex items-center justify-center"
                    >
                      <Star className="w-4 h-4 text-white fill-current" />
                    </motion.div>
                  )}
                </div>

                {/* Plan Details */}
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-800 mb-1">
                    {plan.title}
                  </h4>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">{plan.duration}</span>
                    <div className="bg-olive-600 text-white text-xs px-2 py-1 rounded-full">
                      {plan.discount}% off
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-green-600">
                      ₹{plan.discountedPrice}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{plan.originalPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOrderNow(plan);
                }}
                className={`w-full mt-4 py-3 rounded-2xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  state.selectedMealPlan?.id === plan.id
                    ? 'bg-olive-700 text-white'
                    : 'bg-olive-600 text-white hover:bg-olive-700'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{state.selectedMealPlan?.id === plan.id ? 'Selected Plan' : 'Subscribe Meal'}</span>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            All plans include free delivery and can be customized to your preferences
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>Fresh Daily</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-green-500" />
              <span>On Time</span>
            </div>
            <div className="flex items-center space-x-1">
              <Utensils className="w-4 h-4 text-olive-500" />
              <span>Healthy</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MealPlans;
