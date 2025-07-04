'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  Heart,
  User,
  ShoppingCart,
  LogOut,
  Facebook,
  Instagram
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const Footer: React.FC = () => {
  const { state, dispatch, logout, isLoggedIn, startOrderFlow } = useApp();

  const handleOrderNow = () => {
    startOrderFlow();
  };

  return (
    <>
      {/* Top Action Bar */}
      <div className="bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Left: Mealzee Logo */}
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="/logo.jpg"
                  alt="Mealzee Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-3xl font-bold text-yellow-400">
                Mealzee
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center space-x-4">
              {/* User Status Display (if logged in) */}
              {isLoggedIn() && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-yellow-400 text-green-800 px-4 py-3 rounded-full font-semibold flex items-center space-x-2"
                >
                  <User className="w-5 h-5" />
                  <span>Hi, {state.user?.fullName?.split(' ')[0] || 'User'}</span>
                </motion.div>
              )}

              {/* Order Button - Changes based on order state */}
              <motion.button
                onClick={handleOrderNow}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{state.selectedMealPlan ? 'edit order' : 'order now'}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="bg-gradient-to-r from-yellow-200 to-yellow-300 text-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src="/logo.jpg"
                      alt="Mealzee Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-3xl font-bold text-blue-800">
                    Mealzee
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Mealzy is a nutrition and wellness service that offers personalized meals delivered at doorsteps.
                </p>

                {/* Social Media Icons */}
                <div className="flex space-x-4 mt-4">
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-xs font-bold">W</span>
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </motion.a>
                </div>
              </motion.div>
            </div>



            {/* Policies */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-4">POLICIES</h4>
                <ul className="space-y-3 text-gray-700">
                  <li><a href="/shipping" className="hover:text-gray-900 transition-colors">Shipping</a></li>
                  <li><a href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</a></li>
                  <li><a href="/terms" className="hover:text-gray-900 transition-colors">Terms of Use</a></li>
                  <li><a href="/refund" className="hover:text-gray-900 transition-colors">Refund Policy</a></li>
                  <li><a href="/contact" className="hover:text-gray-900 transition-colors">Contact</a></li>
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="border-t border-yellow-400 pt-6 mt-8 text-left"
          >
            <p className="text-gray-600">Copyright © Mealzy 2024</p>
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
