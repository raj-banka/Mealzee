'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MEAL_CATEGORIES } from '@/lib/constants';

const MealCategories: React.FC = () => {
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
    <section className="py-20 bg-gradient-to-b from-teal-50 to-emerald-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 text-8xl">🍳</div>
        <div className="absolute top-40 right-32 text-6xl">🍱</div>
        <div className="absolute bottom-32 left-32 text-7xl">🍽️</div>
        <div className="absolute bottom-20 right-20 text-5xl">🥘</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight font-poppins">
            Meal Categories That
            <span className="bg-gradient-to-r from-olive-500 to-olive-600 bg-clip-text text-transparent"> Delight</span>
            <span className="inline-block ml-3">🍽️</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From energizing breakfasts to satisfying dinners, explore our carefully curated meal categories
            designed to make every moment delicious.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {MEAL_CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -15,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.95 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-3xl aspect-square shadow-2xl hover:shadow-3xl transition-all duration-700 bg-white">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-95`}></div>

                {/* Animated Pattern Overlay */}
                <div className="absolute inset-0 opacity-20">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                      delay: index * 0.5
                    }}
                    className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded-full"
                  ></motion.div>
                  <motion.div
                    animate={{
                      scale: [1.2, 1, 1.2],
                      rotate: [360, 180, 0]
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "linear",
                      delay: index * 0.3
                    }}
                    className="absolute top-8 right-8 w-4 h-4 border border-white rounded-full"
                  ></motion.div>
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      rotate: [0, 270, 360]
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear",
                      delay: index * 0.7
                    }}
                    className="absolute bottom-8 left-8 w-6 h-6 border border-white rounded-full"
                  ></motion.div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-6">
                  <motion.div
                    animate={{
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.15, 1]
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.4
                    }}
                    className="text-7xl mb-6 filter drop-shadow-lg"
                  >
                    {category.emoji}
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-3 text-center drop-shadow-md">
                    {category.name}
                  </h3>

                  <p className="text-sm text-center opacity-95 leading-relaxed drop-shadow-sm">
                    {category.description}
                  </p>
                </div>

                {/* Enhanced Hover Effects */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <motion.div
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  ></motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-3 border border-olive-500 text-olive-500 font-medium rounded-lg hover:bg-olive-500 hover:text-white transition-colors duration-300"
          >
            View Full Menu
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

// Helper function to get emoji for meal category
function getMealCategoryEmoji(category: string): string {
  const emojiMap: { [key: string]: string } = {
    'Breakfast': '🌅',
    'Lunch': '🍛',
    'Dinner': '🌙',
    'Subscription Plans': '📅',
  };

  return emojiMap[category] || '🍽️';
}

export default MealCategories;
