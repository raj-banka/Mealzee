'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Star, Clock, Leaf } from 'lucide-react';
import { MENU_CATEGORIES, APPETIZERS, MAIN_COURSES, DESSERTS, BEVERAGES } from '@/lib/mockData';
import { useSimpleCart } from '@/hooks/useSimpleCart';
import Button from '@/components/ui/Button';
import { openWhatsAppForOrder, openWhatsAppForMenu } from '@/utils/whatsapp';
import { scrollToSection } from '@/utils/navigation';

const MenuSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('starters');
  const { addItem } = useSimpleCart();

  const getMenuItems = (categoryId: string) => {
    switch (categoryId) {
      case 'starters':
        return APPETIZERS;
      case 'mains':
        return MAIN_COURSES;
      case 'desserts':
        return DESSERTS;
      case 'beverages':
        return BEVERAGES;
      default:
        return APPETIZERS;
    }
  };

  const handleAddToCart = (item: any) => {
    addItem(item);
    // Show a brief success message instead of opening WhatsApp immediately
    // WhatsApp should only open when user explicitly wants to place order
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="menu" className="py-20 bg-gradient-to-b from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight font-poppins">
            Our Delicious
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"> Menu</span>
            <span className="inline-block ml-3">🍽️</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover mouth-watering dishes crafted with love and the finest ingredients
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {MENU_CATEGORIES.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 shadow-md'
              }`}
            >
              <span className="text-xl">{category.emoji}</span>
              <span>{category.name}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Menu Items Grid */}
        <motion.div
          key={activeCategory}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {getMenuItems(activeCategory).map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              {/* Item Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  {item.isVegetarian && (
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Leaf className="w-3 h-3 mr-1" />
                      Veg
                    </div>
                  )}
                  {item.isSignatureDish && (
                    <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      ⭐ Signature
                    </div>
                  )}
                </div>

                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-lg font-bold text-orange-600">₹{item.price}</span>
                </div>
              </div>

              {/* Item Details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {item.name}
                  </h3>
                  {item.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{item.rating}</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {item.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{item.preparationTime} min</span>
                  </div>
                  {item.spiceLevel && (
                    <div className="flex items-center space-x-1">
                      <span>🌶️</span>
                      <span>{item.spiceLevel}</span>
                    </div>
                  )}
                </div>

                {/* Dietary Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.dietaryTags?.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Add to Cart Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View Full Menu CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Button
            onClick={() => scrollToSection('menu')}
            variant="outline"
            size="lg"
            className="px-8 py-4 text-lg border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all duration-300"
          >
            View Complete Menu
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default MenuSection;
