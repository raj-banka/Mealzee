'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Clock, Star, Download, X } from 'lucide-react';
import Image from 'next/image';
import { MEAL_CATEGORIES } from '@/lib/constants';
import { useApp } from '@/contexts/AppContext';
import Button from '@/components/ui/Button';
import Navbar from '@/components/layout/Navbar';
import OrderFlowManager from '@/components/order/OrderFlowManager';
import { WEEKLY_MENU, MenuItem } from '@/lib/weeklyMenu';



const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MenuPage() {
  const { startDishOrderFlow } = useApp();
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [selectedImage, setSelectedImage] = useState<MenuItem | null>(null);

  const currentMenu = WEEKLY_MENU[selectedDay as keyof typeof WEEKLY_MENU] || WEEKLY_MENU.Monday;
  const currentMealItems = currentMenu[selectedMealType as keyof typeof currentMenu] || [];

  const handleOrderItem = (dish: MenuItem) => {
    // Start the dish order flow - this will check if user is logged in
    // If not, it will guide them through the proper flow:
    // 1. If not logged in -> show auth modal
    // 2. If logged in -> show order confirmation for the specific dish
    
    // Convert the dish to match AppContext MenuItem type (id as string)
    const dishForContext = {
      ...dish,
      id: dish.id.toString(),
      image: dish.image || '/images/vegthali.jpg',
      spiceLevel: dish.spiceLevel || 'mild'
    };
    
    startDishOrderFlow(dishForContext);
  };

  const handleDownloadMenu = () => {
    const link = document.createElement('a');
    link.href = '/download_menu.jpg';
    link.download = 'mealzee_weekly_menu.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageClick = (item: MenuItem) => {
    setSelectedImage(item);
  };

  return (
    <div className="min-h-screen bg-olive-50">
      <Navbar />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-olive-500 to-olive-600 text-white pt-20">
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
                  <div 
                    className="relative h-56 overflow-hidden rounded-t-xl bg-gray-100 cursor-pointer"
                    onClick={() => handleImageClick(item)}
                  >
                    <Image
                      src={item.image || '/images/vegthali.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Click overlay with zoom hint */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                        <span className="text-sm font-medium text-gray-800">Click to view full details</span>
                      </div>
                    </div>

                    <div className="absolute top-3 left-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center backdrop-blur-sm border-2 ${
                        item.isVeg ? 'bg-green-500/90 border-green-400' : 'bg-red-500/90 border-red-400'
                      }`}>
                        <div className={`w-3 h-3 rounded-full ${
                          item.isVeg ? 'bg-green-600' : 'bg-red-600'
                        }`}></div>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border border-white/20">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                        <span className="text-xs font-semibold text-gray-800">{item.rating}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-gray-600" />
                        <span className="text-xs font-semibold text-gray-800">{item.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight flex-1">{item.name}</h3>
                      <div className="text-2xl font-bold text-olive-600 ml-3">₹{item.price}</div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.spiceLevel === 'mild' ? 'bg-green-100 text-green-700' :
                          item.spiceLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {item.spiceLevel === 'mild' ? '🟢 Mild' : 
                           item.spiceLevel === 'medium' ? '🟡 Medium' : '🔴 Spicy'}
                        </span>
                        {item.calories && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {item.calories} cal
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full bg-gradient-to-r from-olive-500 to-olive-600 hover:from-olive-600 hover:to-olive-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                      onClick={() => handleOrderItem(item)}
                    >
                      Order now
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

      {/* Image Popup Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 cursor-pointer"
              >
                <X className="w-3 h-3 text-gray-700" />
              </button>

              <div className="grid md:grid-cols-2 gap-0">
                {/* Image Section */}
                <div className="relative h-80 md:h-96 bg-gray-100">
                  <Image
                    src={selectedImage.image || '/images/vegthali.jpg'}
                    alt={selectedImage.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  
                  {/* Veg/Non-Veg Indicator */}
                  <div className="absolute top-4 left-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-sm border-2 ${
                      selectedImage.isVeg ? 'bg-green-500/90 border-green-400' : 'bg-red-500/90 border-red-400'
                    }`}>
                      <div className={`w-4 h-4 rounded-full ${
                        selectedImage.isVeg ? 'bg-green-600' : 'bg-red-600'
                      }`}></div>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-gray-800">{selectedImage.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <h2 className="text-2xl font-bold text-gray-900 leading-tight flex-1">
                        {selectedImage.name}
                      </h2>
                      <div className="text-3xl font-bold text-olive-600 ml-4">
                        ₹{selectedImage.price}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {selectedImage.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">Prep Time:</span> {selectedImage.time}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedImage.spiceLevel === 'mild' ? 'bg-green-100 text-green-700' :
                          selectedImage.spiceLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {selectedImage.spiceLevel === 'mild' ? '🟢 Mild' : 
                           selectedImage.spiceLevel === 'medium' ? '🟡 Medium' : '🔴 Spicy'}
                        </span>
                      </div>

                      {selectedImage.calories && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            <span className="font-medium">Calories:</span> {selectedImage.calories}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">Type:</span> {selectedImage.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full bg-gradient-to-r from-olive-500 to-olive-600 hover:from-olive-600 hover:to-olive-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    onClick={() => {
                      if (selectedImage) {
                        handleOrderItem(selectedImage);
                        setSelectedImage(null);
                      }
                    }}
                  >
                    Order Now - ₹{selectedImage.price}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Order Flow Manager */}
      <OrderFlowManager />
    </div>
  );
}
