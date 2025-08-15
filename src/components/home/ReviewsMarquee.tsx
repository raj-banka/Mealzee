'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  location: string;
  avatar: string;
}

const reviews: Review[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    rating: 5,
    comment: 'Amazing food quality! The breakfast combo is perfect for my busy mornings.',
    location: 'Sector 4/A',
    avatar: '👩‍💼'
  },
  {
    id: '2',
    name: 'Riya Verma',
    rating: 5,
    comment: 'Mealzee has made my life so much easier. Healthy and delicious meals every day!',
    location: 'Sector 4/B',
    avatar: '👩‍🔬'
  },
  {
    id: '3',
    name: 'nagma praveen',
    rating: 4,
    comment: 'Love the variety and the birthday surprise was such a sweet gesture!',
    location: 'Sector 4/C',
    avatar: '👩‍🎓'
  },
  {
    id: '4',
    name: 'Meena Singh',
    rating: 5,
    comment: 'Best tiffin service in the city. Fresh food delivered on time, every time.',
    location: 'Sector 4/D',
    avatar: '👩‍🔬'
  },
  {
    id: '5',
    name: 'Sneha Gupta',
    rating: 5,
    comment: 'The lunch & dinner combo is perfect for my work schedule. Highly recommended!',
    location: 'Sector 4/E',
    avatar: '👩‍⚕️'
  },
  {
    id: '6',
    name: 'Jasmine',
    rating: 4,
    comment: 'Great value for money and the food tastes just like home-cooked meals.',
    location: 'Sector 4/F',
    avatar: '👩‍🔬'
  },
  {
    id: '7',
    name: 'Kavita Reddy',
    rating: 5,
    comment: 'The festival specials are amazing! Mealzee truly cares about their customers.',
    location: 'Sector 4/A',
    avatar: '👩‍🔬'
  },
  {
    id: '8',
    name: 'Neha Jain',
    rating: 5,
    comment: 'Switched to Mealzee 6 months ago and never looked back. Excellent service!',
    location: 'Sector 4/B',
    avatar: '👩‍🔬'
  }
];

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 min-w-[300px] mx-3">
      <div className="flex items-center mb-4">
        <div className="text-3xl mr-3">{review.avatar}</div>
        <div>
          <h4 className="font-semibold text-gray-800">{review.name}</h4>
          <p className="text-sm text-gray-500">{review.location}</p>
        </div>
      </div>
      
      <div className="flex items-center mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      
      <div className="relative">
        <Quote className="absolute -top-2 -left-2 w-6 h-6 text-green-200" />
        <p className="text-gray-700 italic pl-4">"{review.comment}"</p>
      </div>
    </div>
  );
};

const ReviewsMarquee: React.FC = () => {
  const { startOrderFlow, dispatch, isLoggedIn } = useApp();

  // Split reviews into two rows for alternating direction
  const firstRowReviews = reviews.slice(0, 4);
  const secondRowReviews = reviews.slice(4, 8);

  return (
    <section className="py-16 bg-gradient-to-br from-olive-50 to-olive-100 overflow-x-auto scrollbar-hide md:overflow-hidden">
      <div className="w-full min-w-[360px] md:min-w-0 px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of happy customers who trust Mealzee for their daily meals
          </p>
        </motion.div>
      </div>

      {/* First Row - Moving Right */}
      <div className="relative mb-8 overflow-x-auto scrollbar-hide">
        <motion.div
          animate={{
            x: ['-100%', '0%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="flex"
        >
          {/* Duplicate the reviews for seamless loop */}
          {[...firstRowReviews, ...firstRowReviews].map((review, index) => (
            <ReviewCard key={`${review.id}-${index}`} review={review} />
          ))}
        </motion.div>
      </div>

      {/* Second Row - Moving Left */}
      <div className="relative overflow-x-auto scrollbar-hide">
        <motion.div
          animate={{
            x: ['0%', '-100%']
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="flex"
        >
          {/* Duplicate the reviews for seamless loop */}
          {[...secondRowReviews, ...secondRowReviews].map((review, index) => (
            <ReviewCard key={`${review.id}-${index}`} review={review} />
          ))}
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <p className="text-lg text-gray-700 mb-6">
          Ready to join our happy customers?
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            // Always show meal plan selection, regardless of current selection
            if (!isLoggedIn()) {
              // If not logged in, start normal auth flow
              dispatch({ type: 'SET_ORDER_FLOW', payload: 'auth' });
              dispatch({ type: 'OPEN_AUTH_MODAL' });
            } else {
              // If logged in, always show meal plan selection modal
              dispatch({ type: 'SET_ORDER_FLOW', payload: 'meal-selection' });
              dispatch({ type: 'OPEN_MEAL_PLAN_SELECTION' });
            }
          }}
          className="bg-olive-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-olive-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Choose Your Meal Plan
        </motion.button>
      </motion.div>
    </section>
  );
};

export default ReviewsMarquee;
