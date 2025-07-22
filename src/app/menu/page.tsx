'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Clock, Star, Leaf, Utensils, Download } from 'lucide-react';
import { MEAL_CATEGORIES } from '@/lib/constants';
import { useApp } from '@/contexts/AppContext';
import Button from '@/components/ui/Button';
import Navbar from '@/components/layout/Navbar';
import OrderFlowManager from '@/components/order/OrderFlowManager';

// Updated weekly menu data with new meal plan and prices
const WEEKLY_MENU = {
  Monday: {
    breakfast: [
      { id: 1, name: 'Aloo Paratha & Tomato Ketchup', price: 40, time: '15 min', rating: 4.5, isVeg: true, description: 'Stuffed potato paratha served with tangy tomato ketchup', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop' },
    ],
    lunch: [
      { id: 2, name: 'Roti, Chawal, Dal, Sabji, Achar, Chutney', price: 70, time: '20 min', rating: 4.4, isVeg: true, description: 'Complete traditional meal with roti, rice, dal, vegetables, pickle and chutney', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' },
    ],
    dinner: [
      { id: 3, name: 'Roti, Sabji, Sweet', price: 60, time: '18 min', rating: 4.3, isVeg: true, description: 'Fresh roti with seasonal vegetables and sweet dessert', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop' },
    ],
    combo: []
  },
  Tuesday: {
    breakfast: [
      { id: 4, name: 'Bread Toast & Jam/Ketchup', price: 35, time: '10 min', rating: 4.2, isVeg: true, description: 'Crispy bread toast served with jam or ketchup', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop' },
    ],
    lunch: [
      { id: 5, name: 'Pulao, Tadka, Papad', price: 60, time: '18 min', rating: 4.4, isVeg: true, description: 'Aromatic rice pulao with dal tadka and crispy papad', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop' },
    ],
    dinner: [
      { id: 6, name: 'Paratha, Mix Veg', price: 55, time: '15 min', rating: 4.3, isVeg: true, description: 'Fresh paratha with mixed vegetable curry', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop' },
    ],
    combo: []
  },
  Wednesday: {
    breakfast: [
      { id: 7, name: 'Idli & Chutney', price: 35, time: '12 min', rating: 4.3, isVeg: true, description: 'Steamed rice cakes with coconut chutney', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop' },
    ],
    lunch: [
      { id: 8, name: 'Roti, Jeera Rice, Egg Curry, Chips', price: 85, time: '22 min', rating: 4.6, isVeg: false, description: 'Complete meal with roti, cumin rice, egg curry and chips', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' },
      { id: 9, name: 'Roti, Jeera Rice, Pakoda, Kadhi', price: 70, time: '20 min', rating: 4.4, isVeg: true, description: 'Traditional meal with roti, cumin rice, pakoda and kadhi', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop' },
    ],
    dinner: [
      { id: 10, name: 'Roti, Chicken Chili', price: 95, time: '25 min', rating: 4.7, isVeg: false, description: 'Fresh roti with spicy chicken chili', image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop' },
      { id: 11, name: 'Roti, Soya Chili', price: 70, time: '18 min', rating: 4.5, isVeg: true, description: 'Fresh roti with soya chili curry', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop' },
    ],
    combo: []
  },
  Thursday: {
    breakfast: [
      { id: 12, name: 'Chowmein / Pasta', price: 45, time: '15 min', rating: 4.4, isVeg: true, description: 'Stir-fried noodles or pasta with vegetables', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop' },
    ],
    lunch: [
      { id: 13, name: 'Roti, Rajma, Chawal, Sabji, Achar, Chips', price: 75, time: '25 min', rating: 4.6, isVeg: true, description: 'Complete meal with roti, rajma, rice, vegetables, pickle and chips', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' },
    ],
    dinner: [
      { id: 14, name: 'Sattu Paratha & Ketchup / Sabji', price: 65, time: '18 min', rating: 4.5, isVeg: true, description: 'Nutritious sattu paratha with ketchup or vegetable curry', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop' },
    ],
    combo: []
  },
  Friday: {
    breakfast: [
      { id: 15, name: 'Puri & Sabji', price: 45, time: '15 min', rating: 4.4, isVeg: true, description: 'Fried bread with spiced vegetable curry', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop' },
    ],
    lunch: [
      { id: 16, name: 'Roti, Chawal, Fish Curry', price: 95, time: '25 min', rating: 4.7, isVeg: false, description: 'Fresh roti, rice with delicious fish curry', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' },
      { id: 17, name: 'Roti, Chawal, Aloo Dum', price: 70, time: '20 min', rating: 4.5, isVeg: true, description: 'Roti, rice with spiced potato curry', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' },
    ],
    dinner: [
      { id: 18, name: 'Paratha & Paneer', price: 75, time: '20 min', rating: 4.6, isVeg: true, description: 'Fresh paratha with paneer curry', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop' },
      { id: 19, name: 'Paratha & Sabji', price: 60, time: '15 min', rating: 4.4, isVeg: true, description: 'Fresh paratha with seasonal vegetable curry', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop' },
    ],
    combo: []
  },
  Saturday: {
    breakfast: [
      { id: 20, name: 'Sandwich & Ketchup', price: 40, time: '12 min', rating: 4.3, isVeg: true, description: 'Grilled sandwich served with tomato ketchup', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop' },
    ],
    lunch: [
      { id: 21, name: 'Khichdi, Chokha, Achar, Chips', price: 65, time: '18 min', rating: 4.5, isVeg: true, description: 'Comfort meal with khichdi, mashed vegetables, pickle and chips', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop' },
    ],
    dinner: [
      { id: 22, name: 'Roti & Sabji', price: 55, time: '15 min', rating: 4.4, isVeg: true, description: 'Fresh roti with seasonal vegetable curry', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop' },
      { id: 23, name: 'Roti & Bhindi', price: 60, time: '18 min', rating: 4.5, isVeg: true, description: 'Fresh roti with spiced okra curry', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop' },
    ],
    combo: []
  },
  Sunday: {
    breakfast: [
      { id: 24, name: 'Roti & Mix Veg', price: 45, time: '15 min', rating: 4.4, isVeg: true, description: 'Fresh roti with mixed vegetable curry', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop' },
    ],
    lunch: [
      { id: 25, name: 'Chicken Biryani, Raita & Papad', price: 110, time: '30 min', rating: 4.8, isVeg: false, description: 'Aromatic chicken biryani with cooling raita and crispy papad', image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop' },
      { id: 26, name: 'Veg Biryani, Raita & Papad', price: 85, time: '25 min', rating: 4.6, isVeg: true, description: 'Fragrant vegetable biryani with raita and papad', image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop' },
    ],
    dinner: [
      { id: 27, name: 'Chole Bhature', price: 70, time: '20 min', rating: 4.7, isVeg: true, description: 'Spicy chickpea curry with fried bread', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop' },
    ],
    combo: []
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
    // Start the order flow - this will check if user is logged in and has selected a meal plan
    // If not, it will guide them through the proper flow:
    // 1. If not logged in -> show auth modal
    // 2. If logged in but no meal plan -> show meal plan selection
    // 3. If logged in and meal plan selected -> show order confirmation
    startOrderFlow();
  };

  const handleDownloadMenu = () => {
    const link = document.createElement('a');
    link.href = '/download_menu.jpg';
    link.download = 'mealzee_weekly_menu.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-olive-50">
      <Navbar />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-olive-500 to-olive-600 text-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Our Weekly Menu</h1>
            <p className="text-olive-100 text-lg mb-6">
              Fresh, delicious meals prepared daily with love
            </p>
            <Button
              onClick={handleDownloadMenu}
              className="bg-white text-olive-600 hover:bg-gray-50 font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Menu
            </Button>
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
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  {/* Food Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <div className={`w-6 h-6 rounded-sm flex items-center justify-center ${
                        item.isVeg ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        <div className={`w-3 h-3 rounded-full ${
                          item.isVeg ? 'bg-green-600' : 'bg-red-600'
                        }`}></div>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg shadow-md">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium">{item.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight">{item.name}</h3>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{item.time}</span>
                      </div>
                      <div className="text-xl font-bold text-olive-600">₹{item.price}</div>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full bg-olive-500 hover:bg-olive-600 text-white font-medium py-2 rounded-lg transition-colors"
                      onClick={() => handleOrderItem()}
                    >
                      Start Order
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

      {/* Global Order Flow Manager */}
      <OrderFlowManager />
    </div>
  );
}
