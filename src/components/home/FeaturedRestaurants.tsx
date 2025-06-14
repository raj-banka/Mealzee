'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Clock, Truck, Heart } from 'lucide-react';
import { todaysFeaturedMeals } from '@/lib/mockData';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';

const FeaturedMeals: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Today's Featured Meals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover today's special dishes from Mama's Kitchen,
            prepared fresh with love and traditional recipes.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {todaysFeaturedMeals.map((meal) => (
            <motion.div
              key={meal.id}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Meal Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={meal.image || 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400'}
                    alt={meal.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>

                  {/* Favorite Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-md"
                  >
                    <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                  </motion.button>

                  {/* Meal Type Badge */}
                  <div className="absolute top-4 left-4 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {meal.mealType}
                  </div>

                  {/* Signature Dish Badge */}
                  {meal.isSignatureDish && (
                    <div className="absolute bottom-4 left-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      ⭐ Signature
                    </div>
                  )}

                  {/* Vegetarian Badge */}
                  {meal.isVegetarian && (
                    <div className="absolute bottom-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      🌱 Veg
                    </div>
                  )}
                </div>

                {/* Meal Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
                      {meal.name}
                    </h3>
                    <div className="text-lg font-bold text-orange-500">
                      {formatPrice(meal.price)}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {meal.description}
                  </p>

                  {/* Dietary Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {meal.dietaryTags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Meal Details */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{meal.preparationTime} min</span>
                    </div>
                    {meal.spiceLevel && (
                      <div className="flex items-center space-x-1">
                        <span>🌶️</span>
                        <span>{meal.spiceLevel}</span>
                      </div>
                    )}
                  </div>

                  {/* Ingredients Preview */}
                  {meal.ingredients && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Main ingredients:</p>
                      <p className="text-sm text-gray-600">
                        {meal.ingredients.slice(0, 3).join(', ')}
                        {meal.ingredients.length > 3 && '...'}
                      </p>
                    </div>
                  )}

                  {/* Order Button */}
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                  >
                    Add to Cart
                  </Button>
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
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/menu">
            <Button variant="outline" size="lg" className="px-8">
              View Full Menu
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedMeals;
