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
      {/* Main Footer */}
      <footer className="bg-gradient-to-r from-olive-200 to-olive-300 text-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center space-x-3 mb-4 w-30 h-18">
                  {/* <div className="w-14 h-14 rounded-xl overflow-hidden shadow-lg bg-white p-1"> */}
                      <img
                      style={{ backgroundColor: '#00430D' }}
                src="/logo_resized_for_web-removebg-preview.png"
                alt="Mealzee Logo"
                className="w-30 h-18 object-contain p-2 rounded-2xl"
              />
                  </div>
                  {/* <div className="text-3xl font-bold text-blue-800">
                    Mealzee
                  </div> */}
                {/* </div> */}
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
            className="border-t border-yellow-800 pt-6 mt-8 text-center"
          >
            <p className="text-gray-600">Copyright © Mealzy 2024</p>
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
