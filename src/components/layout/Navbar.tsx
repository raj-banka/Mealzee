'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, User, UserPlus } from 'lucide-react';
import { NAV_LINKS, APP_CONFIG } from '@/lib/constants';
import Button from '@/components/ui/Button';
import { useSimpleCart } from '@/hooks/useSimpleCart';
import { openWhatsAppForOrder } from '@/utils/whatsapp';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { getItemCount } = useSimpleCart();
  const cartItemCount = getItemCount();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">🍽️</span>
            </div>
            <div className="flex flex-col">
              <span className={`text-2xl font-bold tracking-tight transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                {APP_CONFIG.name}
              </span>
              <span className={`text-xs transition-colors ${
                isScrolled ? 'text-gray-500' : 'text-white/80'
              }`}>
                {APP_CONFIG.description}
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <motion.button
                key={link.id}
                onClick={() => scrollToSection(link.href)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`font-medium transition-all duration-300 hover:text-emerald-500 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                {link.name}
              </motion.button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative p-2 rounded-lg transition-colors ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </motion.button>

            {/* Auth Buttons */}
            <Button
              variant="ghost"
              size="sm"
              className={`${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>

            <Button
              variant="primary"
              size="sm"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up
            </Button>

            <Button
              variant="primary"
              size="sm"
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-lg"
              onClick={openWhatsAppForOrder}
            >
              Order Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled 
                ? 'text-gray-700 hover:bg-gray-100' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-white/95 backdrop-blur-md rounded-b-2xl shadow-lg border-t border-gray-200/20"
            >
              <div className="px-4 py-6 space-y-4">
                {/* Mobile Navigation Links */}
                {NAV_LINKS.map((link) => (
                  <motion.button
                    key={link.id}
                    onClick={() => scrollToSection(link.href)}
                    whileHover={{ x: 5 }}
                    className="block w-full text-left py-3 px-4 text-gray-700 font-medium hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-all"
                  >
                    {link.name}
                  </motion.button>
                ))}

                {/* Mobile Cart */}
                <motion.button
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between w-full py-3 px-4 text-gray-700 font-medium hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-all"
                >
                  <div className="flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-3" />
                    Cart
                  </div>
                  {cartItemCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </motion.button>

                {/* Mobile Auth Buttons */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <Button variant="outline" size="sm" className="flex-1">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </Button>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                  onClick={openWhatsAppForOrder}
                >
                  Order Now
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
