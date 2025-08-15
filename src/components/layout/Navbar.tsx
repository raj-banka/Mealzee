'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Gift } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { NAV_LINKS, APP_CONFIG, Z_INDEX } from '@/lib/constants';
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
  const router = useRouter();
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigate to page
  const navigateToPage = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={false}
      animate={false}
      transition={undefined as any}
      className={`fixed top-0 left-0 right-0 w-full shadow-lg border-b border-green-700/30 transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-md bg-[#00430D]/95' : 'bg-[#00430D]'
      }`}
      style={{
        pointerEvents: 'auto',
        zIndex: Z_INDEX.navbar,
        position: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ pointerEvents: 'auto' }}>
        <div className="flex items-center justify-between h-16" style={{ pointerEvents: 'auto' }}>
          {/* Logo - Left Corner */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 flex-shrink-0"
          >
            {/* <div className="w-14 h-14 rounded-xl overflow-hidden shadow-lg bg-white p-1"> */}
              <img
                src="/mealzee_logo.png"
                alt="Mealzee Logo"
                className="w-40 h-34"
              />
            {/* </div> */}
            {/* <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-white transition-colors">
                {APP_CONFIG.name}
              </span>
              <span className="text-xs text-gray-200 transition-colors">
                {APP_CONFIG.description}
              </span>
            </div> */}
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <motion.button
                key={link.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigateToPage(link.href);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`font-medium transition-all duration-300 hover:text-emerald-300 cursor-pointer relative z-10 ${
                  pathname === link.href ? 'text-emerald-300' : 'text-white'
                }`}
                style={{ pointerEvents: 'auto' }}
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
              className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-white hover:bg-black/20 cursor-pointer relative z-10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Open referral modal
                if (isLoggedIn()) {
                  setIsReferralModalOpen(true);
                } else {
                  dispatch({ type: 'OPEN_AUTH_MODAL' });
                }
              }}
              style={{ pointerEvents: 'auto' }}
            >
              <Gift className="w-4 h-4" />
              <span className="text-sm font-medium">Refer & Earn</span>
            </motion.button>

            {/* Auth/User Section */}
            {isLoggedIn() ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsProfileModalOpen(true);
                }}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-white hover:bg-black/20 cursor-pointer relative z-10"
                style={{ pointerEvents: 'auto' }}
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {state.user?.fullName?.split(' ')[0] || 'Profile'}
                </span>
              </motion.button>
            ) : (
              <div className="relative z-10" style={{ pointerEvents: 'auto' }}>
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-gradient-to-r from-olive-500 to-olive-600 hover:from-olive-600 hover:to-olive-700 shadow-lg cursor-pointer"
                  onClick={() => dispatch({ type: 'OPEN_AUTH_MODAL' })}
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </div>
            )}


          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg transition-colors text-white hover:bg-black/20"
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
              className="md:hidden overflow-hidden rounded-b-2xl shadow-lg border-t border-green-700/30"
              style={{ backgroundColor: '#00430D' }}
            >
              <div className="px-4 py-6 space-y-4">
                {/* Mobile Navigation Links */}
                {NAV_LINKS.map((link) => (
                  <motion.button
                    key={link.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigateToPage(link.href);
                    }}
                    whileHover={{ x: 5 }}
                    className={`block w-full text-left py-3 px-4 font-medium hover:bg-black/20 hover:text-emerald-300 rounded-lg transition-all cursor-pointer ${
                      pathname === link.href ? 'text-emerald-300 bg-black/20' : 'text-white'
                    }`}
                    style={{ pointerEvents: 'auto' }}
                  >
                    {link.name}
                  </motion.button>
                ))}

                {/* Mobile Referral Button */}
                <motion.button
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between w-full py-3 px-4 text-white font-medium hover:bg-black/20 hover:text-emerald-300 rounded-lg transition-all cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(false);
                    if (isLoggedIn()) {
                      setIsReferralModalOpen(true);
                    } else {
                      dispatch({ type: 'OPEN_AUTH_MODAL' });
                    }
                  }}
                  style={{ pointerEvents: 'auto' }}
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
                    className="flex items-center justify-between w-full py-3 px-4 text-white font-medium hover:bg-black/20 hover:text-emerald-300 rounded-lg transition-all cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsOpen(false);
                      setIsProfileModalOpen(true);
                    }}
                    style={{ pointerEvents: 'auto' }}
                  >
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-3" />
                      {state.user?.fullName?.split(' ')[0] || 'Profile'}
                    </div>
                  </motion.button>
                ) : (
                  <div className="pt-4 border-t border-green-700" style={{ pointerEvents: 'auto' }}>
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full bg-gradient-to-r from-olive-500 to-olive-600 hover:from-olive-600 hover:to-olive-700 cursor-pointer"
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
