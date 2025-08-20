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
    <div className="bg-white rounded-xl p-4 shadow-sm ring-1 ring-olive-200">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-olive-100 text-olive-600 flex items-center justify-center">
          {getMealIcon(mealType)}
        </div>
        <h3 className="font-semibold text-gray-900 capitalize text-lg">{mealType}</h3>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              {/* Veg/Non-veg indicator dot */}
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
              <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
              {item.isVeg && <Leaf className="w-4 h-4 text-green-500 flex-shrink-0" />}
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
          className="fixed inset-0 z-[10020] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
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
            className="relative w-full max-w-md bg-gradient-to-br from-white to-olive-50 rounded-2xl shadow-2xl ring-1 ring-olive-200 flex flex-col max-h-[70vh]"
          >
            {/* Header - Fixed */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-olive-200/60 bg-white rounded-t-2xl flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-olive-600 text-white flex items-center justify-center shadow">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Today's Menu</h3>
                  <p className="text-sm text-gray-600">{formatDate()}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {renderMealSection('breakfast', todaysMenu.breakfast)}
              {renderMealSection('lunch', todaysMenu.lunch)}
              {renderMealSection('dinner', todaysMenu.dinner)}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TodaysMenuModal;
