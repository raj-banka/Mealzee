'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/home/HeroSection';
import MealPlans from '@/components/home/MealPlans';
import FeaturesSection from '@/components/home/FeaturesSection';
import ReviewsMarquee from '@/components/home/ReviewsMarquee';

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <div id="meal-plans">
        <MealPlans />
      </div>
      <FeaturesSection />
      <ReviewsMarquee />
    </MainLayout>
  );
}
