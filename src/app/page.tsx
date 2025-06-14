'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/home/HeroSection';
import MealCategories from '@/components/home/PopularCuisines';
import MenuSection from '@/components/home/MenuSection';
import SpecialsSection from '@/components/home/SpecialsSection';
import HowItWorks from '@/components/home/HowItWorks';
import AboutSection from '@/components/home/AboutSection';
import Testimonials from '@/components/home/Testimonials';
import ContactSection from '@/components/home/ContactSection';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <MealCategories />
      <MenuSection />
      <SpecialsSection />
      <HowItWorks />
      <AboutSection />
      <Testimonials />
      <ContactSection />
      <Footer />
    </div>
  );
}
