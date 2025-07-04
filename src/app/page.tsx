'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/home/HeroSection';
import MealPlans from '@/components/home/MealPlans';
import FeaturesSection from '@/components/home/FeaturesSection';
import ReviewsMarquee from '@/components/home/ReviewsMarquee';
import Footer from '@/components/layout/Footer';
import OrderFlowManager from '@/components/order/OrderFlowManager';
import OrderFlowIndicator from '@/components/ui/OrderFlowIndicator';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Order Flow Indicator */}
      <OrderFlowIndicator />

      <HeroSection />
      <div id="meal-plans">
        <MealPlans />
      </div>
      <FeaturesSection />
      <ReviewsMarquee />
      <Footer />

      {/* Global Order Flow Manager */}
      <OrderFlowManager />
    </div>
  );
}
