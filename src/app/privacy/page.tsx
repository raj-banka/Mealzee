'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, Lock, Database } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PrivacyPage: React.FC = () => {
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
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
              <p className="text-green-100 mt-1">How we protect and use your information</p>
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
          {/* Last Updated */}
          <div className="mb-8 text-center">
            <p className="text-gray-600">Last updated: December 2024</p>
          </div>

          {/* Information We Collect */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Information We Collect</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-2">Personal Information</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Full name and contact details</li>
                  <li>• Phone number and email address</li>
                  <li>• Delivery address</li>
                  <li>• Dietary preferences and restrictions</li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-2">Order Information</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Meal plan selections</li>
                  <li>• Order history and preferences</li>
                  <li>• Payment information (processed securely)</li>
                  <li>• Delivery feedback and ratings</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Eye className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">How We Use Your Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Service Delivery</h3>
                <p className="text-gray-600">To process orders, arrange deliveries, and provide customer support</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Communication</h3>
                <p className="text-gray-600">To send order updates, delivery notifications, and important announcements</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Improvement</h3>
                <p className="text-gray-600">To enhance our services, develop new features, and personalize your experience</p>
              </div>
              <div className="bg-pink-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Marketing</h3>
                <p className="text-gray-600">To send promotional offers and updates (with your consent)</p>
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Data Protection</h2>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Secure data encryption and storage</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Limited access to authorized personnel only</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Regular security audits and updates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>No sharing with third parties without consent</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Your Rights */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Lock className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Your Rights</h2>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800">Access & Correction</h3>
                <p className="text-gray-600">You can request access to your personal data and ask for corrections</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-800">Data Deletion</h3>
                <p className="text-gray-600">You can request deletion of your personal data (subject to legal requirements)</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-800">Marketing Opt-out</h3>
                <p className="text-gray-600">You can unsubscribe from marketing communications at any time</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-800">Data Portability</h3>
                <p className="text-gray-600">You can request a copy of your data in a portable format</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Privacy Questions?</h3>
            <p className="text-gray-600 mb-4">
              If you have any questions about our privacy policy or how we handle your data, please contact us.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <a
                href="mailto:privacy@mealzee.com"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                📧 privacy@mealzee.com
              </a>
              <a
                href="tel:+919608036638"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                📞 +91 9608036638
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPage;
