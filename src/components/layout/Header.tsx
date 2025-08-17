'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  ChevronDown 
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useApp } from '@/contexts/AppContext';
import Button from '@/components/ui/Button';
// Removed LocationPicker import as we no longer use GPS/map functionality
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const { getItemCount } = useCart();
  const { state, login } = useApp();

  const cartItemCount = getItemCount();
  const userAddress = state.user?.address;

  // Handle address update (removed location coordinates)
  const handleAddressUpdate = (addressData: {
    fullAddress: string;
    city: string;
    sector: string;
  }) => {
    if (state.user) {
      // Update user data with new address
      login({
        fullName: state.user.fullName,
        phone: state.user.phone,
        address: addressData.fullAddress,
        sector: addressData.sector,
        city: addressData.city,
        dietaryPreference: state.user.dietaryPreference,
        dateOfBirth: state.user.dateOfBirth,
        referralCode: state.user.referralCode,
        referralName: state.user.referralName,
      });
    }
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Subscriptions', href: '/subscriptions' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-olive-50 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-12 h-12 rounded-xl overflow-hidden shadow-lg bg-white p-1"
            >
                <img
                src="/logo_resized_for_web-removebg-preview.png"
                alt="Mealzee Logo"
                className="w-30 h-18 object-contain"
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900 tracking-tight">Mealzee</span>
              <span className="text-xs text-gray-500 hidden sm:block">Better food for more people</span>
            </div>
          </Link>

          {/* Location Selector - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MapPin className="w-5 h-5 text-olive-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Deliver to</p>
                <p className="text-xs text-gray-500 truncate max-w-32">
                  {userAddress || 'Choose location'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for meals or dishes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-olive-500 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-gray-700 hover:text-olive-500 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-olive-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </motion.button>
            </Link>

            {/* User Menu */}
            <div className="relative">
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-olive-500 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4 border-t border-gray-200">
            {/* Mobile Location */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MapPin className="w-5 h-5 text-olive-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Deliver to</p>
                <p className="text-xs text-gray-500">
                  {userAddress || 'Choose location'}
                </p>
              </div>
            </button>

            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search meals or dishes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent"
              />
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-olive-500 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </motion.div>
      </div>

      {/* Location functionality removed - address is now manually entered during registration */}
    </header>
  );
};

export default Header;
