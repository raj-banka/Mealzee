'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, Truck, CheckCircle } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Search,
      title: 'Browse & Search',
      description: 'Explore our delicious menu and find exactly what you\'re craving for your perfect meal.',
      color: 'from-olive-400 to-olive-500',
      delay: 0.1,
    },
    {
      icon: ShoppingCart,
      title: 'Add to Cart',
      description: 'Select your favorite dishes, customize them to your liking, and add them to your cart.',
      color: 'from-olive-500 to-olive-600',
      delay: 0.2,
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Sit back and relax while we bring your food fresh and hot directly to your doorstep.',
      color: 'from-olive-600 to-olive-700',
      delay: 0.3,
    },
    {
      icon: CheckCircle,
      title: 'Enjoy Your Meal',
      description: 'Receive your order and enjoy delicious, freshly prepared food from the comfort of your home.',
      color: 'from-olive-700 to-olive-800',
      delay: 0.4,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
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
    <section className="py-20 bg-gradient-to-b from-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight font-poppins">
            How It
            <span className="bg-gradient-to-r from-olive-500 to-olive-600 bg-clip-text text-transparent">Works</span>
            <span className="inline-block ml-3">⚡</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Getting your favorite food delivered is easier than ever. 
            Just follow these simple steps and enjoy!
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="relative text-center group"
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-olive-500 text-white rounded-full flex items-center justify-center text-sm font-bold z-10">
                  {index + 1}
                </div>

                {/* Icon Container */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                >
                  <Icon className="w-10 h-10 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-olive-500 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>

                {/* Connecting Line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent transform translate-x-4 -translate-y-1/2"></div>
                )}

                {/* Decorative Elements */}
                <div className="absolute -inset-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-olive-500 to-olive-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Order?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of satisfied customers and get your favorite food delivered today!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-olive-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Ordering Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
