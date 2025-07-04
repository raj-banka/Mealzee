'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

const HeroSection: React.FC = () => {

  return (
    <>
      {/* Enhanced Navbar */}
      <Navbar />

      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2"
            style={{
              objectFit: 'cover'
            }}
          >
            <source src="/vid.mp4" type="video/mp4" />
          </video>

          {/* Fallback gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-500 to-green-400 -z-10"></div>

          {/* Video overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Animated food elements */}
          <div className="absolute inset-0 opacity-20">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full"
            />
            <motion.div
              animate={{
                rotate: [360, 0],
                scale: [1.2, 1, 1.2]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full"
            />
          </div>


      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-10">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-16 h-16 bg-orange-400 rounded-full opacity-60 blur-sm"
        ></motion.div>
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-40 right-20 w-24 h-24 bg-red-400 rounded-full opacity-60 blur-sm"
        ></motion.div>
        <motion.div
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-32 left-1/4 w-20 h-20 bg-yellow-400 rounded-full opacity-60 blur-sm"
        ></motion.div>
      </div>



      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight"
          >
            Taste the Difference of
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-bold text-yellow-400 mb-6 tracking-tight"
          >
            Home-Cooked Love
          </motion.h2>

          {/* Enhanced Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-200 mb-8 font-medium max-w-3xl mx-auto leading-relaxed"
          >
            Experience the warmth of traditional home cooking with fresh ingredients,
            authentic flavors, and meals prepared with love - delivered fresh to your doorstep every day.
          </motion.p>

          {/* Key Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-2xl">🏠</span>
              <span className="text-white font-medium">Home-Style Cooking</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-2xl">🌱</span>
              <span className="text-white font-medium">Fresh Daily</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-2xl">🚚</span>
              <span className="text-white font-medium">Doorstep Delivery</span>
            </div>
          </motion.div>

          {/* Call to Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="max-w-md mx-auto"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Scroll to meal plans section
                const mealPlansSection = document.getElementById('meal-plans');
                if (mealPlansSection) {
                  mealPlansSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full py-5 px-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <span>🍽️ Explore Plans</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                →
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto"
          >
            <div className="text-center">
              <AnimatedCounter
                end={500}
                suffix="+"
                className="text-3xl font-bold text-yellow-400 mb-1"
              />
              <div className="text-sm text-gray-300">Happy Customers</div>
            </div>
            <div className="text-center">
              <AnimatedCounter
                end={1000}
                suffix="+"
                className="text-3xl font-bold text-yellow-400 mb-1"
              />
              <div className="text-sm text-gray-300">Meals Delivered</div>
            </div>
            <div className="text-center">
              <AnimatedCounter
                end={4.8}
                suffix="★"
                decimals={1}
                className="text-3xl font-bold text-yellow-400 mb-1"
              />
              <div className="text-sm text-gray-300">Average Rating</div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>

    </>
  );
};

export default HeroSection;
