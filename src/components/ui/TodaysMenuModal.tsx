"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Star, Leaf, Utensils, Coffee, Sun, Moon } from "lucide-react";
import { WEEKLY_MENU, MenuItem } from "@/lib/weeklyMenu";

interface TodaysMenuModalProps {
  open: boolean;
  onClose: () => void;
}

const TodaysMenuModal: React.FC<TodaysMenuModalProps> = ({ open, onClose }) => {
  // Get today's day name
  const today = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = new Date().getDay();
    return days[currentDay];
  }, []);

  // Get today's menu
  const todaysMenu = useMemo(() => {
    return WEEKLY_MENU[today] || WEEKLY_MENU.Monday;
  }, [today]);

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return <Coffee className="w-5 h-5" />;
      case 'lunch':
        return <Sun className="w-5 h-5" />;
      case 'dinner':
        return <Moon className="w-5 h-5" />;
      default:
        return <Utensils className="w-5 h-5" />;
    }
  };

  const getMealTime = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return '7:00 AM - 10:00 AM';
      case 'lunch':
        return '12:00 PM - 3:00 PM';
      case 'dinner':
        return '7:00 PM - 10:00 PM';
      default:
        return '';
    }
  };

  const renderMealSection = (mealType: 'breakfast' | 'lunch' | 'dinner', items: MenuItem[]) => (
    <div className="bg-white rounded-xl p-3 shadow-sm ring-1 ring-olive-200">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-lg bg-olive-100 text-olive-600 flex items-center justify-center">
          {getMealIcon(mealType)}
        </div>
        <div>
          <h3 className="font-medium text-gray-900 capitalize text-sm">{mealType}</h3>
          <p className="text-xs text-gray-500">{getMealTime(mealType)}</p>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-1">
                <h4 className="font-medium text-gray-900 text-xs truncate">{item.name}</h4>
                {item.isVeg && <Leaf className="w-3 h-3 text-green-500 flex-shrink-0" />}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span>{item.rating}</span>
                </div>
                {item.calories && (
                  <span>{item.calories} cal</span>
                )}
              </div>
            </div>
            <div className="text-right ml-2 flex-shrink-0">
              <div className="font-semibold text-olive-600 text-sm">₹{item.price}</div>
              {item.spiceLevel && (
                <div className="text-xs text-gray-500 capitalize">{item.spiceLevel}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[10020] flex items-end sm:items-center justify-center p-0 sm:p-4 pt-20 sm:pt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative w-full max-w-lg h-[80vh] sm:h-[75vh] bg-gradient-to-br from-white to-olive-50 rounded-t-3xl sm:rounded-3xl shadow-2xl ring-1 ring-olive-200 flex flex-col"
          >
            {/* Header - Fixed */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-olive-200/60 bg-white rounded-t-3xl sm:rounded-t-3xl flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-olive-600 text-white flex items-center justify-center shadow">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Today's Menu</h3>
                  <p className="text-xs text-gray-600">{formatDate()}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
              {renderMealSection('breakfast', todaysMenu.breakfast)}
              {renderMealSection('lunch', todaysMenu.lunch)}
              {renderMealSection('dinner', todaysMenu.dinner)}

              {/* Extra padding at bottom to ensure last item is visible */}
              <div className="h-4"></div>
            </div>

            {/* Footer - Fixed */}
            <div className="px-4 py-3 bg-white/90 backdrop-blur-sm border-t border-olive-200/60 flex items-center justify-between flex-shrink-0 rounded-b-3xl sm:rounded-b-3xl">
              <div className="text-xs text-gray-600">
                Fresh meals prepared daily
              </div>
              <button
                onClick={onClose}
                className="px-4 py-1.5 text-xs rounded-lg bg-olive-600 hover:bg-olive-700 text-white shadow cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TodaysMenuModal;
