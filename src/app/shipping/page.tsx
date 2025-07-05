'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Truck, Clock, MapPin, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ShippingPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => router.back()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-green-700 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold">Shipping Policy</h1>
              <p className="text-green-100 mt-1">Delivery information and policies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {/* Delivery Areas */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <MapPin className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Delivery Areas</h2>
            </div>
            <div className="bg-green-50 rounded-xl p-6">
              <p className="text-gray-700 mb-4">
                We currently deliver to the following areas:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Sector 4, B.S. City</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Surrounding areas within 5km radius</span>
                </li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                Don&apos;t see your area? Contact us at +91 9608036638 to check if we can deliver to your location.
              </p>
            </div>
          </div>

          {/* Delivery Times */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Delivery Times</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-olive-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Breakfast</h3>
                <p className="text-gray-600">7:00 AM - 9:00 AM</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Lunch</h3>
                <p className="text-gray-600">12:00 PM - 2:00 PM</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Dinner</h3>
                <p className="text-gray-600">7:00 PM - 9:00 PM</p>
              </div>
            </div>
          </div>

          {/* Delivery Process */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Truck className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Delivery Process</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Order Confirmation</h3>
                  <p className="text-gray-600">Your order is confirmed via WhatsApp</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Meal Preparation</h3>
                  <p className="text-gray-600">Fresh meals are prepared in our kitchen</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Quality Check</h3>
                  <p className="text-gray-600">Each meal is checked for quality and packaging</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Delivery</h3>
                  <p className="text-gray-600">Meals are delivered to your doorstep on time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Packaging */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Package className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Packaging</h2>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Eco-friendly, food-grade containers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Leak-proof and microwave-safe packaging</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Temperature-controlled delivery bags</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Hygienic and sealed packaging</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Questions about delivery?</h3>
            <p className="text-gray-600 mb-4">
              Contact our customer support team for any delivery-related queries.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <a
                href="tel:+919608036638"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                📞 +91 9608036638
              </a>
              <a
                href="https://wa.me/919608036638"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ShippingPage;
