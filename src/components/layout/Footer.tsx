'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
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
import { SOCIAL_LINKS } from '@/lib/constants';

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
                <div className="mb-4">
                  <img
                    src="/footer_logo.png"
                    alt="Mealzee Logo"
                    className="h-12 w-auto"
                  />
                </div>
                <p className="text-gray-700 leading-relaxed mb-2">
                  Mealzee is your daily dose of homemade food.
                </p>
                {/* <p className="text-gray-600 text-sm italic"> */}
                  <p className="text-gray-700 leading-relaxed mb-2">
                  No stress, just fresh tiffins on time.
                </p>

                {/* Social Media Icons */}
                <div className="flex space-x-4 mt-8">
                  {/* Facebook */}
                  <motion.a
                    href={SOCIAL_LINKS.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </motion.a>

                  {/* Instagram */}
                  <motion.a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </motion.a>

                  {/* X (formerly Twitter) */}
                  <motion.a
                    href={SOCIAL_LINKS.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-sm font-extrabold">X</span>
                  </motion.a>

                  {/* WhatsApp */}
                  <motion.a
                    href={SOCIAL_LINKS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-xs font-bold"><MessageCircle/></span>
                  </motion.a>
                </div>
              </motion.div>
            </div>



            {/* Policies */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-4">POLICIES</h4>
                <ul className="space-y-3 text-gray-700">
                  <li><a href="/menu" className="hover:text-gray-900 transition-colors">Menu</a></li>
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
            <p className="text-gray-600">Copyright © Mealzee 2025</p>
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
