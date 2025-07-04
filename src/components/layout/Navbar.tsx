'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Gift } from 'lucide-react';
import { NAV_LINKS, APP_CONFIG } from '@/lib/constants';
import Button from '@/components/ui/Button';

import { useApp } from '@/contexts/AppContext';
import UserProfileModal from '@/components/user/UserProfileModal';
import ReferralModal from '@/components/user/ReferralModal';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const { state, dispatch, isLoggedIn } = useApp();

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
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/20 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left Corner */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 flex-shrink-0"
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
              <img
                src="/logo.jpg"
                alt="Mealzee Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-gray-900 transition-colors">
                {APP_CONFIG.name}
              </span>
              <span className="text-xs text-gray-500 transition-colors">
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
                className="font-medium transition-all duration-300 hover:text-emerald-500 text-gray-700"
              >
                {link.name}
              </motion.button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Referral Button - Always visible */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
              onClick={() => {
                // Open referral modal
                if (isLoggedIn()) {
                  setIsReferralModalOpen(true);
                } else {
                  dispatch({ type: 'OPEN_AUTH_MODAL' });
                }
              }}
            >
              <Gift className="w-4 h-4" />
              <span className="text-sm font-medium">Refer & Earn</span>
            </motion.button>

            {/* Auth/User Section */}
            {isLoggedIn() ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {state.user?.fullName?.split(' ')[0] || 'Profile'}
                </span>
              </motion.button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg"
                onClick={() => dispatch({ type: 'OPEN_AUTH_MODAL' })}
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-lg"
              onClick={() => {
                // Scroll to meal plans section first
                const mealPlansSection = document.getElementById('meal-plans');
                if (mealPlansSection) {
                  mealPlansSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Order Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
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

                {/* Mobile Referral Button */}
                <motion.button
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between w-full py-3 px-4 text-gray-700 font-medium hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-all"
                  onClick={() => {
                    setIsOpen(false);
                    if (isLoggedIn()) {
                      setIsReferralModalOpen(true);
                    } else {
                      dispatch({ type: 'OPEN_AUTH_MODAL' });
                    }
                  }}
                >
                  <div className="flex items-center">
                    <Gift className="w-5 h-5 mr-3" />
                    Refer & Earn
                  </div>
                </motion.button>

                {/* Mobile Auth/User Buttons */}
                {isLoggedIn() ? (
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between w-full py-3 px-4 text-gray-700 font-medium hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-all"
                    onClick={() => {
                      setIsOpen(false);
                      setIsProfileModalOpen(true);
                    }}
                  >
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-3" />
                      {state.user?.fullName?.split(' ')[0] || 'Profile'}
                    </div>
                  </motion.button>
                ) : (
                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      onClick={() => {
                        setIsOpen(false);
                        dispatch({ type: 'OPEN_AUTH_MODAL' });
                      }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </div>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                  onClick={() => {
                    setIsOpen(false);
                    // Scroll to meal plans section first
                    const mealPlansSection = document.getElementById('meal-plans');
                    if (mealPlansSection) {
                      mealPlansSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Order Now
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Referral Modal */}
      <ReferralModal
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
      />
    </motion.nav>
  );
};

export default Navbar;
