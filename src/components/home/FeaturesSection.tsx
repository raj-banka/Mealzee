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
    description: 'Carefully crafted meals with fresh ingredients and balanced nutrition for your healthy lifestyle'
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
    description: 'Special birthday treats and personalized surprises to make your day extra memorable'
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
    description: 'Perfect gifts for your loved ones - meal subscriptions they will absolutely love'
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
    description: 'Celebrate festivals with traditional and special festive meals crafted with authentic flavors'
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
    description: 'Welcome bonus and special offers for new Mealzee family members to start your journey'
  }
];

const FeaturesSection: React.FC = () => {
  const [vegMode, setVegMode] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [userInteracting, setUserInteracting] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check scroll position for arrow visibility and current index
  const checkScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );

      // Calculate current index for mobile
      if (isMobile) {
        const cardWidth = 320; // Width of each card + gap
        const newIndex = Math.round(container.scrollLeft / cardWidth);
        setCurrentIndex(newIndex);
      }
    }
  }, [isMobile]);

  // Manual scroll functions
  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      if (isMobile) {
        // Snap to previous card
        const cardWidth = 320;
        const newIndex = Math.max(0, currentIndex - 1);
        container.scrollTo({ left: newIndex * cardWidth, behavior: 'smooth' });
        setCurrentIndex(newIndex);
      } else {
        container.scrollBy({ left: -320, behavior: 'smooth' });
      }
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      if (isMobile) {
        // Snap to next card
        const cardWidth = 320;
        const maxIndex = features.length - 1;
        const newIndex = Math.min(maxIndex, currentIndex + 1);
        container.scrollTo({ left: newIndex * cardWidth, behavior: 'smooth' });
        setCurrentIndex(newIndex);
      } else {
        container.scrollBy({ left: 320, behavior: 'smooth' });
      }
    }
  };

  // Flick to specific card (for mobile)
  const scrollToCard = (index: number) => {
    const container = scrollContainerRef.current;
    if (container && isMobile) {
      const cardWidth = 320;
      container.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
      setCurrentIndex(index);
    }
  };

  // Touch event handlers for mobile flick
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMobile) {
      setTouchStart(e.targetTouches[0].clientX);
      setUserInteracting(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isMobile) {
      setTouchEnd(e.targetTouches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    if (!isMobile || !touchStart || !touchEnd) {
      setUserInteracting(false);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < features.length - 1) {
      scrollToCard(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      scrollToCard(currentIndex - 1);
    }

    // Reset user interaction after a delay
    setTimeout(() => setUserInteracting(false), 1000);
  };

  // Auto-scroll functionality for desktop
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isMobile) return; // Use separate mobile auto-flick

    let animationId: number;
    let direction = 1; // 1 for right, -1 for left
    const scrollSpeed = 1; // pixels per frame
    const pauseDuration = 2000; // pause for 2 seconds at each end

    const autoScroll = () => {
      if (!isHovered && container) {
        const currentScroll = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;

        // Check if we've reached the end (right side)
        if (currentScroll >= maxScroll - 5 && direction === 1) {
          // Pause, then change direction to left
          setTimeout(() => {
            direction = -1;
          }, pauseDuration);
        }
        // Check if we've reached the beginning (left side)
        else if (currentScroll <= 5 && direction === -1) {
          // Pause, then change direction to right
          setTimeout(() => {
            direction = 1;
          }, pauseDuration);
        }
        // Continue scrolling in current direction
        else {
          container.scrollLeft = currentScroll + (scrollSpeed * direction);
        }

        checkScrollPosition();
      }

      animationId = requestAnimationFrame(autoScroll);
    };

    // Start auto-scroll after initial delay
    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(autoScroll);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isHovered, checkScrollPosition, isMobile]);

  // Auto-flick functionality for mobile
  useEffect(() => {
    if (!isMobile) return;

    const autoFlickInterval = setInterval(() => {
      if (!isHovered && !userInteracting) {
        const nextIndex = currentIndex >= features.length - 1 ? 0 : currentIndex + 1;
        const container = scrollContainerRef.current;
        if (container) {
          const cardWidth = 320;
          container.scrollTo({ left: nextIndex * cardWidth, behavior: 'smooth' });
          setCurrentIndex(nextIndex);
        }
      }
    }, 3000); // Auto-flick every 3 seconds

    return () => clearInterval(autoFlickInterval);
  }, [isMobile, currentIndex, isHovered, userInteracting]);

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition();

      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, [checkScrollPosition]);

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

      {/* Full Width Horizontal Auto-Scrollable Features */}
      <div className="relative w-full overflow-hidden">
        {/* Manual Scroll Arrows - Hidden on Mobile */}
        {!isMobile && (
          <>
            <motion.button
              onClick={scrollLeft}
              className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
                canScrollLeft ? 'opacity-100 hover:bg-white hover:scale-110' : 'opacity-50 cursor-not-allowed'
              }`}
              whileHover={{ scale: canScrollLeft ? 1.1 : 1 }}
              whileTap={{ scale: canScrollLeft ? 0.95 : 1 }}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="w-6 h-6 text-olive-600" />
            </motion.button>

            <motion.button
              onClick={scrollRight}
              className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
                canScrollRight ? 'opacity-100 hover:bg-white hover:scale-110' : 'opacity-50 cursor-not-allowed'
              }`}
              whileHover={{ scale: canScrollRight ? 1.1 : 1 }}
              whileTap={{ scale: canScrollRight ? 0.95 : 1 }}
              disabled={!canScrollRight}
            >
              <ChevronRight className="w-6 h-6 text-olive-600" />
            </motion.button>
          </>
        )}

        {/* Auto-Scrollable Container - Full Width */}
        <div
          ref={scrollContainerRef}
          className={`flex gap-8 overflow-x-auto overflow-y-hidden scrollbar-hide auto-scroll-container pb-4 ${
            isMobile ? 'snap-x snap-mandatory' : ''
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            scrollBehavior: 'smooth',
            overflowY: 'hidden',
            height: 'auto',
            maxHeight: 'none',
            paddingLeft: '2rem',
            paddingRight: '2rem',
            ...(isMobile && {
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch'
            })
          }}
        >
            {/* Show only single set for mobile, duplicate for desktop */}
            {(isMobile ? features : [...features, ...features]).map((feature, index) => (
              <motion.div
                key={`${feature.id}-${index}`}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  delay: (index % features.length) * 0.1
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3, type: "spring", stiffness: 300 }
                }}
                className={`flex-shrink-0 w-80 group cursor-pointer ${
                  isMobile ? 'snap-center' : ''
                }`}
                onClick={() => isMobile && scrollToCard(index)}
              >
                <motion.div
                  className={`${feature.bgColor} rounded-3xl p-8 h-full shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 relative overflow-hidden`}
                  whileHover={{
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Icon Section */}
                  <div className="flex justify-center mb-8">
                    <motion.div
                      whileHover={{
                        scale: 1.1,
                        transition: { duration: 0.3, type: "spring", stiffness: 400 }
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {feature.icon}
                    </motion.div>
                  </div>

                  {/* Content Section */}
                  <div className="text-center">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-lg font-medium text-gray-600 mb-4">
                      {feature.subtitle}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover Effect Indicator */}
                  <div className="mt-6 flex justify-center">
                    <div className="w-12 h-1 bg-gradient-to-r from-olive-400 to-olive-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Indicators */}
        {isMobile && (
          <div className="flex justify-center mt-6 space-x-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  scrollToCard(index);
                  setUserInteracting(true);
                  setTimeout(() => setUserInteracting(false), 2000); // Pause auto-flick for 2 seconds
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-olive-500 w-6'
                    : 'bg-olive-200 hover:bg-olive-300'
                }`}
              />
            ))}
          </div>
        )}

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
