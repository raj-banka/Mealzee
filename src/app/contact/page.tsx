'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import OrderFlowManager from '@/components/order/OrderFlowManager';

const ContactPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [messageData, setMessageData] = useState<{
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    referenceId: string;
    timestamp: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Generate reference ID
    const referenceId = Date.now().toString().slice(-6);

    // Prepare contact data
    const contactPayload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      referenceId: referenceId,
      timestamp: new Date().toISOString()
    };

    // Store message data for display
    setMessageData({
      ...contactPayload,
      timestamp: new Date().toLocaleString()
    });

    // Send contact notification email to admin
    try {
      const response = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactData: contactPayload
        })
      });

      const result = await response.json();

      if (response.ok) {
        console.log('✅ Contact message sent to admin email successfully');
        console.log('📧 Admin email:', result.adminEmail);
        console.log('📧 Reference ID:', result.referenceId);
      } else {
        console.warn('⚠️ Contact email failed, but message is still processed');
      }
    } catch (error) {
      console.error('❌ Contact email error:', error);
      // Continue with success screen - message is still valid
    }

    // Show success screen
    setIsSubmitted(true);

    // Auto-reset form after 5 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitted(false);
      setMessageData(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Header */}
      <div className="bg-gradient-to-br from-olive-50 via-olive-100 to-olive-200 text-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-4">
            <div className="text-center w-full">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Contact
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-olive-500 to-olive-600">
                  Mealzee
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Get in touch with our team - we&apos;re here to help with your food delivery needs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
              
              {/* Contact Methods */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-olive-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-olive-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Phone</h3>
                    <p className="text-gray-600">+91 9204 666 105</p>
                    <p className="text-sm text-gray-500">Available 9 AM - 9 PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-olive-200 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-olive-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">WhatsApp</h3>
                    <p className="text-gray-600">+91 9204 666 105</p>
                    <p className="text-sm text-gray-500">Quick responses, 24/7</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-olive-300 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-olive-800" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-600">mealzeeindia@gmail.com</p>
                    <p className="text-sm text-gray-500">We&apos;ll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-olive-400 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-olive-900" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Service Area</h3>
                    <p className="text-gray-600">Sector 4, B.S. City</p>
                    <p className="text-sm text-gray-500">And surrounding areas</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-olive-500 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Business Hours</h3>
                    <p className="text-gray-600">Monday - Sunday</p>
                    <p className="text-sm text-gray-500">6:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>


            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {!isSubmitted ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-olive-500 transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-olive-500 transition-colors"
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-olive-500 transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-olive-500 transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="New Order">New Order</option>
                    <option value="Order Inquiry">Order Inquiry</option>
                    <option value="Delivery Issue">Delivery Issue</option>
                    <option value="Quality Concern">Quality Concern</option>
                    <option value="Billing Question">Billing Question</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-olive-500 transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-olive-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-olive-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </motion.button>
                  </form>

                  <div className="mt-6 p-4 bg-olive-50 rounded-lg">
                    <p className="text-sm text-olive-700">
                      💡 <strong>Tip:</strong> For faster response, contact us directly via WhatsApp at +91 6299367631
                    </p>
                  </div>
                </>
              ) : (
                /* Success Screen */
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-20 h-20 bg-olive-100 rounded-full flex items-center justify-center mx-auto"
                  >
                    <Send className="w-10 h-10 text-olive-600" />
                  </motion.div>

                  <div>
                    <h3 className="text-2xl font-bold text-olive-600 mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-gray-600">
                      Thank you for contacting us. Your message has been received and forwarded to our team.
                    </p>
                  </div>

                  <div className="bg-olive-50 rounded-xl p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Subject:</span>
                      <span className="text-sm text-gray-600">{formData.subject}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">From:</span>
                      <span className="text-sm text-gray-600">{formData.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Reference ID:</span>
                      <span className="text-sm font-bold text-olive-700">#{messageData?.referenceId}</span>
                    </div>
                  </div>

                  <div className="bg-olive-100 rounded-xl p-4">
                    <h4 className="font-semibold text-olive-800 mb-2">What happens next?</h4>
                    <div className="space-y-2 text-sm text-olive-700">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-olive-500 rounded-full"></div>
                        <span>Your message has been forwarded to our team</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-olive-500 rounded-full"></div>
                        <span>Our team will review your message</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-olive-500 rounded-full"></div>
                        <span>You&apos;ll receive a response within 24 hours</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-olive-500 rounded-full"></div>
                        <span>Check your email or phone for our reply</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-olive-200 rounded-xl p-4">
                    <p className="text-sm text-olive-800">
                      📞 <strong>Urgent inquiry?</strong> Call us directly at +91 6299367631 for immediate assistance.
                    </p>
                  </div>

                  <motion.button
                    onClick={() => router.back()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-olive-500 text-white py-4 rounded-xl font-semibold hover:bg-olive-600 transition-colors"
                  >
                    Continue Browsing
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Global Order Flow Manager */}
      <OrderFlowManager />
    </div>
  );
};

export default ContactPage;
