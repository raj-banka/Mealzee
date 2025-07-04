'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Gift, Heart, Leaf } from 'lucide-react';
import { SPECIAL_OFFERS } from '@/lib/constants';
import { openWhatsAppForSpecialOffer, openWhatsAppForOrder } from '@/utils/whatsapp';
import { showAllOffers } from '@/utils/navigation';

const SpecialsSection: React.FC = () => {
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
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'veg-meals':
        return <Leaf className="w-8 h-8" />;
      case 'birthday-special':
        return <Gift className="w-8 h-8" />;
      case 'gift-vouchers':
        return <Heart className="w-8 h-8" />;
      default:
        return <Gift className="w-8 h-8" />;
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white via-olive-50 to-olive-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 text-9xl"
        >
          🎁
        </motion.div>
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 text-8xl"
        >
          ✨
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block mb-6"
          >
            <span className="text-6xl">🎁</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight font-poppins">
            Special
            <span className="bg-gradient-to-r from-olive-500 to-olive-600 bg-clip-text text-transparent">Offers</span>
            <span className="text-gray-900"> & Deals</span>
            <span className="inline-block ml-3">🎁</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Unlock amazing savings and exclusive deals that make every meal more delightful.
            Limited time offers you don't want to miss!
          </p>
        </motion.div>

        {/* Desktop: Horizontal Scroll, Mobile: Grid */}
        <div className="hidden md:block">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {SPECIAL_OFFERS.map((offer, index) => (
              <motion.div
                key={offer.id}
                variants={cardVariants}
                whileHover={{
                  scale: 1.05,
                  y: -15,
                  transition: { duration: 0.4, ease: "easeOut" }
                }}
                className="group cursor-pointer flex-shrink-0 w-80"
              >
                <div className="relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 h-96 bg-white">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-115"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${offer.color} opacity-85`}></div>
                  </div>

                  {/* Discount Badge */}
                  <div className="absolute top-6 right-6 z-20">
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.3
                      }}
                      className="bg-yellow-400 text-yellow-900 px-3 py-2 rounded-2xl font-bold text-sm shadow-lg"
                    >
                      {offer.discount}
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between p-8 text-white">
                    <div>
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.15, 1]
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.5
                        }}
                        className="w-18 h-18 bg-white/25 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 shadow-xl border border-white/20"
                      >
                        <div className="text-white text-2xl">
                          {getIcon(offer.id)}
                        </div>
                      </motion.div>

                      <h3 className="text-2xl font-bold mb-4 drop-shadow-lg">
                        {offer.title}
                      </h3>

                      <p className="text-lg opacity-95 leading-relaxed drop-shadow-md">
                        {offer.description}
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ x: 8, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openWhatsAppForSpecialOffer(offer.title)}
                      className="flex items-center space-x-3 bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl text-white font-semibold group-hover:bg-white/30 transition-all duration-300 border border-white/20 shadow-lg"
                    >
                      <span>Claim Offer</span>
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Enhanced Hover Effects */}
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl"></div>

                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <motion.div
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                    ></motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mobile Grid */}
        <div className="md:hidden">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6"
          >
            {SPECIAL_OFFERS.map((offer, index) => (
              <motion.div
                key={offer.id}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 h-64">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${offer.color} opacity-80`}></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between p-6 text-white">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                        {getIcon(offer.id)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">
                          {offer.title}
                        </h3>
                        <p className="text-sm opacity-90">
                          {offer.description}
                        </p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ x: 5 }}
                      className="flex items-center space-x-2 text-white font-semibold group-hover:text-yellow-200 transition-colors self-start"
                    >
                      <span>Explore Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={showAllOffers}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-olive-500 to-olive-600 text-white font-semibold rounded-2xl hover:from-olive-600 hover:to-olive-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span className="mr-2">View All Offers</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default SpecialsSection;
