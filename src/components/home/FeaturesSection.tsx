'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Leaf,
  Heart,
  Cake,
  Gift,
  Sparkles,
  Star,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  description: string;
}

const features: Feature[] = [
  {
    id: 'veg-nonveg',
    title: 'Veg & Non-Veg Mode',
    icon: (
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-4 bg-green-500 rounded-full flex items-center justify-end pr-1">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-4 bg-gray-300 rounded-full flex items-center justify-start pl-1">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    ),
    bgColor: 'bg-gradient-to-br from-green-100 to-green-200',
    iconColor: 'text-green-600',
    description: 'Switch between vegetarian and non-vegetarian options easily'
  },
  {
    id: 'healthy',
    title: 'Healthy',
    icon: (
      <div className="relative">
        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
          <Leaf className="w-6 h-6 text-green-600" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    ),
    bgColor: 'bg-gradient-to-br from-blue-100 to-blue-200',
    iconColor: 'text-blue-600',
    description: 'Nutritious meals prepared with fresh, organic ingredients'
  },
  {
    id: 'birthday',
    title: 'Birthday Surprise',
    icon: (
      <div className="relative">
        <div className="w-12 h-8 bg-yellow-400 rounded-t-lg"></div>
        <div className="w-12 h-4 bg-orange-400 rounded-b-lg"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
          <div className="w-1 h-3 bg-blue-400"></div>
          <div className="w-1 h-3 bg-blue-400 ml-2"></div>
          <div className="w-1 h-3 bg-blue-400 ml-4"></div>
        </div>
      </div>
    ),
    bgColor: 'bg-gradient-to-br from-pink-100 to-pink-200',
    iconColor: 'text-pink-600',
    description: 'Special birthday treats and personalized meals on your special day'
  },
  {
    id: 'gift-cards',
    title: 'Gift Cards',
    icon: (
      <div className="flex space-x-1">
        <div className="w-8 h-10 bg-yellow-400 rounded-lg relative">
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full"></div>
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-red-500"></div>
        </div>
        <div className="w-6 h-8 bg-blue-400 rounded-lg relative">
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-red-500"></div>
        </div>
      </div>
    ),
    bgColor: 'bg-gradient-to-br from-yellow-100 to-yellow-200',
    iconColor: 'text-yellow-600',
    description: 'Perfect gifts for your loved ones - meal subscriptions they\'ll love'
  },
  {
    id: 'festival',
    title: 'Festival Special',
    icon: (
      <div className="relative">
        <div className="w-10 h-6 bg-yellow-400 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-4 bg-orange-500 rounded-full"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
          <div className="w-1 h-2 bg-blue-400"></div>
        </div>
        <div className="absolute -top-1 left-2">
          <div className="w-1 h-1 bg-yellow-300 rounded-full"></div>
        </div>
        <div className="absolute -top-1 right-2">
          <div className="w-1 h-1 bg-yellow-300 rounded-full"></div>
        </div>
        <div className="absolute top-6 left-1">
          <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
        </div>
        <div className="absolute top-6 right-1">
          <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
        </div>
      </div>
    ),
    bgColor: 'bg-gradient-to-br from-purple-100 to-purple-200',
    iconColor: 'text-purple-600',
    description: 'Celebrate festivals with traditional and special festive meals'
  },
  {
    id: 'joining-gift',
    title: 'Joining Gift',
    icon: (
      <div className="relative">
        <div className="w-10 h-8 bg-yellow-400 rounded-lg relative">
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-red-500 rounded-full"></div>
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-red-500"></div>
          <div className="absolute bottom-1 left-1 right-1 h-1 bg-white rounded text-xs flex items-center justify-center">
            <span className="text-[8px] text-gray-800 font-bold">WELCOME</span>
          </div>
        </div>
      </div>
    ),
    bgColor: 'bg-gradient-to-br from-orange-100 to-orange-200',
    iconColor: 'text-orange-600',
    description: 'Welcome bonus and special offers for new Mealzee family members'
  }
];

const FeaturesSection: React.FC = () => {
  const [vegMode, setVegMode] = useState(true);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">
            What's waiting for
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-green-600 mb-6">
            you on mealzee
          </h3>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            Get ready for delicious food made by expert chefs — and plenty of extra surprises
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`${feature.bgColor} rounded-3xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer`}
            >
              <div className="mb-6">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
              </div>

              <h4 className="text-lg font-bold text-gray-800">
                {feature.title}
              </h4>
            </motion.div>
          ))}
        </div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xl font-semibold text-green-600">
            ...and a lot more
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
