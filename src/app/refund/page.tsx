'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Clock, CreditCard, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';

const RefundPage: React.FC = () => {
  const router = useRouter();

  return (
    <MainLayout className="bg-gray-50" showOrderFlow={false}>
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
              <h1 className="text-3xl font-bold">Refund Policy</h1>
              <p className="text-green-100 mt-1">Our refund and cancellation policy</p>
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

          {/* Refund Eligibility */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <RefreshCw className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Refund Eligibility</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-2">✅ Eligible for Refund</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Quality issues with delivered meals</li>
                  <li>• Wrong order delivered</li>
                  <li>• Meals not delivered within scheduled time</li>
                  <li>• Cancellation made 24+ hours before delivery</li>
                  <li>• Service unavailable in your area</li>
                </ul>
              </div>
              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-2">❌ Not Eligible for Refund</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Cancellation made less than 24 hours before delivery</li>
                  <li>• Customer not available to receive delivery</li>
                  <li>• Change of mind after meal preparation has started</li>
                  <li>• Meals already consumed</li>
                  <li>• Dietary preferences not communicated in advance</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Refund Process */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Refund Process</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Contact Us</h3>
                  <p className="text-gray-600">Reach out via WhatsApp or phone within 24 hours of the issue</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Issue Review</h3>
                  <p className="text-gray-600">Our team will review your case and may request photos or additional details</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Resolution</h3>
                  <p className="text-gray-600">We&apos;ll provide a replacement meal or process a refund within 2-3 business days</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Refund Processing</h3>
                  <p className="text-gray-600">Approved refunds are processed to your original payment method</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-olive-600" />
              <h2 className="text-2xl font-bold text-gray-800">Cancellation Policy</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">24+ Hours Notice</h3>
                <p className="text-gray-600">Full refund available for cancellations made 24 hours or more before delivery</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">12-24 Hours Notice</h3>
                <p className="text-gray-600">50% refund available as ingredients may already be purchased</p>
              </div>
              <div className="bg-olive-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Less than 12 Hours</h3>
                <p className="text-gray-600">No refund available as meal preparation has likely started</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Emergency Situations</h3>
                <p className="text-gray-600">Special consideration for genuine emergencies (case-by-case basis)</p>
              </div>
            </div>
          </div>

          {/* Refund Timeline */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <CreditCard className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Refund Timeline</h2>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="font-bold">1-2</span>
                  </div>
                  <h3 className="font-semibold text-gray-800">Business Days</h3>
                  <p className="text-gray-600 text-sm">Issue review and approval</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="font-bold">2-3</span>
                  </div>
                  <h3 className="font-semibold text-gray-800">Business Days</h3>
                  <p className="text-gray-600 text-sm">Refund processing</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="font-bold">3-7</span>
                  </div>
                  <h3 className="font-semibold text-gray-800">Business Days</h3>
                  <p className="text-gray-600 text-sm">Bank processing time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quality Guarantee */}
          <div className="mb-8">
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">🌟 Our Quality Guarantee</h3>
              <p className="text-gray-600 mb-4">
                We&apos;re committed to providing fresh, delicious meals. If you&apos;re not satisfied with the quality
                of your meal, we&apos;ll make it right with a replacement or refund.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Fresh ingredients sourced daily</li>
                <li>• Hygienic preparation and packaging</li>
                <li>• Temperature-controlled delivery</li>
                <li>• 100% satisfaction guarantee</li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Need a Refund?</h3>
            <p className="text-gray-600 mb-4">
              Contact our customer support team to initiate a refund request. We&apos;re here to help!
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <a
                href="https://wa.me/919204666105"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                💬 WhatsApp Support
              </a>
              <a
                href="tel:+919204666105"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                📞 +91 9204666105
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default RefundPage;
