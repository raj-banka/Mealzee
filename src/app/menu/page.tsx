'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Clock, Star, Leaf, Utensils } from 'lucide-react';
import { MEAL_CATEGORIES } from '@/lib/constants';
import { useApp } from '@/contexts/AppContext';
import Button from '@/components/ui/Button';
import Navbar from '@/components/layout/Navbar';

// Sample menu data organized by meal types and days
const WEEKLY_MENU = {
  Monday: {
    breakfast: [
      { id: 1, name: 'Masala Dosa', price: 80, time: '15 min', rating: 4.5, isVeg: true, description: 'Crispy dosa with spicy potato filling' },
      { id: 2, name: 'Poha', price: 60, time: '10 min', rating: 4.3, isVeg: true, description: 'Flattened rice with vegetables and spices' },
      { id: 3, name: 'Upma', price: 50, time: '12 min', rating: 4.2, isVeg: true, description: 'Semolina porridge with vegetables' },
    ],
    lunch: [
      { id: 4, name: 'Dal Rice Combo', price: 120, time: '20 min', rating: 4.4, isVeg: true, description: 'Yellow dal with steamed rice and pickle' },
      { id: 5, name: 'Chicken Curry Rice', price: 180, time: '25 min', rating: 4.6, isVeg: false, description: 'Spicy chicken curry with basmati rice' },
      { id: 6, name: 'Rajma Rice', price: 140, time: '22 min', rating: 4.5, isVeg: true, description: 'Kidney beans curry with rice' },
    ],
    dinner: [
      { id: 7, name: 'Paneer Butter Masala', price: 160, time: '20 min', rating: 4.7, isVeg: true, description: 'Rich paneer curry with butter naan' },
      { id: 8, name: 'Fish Curry', price: 200, time: '30 min', rating: 4.5, isVeg: false, description: 'Bengali style fish curry with rice' },
      { id: 9, name: 'Aloo Gobi', price: 130, time: '18 min', rating: 4.3, isVeg: true, description: 'Potato and cauliflower curry with roti' },
    ],
    combo: [
      { id: 10, name: 'Monday Special Thali', price: 220, time: '25 min', rating: 4.8, isVeg: true, description: 'Complete meal with dal, sabzi, rice, roti, and dessert' },
    ]
  },
  Tuesday: {
    breakfast: [
      { id: 11, name: 'Idli Sambar', price: 70, time: '12 min', rating: 4.6, isVeg: true, description: 'Steamed rice cakes with lentil curry' },
      { id: 12, name: 'Aloo Paratha', price: 90, time: '18 min', rating: 4.4, isVeg: true, description: 'Stuffed potato flatbread with curd' },
      { id: 13, name: 'Bread Omelette', price: 80, time: '10 min', rating: 4.2, isVeg: false, description: 'Fluffy omelette with bread slices' },
    ],
    lunch: [
      { id: 14, name: 'Chole Rice', price: 150, time: '22 min', rating: 4.5, isVeg: true, description: 'Spicy chickpea curry with rice' },
      { id: 15, name: 'Mutton Curry', price: 220, time: '35 min', rating: 4.7, isVeg: false, description: 'Tender mutton curry with rice' },
      { id: 16, name: 'Palak Paneer', price: 160, time: '20 min', rating: 4.6, isVeg: true, description: 'Spinach curry with cottage cheese' },
    ],
    dinner: [
      { id: 17, name: 'Butter Chicken', price: 200, time: '25 min', rating: 4.8, isVeg: false, description: 'Creamy chicken curry with naan' },
      { id: 18, name: 'Dal Makhani', price: 140, time: '22 min', rating: 4.5, isVeg: true, description: 'Rich black lentil curry with rice' },
      { id: 19, name: 'Egg Curry', price: 120, time: '18 min', rating: 4.3, isVeg: false, description: 'Spiced egg curry with rice' },
    ],
    combo: [
      { id: 20, name: 'Tuesday Feast', price: 250, time: '30 min', rating: 4.9, isVeg: false, description: 'Non-veg thali with chicken, rice, dal, and sides' },
    ]
  },
  Wednesday: {
    breakfast: [
      { id: 21, name: 'Vada Pav', price: 40, time: '8 min', rating: 4.4, isVeg: true, description: 'Mumbai street food with potato fritter' },
      { id: 22, name: 'Medu Vada', price: 60, time: '15 min', rating: 4.3, isVeg: true, description: 'Crispy lentil donuts with sambar' },
      { id: 23, name: 'Sandwich', price: 70, time: '10 min', rating: 4.1, isVeg: true, description: 'Grilled vegetable sandwich' },
    ],
    lunch: [
      { id: 24, name: 'Biryani', price: 180, time: '30 min', rating: 4.8, isVeg: true, description: 'Fragrant rice with vegetables and spices' },
      { id: 25, name: 'Chicken Biryani', price: 220, time: '35 min', rating: 4.9, isVeg: false, description: 'Aromatic chicken biryani with raita' },
      { id: 26, name: 'Sambar Rice', price: 110, time: '18 min', rating: 4.4, isVeg: true, description: 'South Indian lentil curry with rice' },
    ],
    dinner: [
      { id: 27, name: 'Kadai Paneer', price: 170, time: '22 min', rating: 4.6, isVeg: true, description: 'Spicy paneer curry with bell peppers' },
      { id: 28, name: 'Prawn Curry', price: 240, time: '28 min', rating: 4.7, isVeg: false, description: 'Coastal style prawn curry with rice' },
      { id: 29, name: 'Mixed Vegetable Curry', price: 120, time: '20 min', rating: 4.2, isVeg: true, description: 'Seasonal vegetables in curry' },
    ],
    combo: [
      { id: 30, name: 'Wednesday Special', price: 200, time: '25 min', rating: 4.7, isVeg: true, description: 'Vegetarian thali with variety of dishes' },
    ]
  },
  Thursday: {
    breakfast: [
      { id: 31, name: 'Rava Dosa', price: 90, time: '18 min', rating: 4.5, isVeg: true, description: 'Crispy semolina crepe with chutney' },
      { id: 32, name: 'Puri Bhaji', price: 80, time: '15 min', rating: 4.3, isVeg: true, description: 'Fried bread with spiced potato curry' },
      { id: 33, name: 'Maggi', price: 50, time: '8 min', rating: 4.0, isVeg: true, description: 'Instant noodles with vegetables' },
    ],
    lunch: [
      { id: 34, name: 'Thali', price: 160, time: '25 min', rating: 4.6, isVeg: true, description: 'Traditional Indian platter with variety' },
      { id: 35, name: 'Fish Fry', price: 180, time: '20 min', rating: 4.5, isVeg: false, description: 'Crispy fried fish with rice' },
      { id: 36, name: 'Paneer Tikka', price: 150, time: '22 min', rating: 4.4, isVeg: true, description: 'Grilled paneer with mint chutney' },
    ],
    dinner: [
      { id: 37, name: 'Chicken Tikka Masala', price: 190, time: '25 min', rating: 4.7, isVeg: false, description: 'Grilled chicken in creamy tomato sauce' },
      { id: 38, name: 'Bhindi Masala', price: 130, time: '18 min', rating: 4.3, isVeg: true, description: 'Spiced okra curry with roti' },
      { id: 39, name: 'Keema Curry', price: 200, time: '30 min', rating: 4.6, isVeg: false, description: 'Minced meat curry with rice' },
    ],
    combo: [
      { id: 40, name: 'Thursday Delight', price: 230, time: '28 min', rating: 4.8, isVeg: false, description: 'Mixed thali with both veg and non-veg options' },
    ]
  }
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MenuPage() {
  const { startOrderFlow } = useApp();
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedMealType, setSelectedMealType] = useState('breakfast');

  const currentMenu = WEEKLY_MENU[selectedDay as keyof typeof WEEKLY_MENU] || WEEKLY_MENU.Monday;
  const currentMealItems = currentMenu[selectedMealType as keyof typeof currentMenu] || [];

  const handleOrderItem = () => {
    // For now, just start the order flow
    startOrderFlow();
  };

  return (
    <div className="min-h-screen bg-olive-50">
      <Navbar />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-olive-500 to-olive-600 text-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Our Weekly Menu</h1>
            <p className="text-olive-100 text-lg">
              Fresh, delicious meals prepared daily with love
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Day Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Day</h2>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedDay === day
                    ? 'bg-olive-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Meal Type Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Meal Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MEAL_CATEGORIES.map((mealType) => (
              <motion.button
                key={mealType.id}
                onClick={() => setSelectedMealType(mealType.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedMealType === mealType.id
                    ? 'border-olive-500 bg-olive-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{mealType.emoji}</div>
                <h3 className="font-semibold text-gray-900">{mealType.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{mealType.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {MEAL_CATEGORIES.find(m => m.id === selectedMealType)?.name} - {selectedDay}
          </h2>
          
          {currentMealItems.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentMealItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                      <div className="flex items-center space-x-1">
                        {item.isVeg ? (
                          <Leaf className="w-4 h-4 text-green-500" />
                        ) : (
                          <Utensils className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{item.time}</span>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-olive-600">₹{item.price}</div>
                    </div>
                    
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full bg-olive-500 hover:bg-olive-600"
                      onClick={() => handleOrderItem()}
                    >
                      Order Now
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🍽️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items available</h3>
              <p className="text-gray-600">Menu for {selectedMealType} on {selectedDay} is coming soon!</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-olive-500 to-olive-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Can&apos;t find what you&apos;re looking for?</h2>
          <p className="text-olive-100 mb-6">
            Contact us for custom meal plans or special dietary requirements
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="bg-white text-olive-600 hover:bg-gray-50"
            onClick={() => router.push('/contact')}
          >
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
}
