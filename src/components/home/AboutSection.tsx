'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Award, Clock, Truck, Shield } from 'lucide-react';

const AboutSection: React.FC = () => {
  const features = [
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Every dish is prepared with passion and care by our expert chefs',
      color: 'from-red-400 to-pink-500',
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'We believe in bringing people together through great food',
      color: 'from-blue-400 to-indigo-500',
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Only the finest ingredients make it to your plate',
      color: 'from-olive-400 to-olive-500',
    },
    {
      icon: Clock,
      title: 'Always Fresh',
      description: 'Prepared fresh daily and delivered hot to your doorstep',
      color: 'from-green-400 to-emerald-500',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Lightning-fast delivery that keeps your food hot and fresh',
      color: 'from-purple-400 to-violet-500',
    },
    {
      icon: Shield,
      title: 'Safe & Hygienic',
      description: 'Highest standards of hygiene and food safety protocols',
      color: 'from-teal-400 to-cyan-500',
    },
  ];

  const stats = [
    { number: '50K+', label: 'Happy Customers' },
    { number: '500+', label: 'Dishes Served Daily' },
    { number: '4.8★', label: 'Average Rating' },
    { number: '30min', label: 'Average Delivery Time' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-olive-50 to-olive-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight font-poppins">
            About
            <span className="bg-gradient-to-r from-olive-500 to-olive-600 bg-clip-text text-transparent">Mealzee</span>
            <span className="inline-block ml-3">🍽️</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're passionate about bringing you the best food experience. From farm-fresh ingredients 
            to your doorstep, we ensure every bite is a celebration of flavor and quality.
          </p>
        </motion.div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Our Story
            </h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Founded in 2020 with a simple mission: to make delicious, quality food accessible 
              to everyone. What started as a small kitchen has grown into a community of food 
              lovers who believe that great meals bring people together.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Today, we're proud to serve thousands of customers daily, each meal prepared with 
              the same love and attention to detail that started our journey.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop"
                alt="Our kitchen"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h4 className="text-2xl font-bold mb-2">Our Kitchen</h4>
                <p className="text-lg opacity-90">Where magic happens every day</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-olive-600 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-olive-500 to-olive-600 rounded-3xl p-12 text-white"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Our Impact in Numbers
            </h3>
            <p className="text-xl opacity-90">
              These numbers represent the trust you've placed in us
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
