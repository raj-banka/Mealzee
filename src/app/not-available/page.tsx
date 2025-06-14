'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

const NotAvailablePage: React.FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-pink-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
            className="absolute top-20 left-10 w-16 h-16 bg-orange-300 rounded-full opacity-30 blur-sm"
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
            className="absolute top-40 right-20 w-24 h-24 bg-pink-300 rounded-full opacity-30 blur-sm"
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
            className="absolute bottom-32 left-1/4 w-20 h-20 bg-yellow-300 rounded-full opacity-30 blur-sm"
          ></motion.div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          {/* Empty Plate Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-8"
          >
            <div className="w-48 h-48 mx-auto relative">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full bg-white rounded-full shadow-2xl border-8 border-gray-200 flex items-center justify-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="text-6xl"
                >
                  🍽️
                </motion.div>
              </motion.div>
              
              {/* Floating Map Pin */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 10, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -top-4 -right-4 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <MapPin className="w-6 h-6 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            Oops! We're not cooking
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              near you... yet!
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-xl text-gray-600 mb-8 leading-relaxed"
          >
            We're working hard to expand our delicious reach. 
            <br />
            Stay hungry, we'll be there soon! 🚀
          </motion.p>

          {/* Features Coming Soon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <Clock className="w-8 h-8 text-orange-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Coming Soon</h3>
              <p className="text-sm text-gray-600">We're expanding to new areas every month</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Quality Food</h3>
              <p className="text-sm text-gray-600">Same great taste, coming to your area</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <MapPin className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Quick delivery when we arrive</p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={handleGoBack}
              variant="primary"
              size="lg"
              className="px-8 py-4 text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back Home
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
              onClick={() => {
                // In a real app, this could open a notification signup form
                alert('We\'ll notify you when Mealzee arrives in your area!');
              }}
            >
              Notify Me
            </Button>
          </motion.div>

          {/* Footer Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-12 text-gray-500 text-sm"
          >
            Currently serving: <span className="font-semibold text-orange-600">Sector 4, B.S. City</span>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotAvailablePage;
