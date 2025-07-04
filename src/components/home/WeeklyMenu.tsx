'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Star, Leaf, Utensils, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Button from '@/components/ui/Button';

// Sample weekly menu data (subset for homepage display)
const WEEKLY_MENU_PREVIEW = {
  Monday: [
    { id: 1, name: 'Masala Dosa', price: 80, time: '15 min', rating: 4.5, isVeg: true, type: 'breakfast' },
    { id: 4, name: 'Dal Rice Combo', price: 120, time: '20 min', rating: 4.4, isVeg: true, type: 'lunch' },
    { id: 7, name: 'Paneer Butter Masala', price: 160, time: '20 min', rating: 4.7, isVeg: true, type: 'dinner' },
  ],
  Tuesday: [
    { id: 11, name: 'Idli Sambar', price: 70, time: '12 min', rating: 4.6, isVeg: true, type: 'breakfast' },
    { id: 14, name: 'Chole Rice', price: 150, time: '22 min', rating: 4.5, isVeg: true, type: 'lunch' },
    { id: 17, name: 'Butter Chicken', price: 200, time: '25 min', rating: 4.8, isVeg: false, type: 'dinner' },
  ],
  Wednesday: [
    { id: 21, name: 'Vada Pav', price: 40, time: '8 min', rating: 4.4, isVeg: true, type: 'breakfast' },
    { id: 25, name: 'Chicken Biryani', price: 220, time: '35 min', rating: 4.9, isVeg: false, type: 'lunch' },
    { id: 27, name: 'Kadai Paneer', price: 170, time: '22 min', rating: 4.6, isVeg: true, type: 'dinner' },
  ],
  Thursday: [
    { id: 31, name: 'Rava Dosa', price: 90, time: '18 min', rating: 4.5, isVeg: true, type: 'breakfast' },
    { id: 34, name: 'Thali', price: 160, time: '25 min', rating: 4.6, isVeg: true, type: 'lunch' },
    { id: 37, name: 'Chicken Tikka Masala', price: 190, time: '25 min', rating: 4.7, isVeg: false, type: 'dinner' },
  ],
  Friday: [
    { id: 41, name: 'Uttapam', price: 85, time: '16 min', rating: 4.4, isVeg: true, type: 'breakfast' },
    { id: 44, name: 'Pulao', price: 140, time: '20 min', rating: 4.3, isVeg: true, type: 'lunch' },
    { id: 47, name: 'Fish Curry', price: 200, time: '30 min', rating: 4.5, isVeg: false, type: 'dinner' },
  ],
  Saturday: [
    { id: 51, name: 'Pav Bhaji', price: 100, time: '15 min', rating: 4.7, isVeg: true, type: 'breakfast' },
    { id: 54, name: 'Mutton Biryani', price: 280, time: '40 min', rating: 4.8, isVeg: false, type: 'lunch' },
    { id: 57, name: 'Palak Paneer', price: 160, time: '20 min', rating: 4.6, isVeg: true, type: 'dinner' },
  ],
  Sunday: [
    { id: 61, name: 'Chole Bhature', price: 120, time: '20 min', rating: 4.6, isVeg: true, type: 'breakfast' },
    { id: 64, name: 'Sunday Special Thali', price: 250, time: '30 min', rating: 4.9, isVeg: true, type: 'lunch' },
    { id: 67, name: 'Tandoori Chicken', price: 220, time: '35 min', rating: 4.8, isVeg: false, type: 'dinner' },
  ],
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WeeklyMenu: React.FC = () => {
  const { startOrderFlow } = useApp();
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [selectedMealType, setSelectedMealType] = useState<'all' | 'breakfast' | 'lunch' | 'dinner'>('all');

  const currentDay = DAYS[currentDayIndex];
  const currentMenu = WEEKLY_MENU_PREVIEW[currentDay as keyof typeof WEEKLY_MENU_PREVIEW] || [];
  
  const filteredMenu = selectedMealType === 'all' 
    ? currentMenu 
    : currentMenu.filter(item => item.type === selectedMealType);

  const nextDay = () => {
    setCurrentDayIndex((prev) => (prev + 1) % DAYS.length);
  };

  const prevDay = () => {
    setCurrentDayIndex((prev) => (prev - 1 + DAYS.length) % DAYS.length);
  };

  const handleOrderItem = (item: any) => {
    startOrderFlow();
  };

  const getMealTypeEmoji = (type: string) => {
    switch (type) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      default: return '🍽️';
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-olive-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Weekly Menu
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated weekly menu with fresh, delicious meals for every day
          </p>
        </motion.div>

        {/* Day Navigation */}
        <div className="flex items-center justify-center mb-8">
          <button
            onClick={prevDay}
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow mr-4"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <motion.div
            key={currentDay}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl px-8 py-4 shadow-lg"
          >
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-olive-500" />
              <h3 className="text-2xl font-bold text-gray-900">{currentDay}</h3>
            </div>
          </motion.div>

          <button
            onClick={nextDay}
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow ml-4"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Meal Type Filter */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-md">
            {['all', 'breakfast', 'lunch', 'dinner'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedMealType(type as any)}
                className={`px-6 py-2 rounded-xl font-medium transition-all capitalize ${
                  selectedMealType === type
                    ? 'bg-olive-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {type === 'all' ? '🍽️ All' : `${getMealTypeEmoji(type)} ${type}`}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentDay}-${selectedMealType}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredMenu.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-sm text-olive-500 font-medium capitalize">
                        {getMealTypeEmoji(item.type)} {item.type}
                      </span>
                      <h3 className="font-bold text-gray-900 text-lg mt-1">{item.name}</h3>
                    </div>
                    <div className="flex items-center space-x-1">
                      {item.isVeg ? (
                        <Leaf className="w-4 h-4 text-green-500" />
                      ) : (
                        <Utensils className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  
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
                    className="w-full bg-olive-500 hover:bg-olive-600 group-hover:scale-105 transition-transform"
                    onClick={() => handleOrderItem(item)}
                  >
                    Order Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View Full Menu CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Button
            variant="secondary"
            size="lg"
            className="bg-white text-olive-600 hover:bg-gray-50 shadow-lg"
            onClick={() => window.location.href = '/menu'}
          >
            View Complete Weekly Menu
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default WeeklyMenu;
