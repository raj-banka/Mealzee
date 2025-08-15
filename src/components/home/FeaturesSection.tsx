'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Leaf,
  Heart,
  Cake,
  Gift,
  Sparkles,
  Star,
  ToggleLeft,
  ToggleRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  description: string;
  image?: string;
}

const features: Feature[] = [
  {
    id: 'healthy-meals',
    title: 'Healthy & Nutritious',
    subtitle: 'Fresh Daily',
    icon: (
      <div className="relative">
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Leaf className="w-10 h-10 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
          <Star className="w-4 h-4 text-white" />
        </div>
      </div>
    ),
    bgColor: 'bg-gradient-to-br from-green-50 via-green-100 to-emerald-50',
    iconColor: 'text-green-600',
    description: 'Carefully crafted meals with fresh ingredients and balanced nutrition for your healthy lifestyle',
    image: '/images/healthy_nutritious.jpg'
  },
  {
    id: 'birthday-surprise',
    title: 'Birthday Surprises',
    subtitle: 'Special Treats',
    icon: (
      <div className="relative">
        <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Cake className="w-10 h-10 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      </div>
    ),
    bgColor: 'bg-gradient-to-br from-pink-50 via-pink-100 to-rose-50',
    iconColor: 'text-pink-600',
    description: 'Special birthday treats and personalized surprises to make your day extra memorable',
    image: '/images/birthday_surprise.jpg'
  },
  {
    id: 'gift-cards',
    title: 'Gift Cards',
    subtitle: 'Perfect Gifts',
    icon: (
      <div className="relative">
        <div className="w-20 h-20 bg-gradient-to-br from-olive-400 to-olive-500 rounded-2xl flex items-center justify-center shadow-lg">
          <Gift className="w-10 h-10 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-md">
          <Heart className="w-4 h-4 text-white" />
        </div>
      </div>
    ),
    bgColor: 'bg-gradient-to-br from-olive-50 via-olive-100 to-olive-200',
    iconColor: 'text-yellow-600',
    description: 'Perfect gifts for your loved ones - meal subscriptions they will absolutely love',
    image: '/images/gift_card.jpg'
  },
  {
    id: 'festival-special',
    title: 'Festival Specials',
    subtitle: 'Traditional Flavors',
    icon: (
      <div className="relative">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-olive-400 rounded-full flex items-center justify-center shadow-md">
          <Star className="w-4 h-4 text-white" />
        </div>
      </div>
    ),
    bgColor: 'bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-50',
    iconColor: 'text-purple-600',
    description: 'Celebrate festivals with traditional and special festive meals crafted with authentic flavors',
    image: '/images/festival_special.jpg'
  },
  {
    id: 'joining-gift',
    title: 'Welcome Bonus',
    subtitle: 'New Member Perks',
    icon: (
      <div className="relative">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Gift className="w-10 h-10 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center shadow-md">
          <Star className="w-4 h-4 text-white" />
        </div>
      </div>
    ),
    bgColor: 'bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50',
    iconColor: 'text-blue-600',
    description: 'Welcome bonus and special offers for new Mealzee family members to start your journey',
    image: '/images/joining_gift.jpg'
  },
  {
    id: 'refer-earn',
    title: 'Refer & Earn',
    subtitle: 'Share & Save',
    icon: (
      <div className="relative">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Gift className="w-10 h-10 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      </div>
    ),
    bgColor: 'bg-gradient-to-br from-amber-50 via-amber-100 to-yellow-50',
    iconColor: 'text-amber-600',
    description: 'Invite friends and earn exclusive rewards and discounts on your meals',
    image: '/images/refer_earn.jpg'
  }
];

const FeaturesSection: React.FC = () => {
  const [vegMode, setVegMode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [flipMap, setFlipMap] = useState<Record<string, boolean>>({});

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Removed old horizontal scroll logic for new static grid layout

  return (
    <section className="py-20 bg-gradient-to-br from-olive-100 to-olive-50 overflow-hidden">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What's waiting for
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-olive-600 to-olive-700 bg-clip-text text-transparent mb-6">
            you on mealzee
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get ready for delicious food made by expert chefs — and plenty of extra surprises
          </p>
        </motion.div>
      </div>

      {/* Features Grid - mobile-first 2x3 layout like reference */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {features.map((feature, index) => {
            const key = `${feature.id}-${index}`;
            const isFlipped = !!flipMap[key];
            const toggle = () => setFlipMap((m) => ({ ...m, [key]: !m[key] }));

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
                viewport={{ once: true }}
                className="w-full"
              >
                <div className="relative h-[200px] sm:h-[220px] md:h-[240px] lg:h-[220px] xl:h-[240px]" style={{ perspective: '1000px' }}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={toggle}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggle()}
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: `rotateY(${isFlipped ? 180 : 0}deg)`,
                      transition: 'transform 550ms',
                    }}
                  >
                    {/* Front - image + title, styled like reference */}
                    <div
                      className="absolute inset-0 rounded-2xl bg-white/90 backdrop-blur-[1px] border-2 border-green-800 shadow-[0_6px_0_#0f3e18] p-4 flex flex-col items-center"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="w-full aspect-square rounded-xl bg-white flex items-center justify-center overflow-hidden">
                        {feature.image ? (
                          <img src={feature.image} alt={feature.title} className="max-h-[70%] max-w-[70%] object-contain" />
                        ) : (
                          <div className="text-4xl">🍽️</div>
                        )}
                      </div>
                      <div className="mt-3">
                        <p className="text-center text-[15px] md:text-base font-semibold text-green-900">{feature.title}</p>
                      </div>
                    </div>

                    {/* Back - only text (no image) */}
                    <div
                      className="absolute inset-0 rounded-2xl bg-white/95 border-2 border-green-800 shadow-[0_6px_0_#0f3e18] p-4 flex flex-col justify-center"
                      style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                    >
                      <h4 className="text-center text-base md:text-lg font-bold text-green-900 mb-2">{feature.title}</h4>
                      <p className="text-center text-sm md:text-base text-gray-700 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-olive-100 to-olive-200 px-6 py-3 rounded-full">
            <Sparkles className="w-5 h-5 text-olive-600" />
            <p className="text-lg font-semibold text-olive-700">
              ...and a lot more surprises waiting for you!
            </p>
            <Sparkles className="w-5 h-5 text-olive-600" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
