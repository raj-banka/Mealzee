'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Navigation, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { APP_CONFIG } from '@/lib/constants';
import { openWhatsAppForLocationOrder } from '@/utils/whatsapp';

const HeroSection: React.FC = () => {
  const [locationInput, setLocationInput] = useState('');
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<string>('');
  const [detectedLocation, setDetectedLocation] = useState<string>('');
  const router = useRouter();

  const handleLocationSubmit = (location: string) => {
    if (location.toLowerCase().includes('sector 4') && location.toLowerCase().includes('b.s. city')) {
      // Location matches service area - open WhatsApp with location
      openWhatsAppForLocationOrder(location);
    } else {
      // Location not in service area
      router.push('/not-available');
    }
  };

  const handleManualLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationInput.trim()) {
      handleLocationSubmit(locationInput);
    }
  };

  const getCurrentLocation = () => {
    setIsLocationLoading(true);

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      setIsLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // In a real app, you'd use reverse geocoding API to get the address
          // For demo purposes, we'll simulate the reverse geocoding process
          const mockAddress = await simulateReverseGeocoding(latitude, longitude);

          setUserLocation(mockAddress);
          setDetectedLocation(mockAddress);

          // Show the detected location to user before proceeding
          const confirmLocation = window.confirm(
            `We detected your location as: "${mockAddress}"\n\nIs this correct? Click OK to proceed or Cancel to enter manually.`
          );

          if (confirmLocation) {
            handleLocationSubmit(mockAddress);
          }
        } catch (error) {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter manually.');
        } finally {
          setIsLocationLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Unable to access your location. ';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }

        alert(errorMessage + ' Please enter your location manually.');
        setIsLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000,
      }
    );
  };

  // Simulate reverse geocoding (in real app, use Google Maps API or similar)
  const simulateReverseGeocoding = async (lat: number, lng: number): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demo purposes, we'll return different addresses based on coordinates
    // In a real app, you'd call a reverse geocoding API

    // Simulate service area check based on coordinates
    // These are mock coordinates for demonstration
    const serviceAreaBounds = {
      north: 28.7041,
      south: 28.7000,
      east: 77.1025,
      west: 77.1000
    };

    const isInServiceArea = (
      lat >= serviceAreaBounds.south &&
      lat <= serviceAreaBounds.north &&
      lng >= serviceAreaBounds.west &&
      lng <= serviceAreaBounds.east
    );

    if (isInServiceArea) {
      return 'Sector 4, B.S. City'; // Service area location
    } else {
      // Return a location outside service area for demo
      return 'Sector 10, Delhi'; // Outside service area
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Background with Parallax */}
      <div className="absolute inset-0 z-0">
        {/* Primary Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-yellow-600"></div>

        {/* Overlay for better contrast */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Animated Geometric Shapes */}
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

        {/* Floating Food Emojis with Enhanced Animation */}
        <div className="absolute inset-0 opacity-15">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-20 text-6xl"
          >
            🍕
          </motion.div>
          <motion.div
            animate={{
              y: [0, 15, 0],
              rotate: [0, -5, 5, 0]
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute top-40 right-32 text-5xl"
          >
            🍔
          </motion.div>
          <motion.div
            animate={{
              y: [0, -25, 0],
              x: [0, 10, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-32 left-32 text-4xl"
          >
            🍜
          </motion.div>
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
            className="absolute bottom-20 right-20 text-5xl"
          >
            🍱
          </motion.div>
          <motion.div
            animate={{
              y: [0, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute top-60 left-1/2 text-3xl"
          >
            🥘
          </motion.div>
          <motion.div
            animate={{
              y: [0, 18, 0],
              x: [0, -8, 0]
            }}
            transition={{
              duration: 4.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.5
            }}
            className="absolute bottom-60 right-1/3 text-4xl"
          >
            🍛
          </motion.div>
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

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Brand Name */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight"
            style={{ fontFamily: 'Poppins, Inter, system-ui, sans-serif' }}
          >
            <span className="bg-gradient-to-r from-orange-300 via-red-300 to-yellow-300 bg-clip-text text-transparent">
              Mealzee
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-white/90 mb-12 font-medium"
          >
            Better food for more people 🍽️
          </motion.p>

          {/* Location Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl"
          >
            {/* Manual Location Input */}
            <form onSubmit={handleManualLocationSubmit} className="mb-6">
              <div className="relative group">
                <MapPin className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-orange-400 z-10" />
                <input
                  type="text"
                  placeholder="Enter your delivery location"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full pl-16 pr-36 py-5 text-lg bg-white/95 backdrop-blur-sm border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-orange-300/50 focus:border-orange-400 transition-all duration-300 placeholder-gray-500 shadow-lg hover:shadow-xl focus:shadow-2xl group-hover:bg-white"
                />
                <motion.button
                  type="submit"
                  disabled={!locationInput.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl ${
                    locationInput.trim()
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 cursor-pointer'
                      : 'bg-gray-400 cursor-not-allowed opacity-0'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Search className="w-5 h-5" />
                    <span>Find Food</span>
                  </span>
                </motion.button>
              </div>
            </form>

            {/* OR Divider */}
            <div className="flex items-center mb-8">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="flex-1 h-px bg-gradient-to-r from-transparent via-white/40 to-white/40"
              />
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="px-6 py-2 text-white/90 font-semibold bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-sm"
              >
                OR
              </motion.span>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="flex-1 h-px bg-gradient-to-l from-transparent via-white/40 to-white/40"
              />
            </div>

            {/* Current Location Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={getCurrentLocation}
              disabled={isLocationLoading}
              className={`w-full py-5 px-8 backdrop-blur-md border-2 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl ${
                isLocationLoading
                  ? 'bg-white/20 border-white/30 text-white/70 cursor-not-allowed'
                  : 'bg-white/15 border-white/30 text-white hover:bg-white/25 hover:border-white/40 hover:text-white'
              }`}
            >
              {isLocationLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span>📍 Detecting your location...</span>
                </>
              ) : (
                <>
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Navigation className="w-6 h-6" />
                  </motion.div>
                  <span>📍 Use my current location</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-orange-300"
                  >
                    →
                  </motion.div>
                </>
              )}
            </motion.button>

            {/* Helper Text */}
            {!isLocationLoading && !detectedLocation && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-center text-white/70 text-sm mt-3"
              >
                We'll check if we deliver to your area
              </motion.p>
            )}

            {/* Detected Location Display */}
            {detectedLocation && !isLocationLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 rounded-xl text-white"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">
                    📍 Detected location: <strong>{detectedLocation}</strong>
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
