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
    location: 'Mumbai',
    avatar: '👩‍💼'
  },
  {
    id: '2',
    name: 'Rahul Kumar',
    rating: 5,
    comment: 'Mealzee has made my life so much easier. Healthy and delicious meals every day!',
    location: 'Delhi',
    avatar: '👨‍💻'
  },
  {
    id: '3',
    name: 'Anjali Patel',
    rating: 4,
    comment: 'Love the variety and the birthday surprise was such a sweet gesture!',
    location: 'Bangalore',
    avatar: '👩‍🎓'
  },
  {
    id: '4',
    name: 'Vikram Singh',
    rating: 5,
    comment: 'Best tiffin service in the city. Fresh food delivered on time, every time.',
    location: 'Pune',
    avatar: '👨‍🏭'
  },
  {
    id: '5',
    name: 'Sneha Gupta',
    rating: 5,
    comment: 'The lunch & dinner combo is perfect for my work schedule. Highly recommended!',
    location: 'Hyderabad',
    avatar: '👩‍⚕️'
  },
  {
    id: '6',
    name: 'Arjun Mehta',
    rating: 4,
    comment: 'Great value for money and the food tastes just like home-cooked meals.',
    location: 'Chennai',
    avatar: '👨‍🎨'
  },
  {
    id: '7',
    name: 'Kavya Reddy',
    rating: 5,
    comment: 'The festival specials are amazing! Mealzee truly cares about their customers.',
    location: 'Kolkata',
    avatar: '👩‍🔬'
  },
  {
    id: '8',
    name: 'Rohit Jain',
    rating: 5,
    comment: 'Switched to Mealzee 6 months ago and never looked back. Excellent service!',
    location: 'Ahmedabad',
    avatar: '👨‍🚀'
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
  const { startOrderFlow } = useApp();

  // Split reviews into two rows for alternating direction
  const firstRowReviews = reviews.slice(0, 4);
  const secondRowReviews = reviews.slice(4, 8);

  return (
    <section className="py-16 bg-gradient-to-br from-olive-50 to-olive-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
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
      <div className="relative mb-8">
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
      <div className="relative">
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
          onClick={() => startOrderFlow()}
          className="bg-olive-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-olive-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Choose Your Meal Plan
        </motion.button>
      </motion.div>
    </section>
  );
};

export default ReviewsMarquee;
