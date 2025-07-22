'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle,
  Navigation,
  Utensils,
  MessageCircle
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getCurrentLocation, reverseGeocode } from '@/lib/location';
import { sendOrderToWhatsApp, OrderData } from '@/lib/whatsapp';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: {
    id: string;
    title: string;
    duration: string;
    discountedPrice: number;
    originalPrice: number;
    discount: number;
  };
}

interface OrderDetails {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  preferences: string;
  startDate: string;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, selectedPlan }) => {
  const { state, dispatch } = useApp();
  const [step, setStep] = useState<'confirm' | 'success'>('confirm');
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    customerName: state.user?.fullName || '',
    phone: state.user?.phone || '',
    email: state.user?.email || '',
    address: state.user?.address || '',
    preferences: '',
    startDate: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<string>('');

  useEffect(() => {
    if (isOpen && state.user) {
      // Set default start date to tomorrow and populate user data
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setOrderDetails({
        customerName: state.user.fullName,
        phone: state.user.phone,
        email: state.user.email,
        address: state.user.address,
        preferences: '',
        startDate: tomorrow.toISOString().split('T')[0]
      });
    }
  }, [isOpen, state.user]);

  const handleInputChange = (field: keyof OrderDetails, value: string) => {
    setOrderDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getCurrentLocationHandler = async () => {
    setIsLoading(true);

    try {
      // Get current coordinates using browser geolocation
      const coordinates = await getCurrentLocation();

      // Reverse geocode to get detailed address information
      const locationData = await reverseGeocode(coordinates);

      // Check if location is serviceable
      if (!locationData.isServiceable) {
        alert(`Sorry, we don't deliver to this area yet. We currently serve Bokaro Steel City, Jharkhand and surrounding areas within 15km radius.`);
        setIsLoading(false);
        return;
      }

      // Set the detected address
      const formattedAddress = `${locationData.sector ? locationData.sector + ', ' : ''}${locationData.city}, ${locationData.state}${locationData.pincode ? ' - ' + locationData.pincode : ''}`;

      setDetectedLocation(formattedAddress);
      setOrderDetails(prev => ({
        ...prev,
        address: formattedAddress
      }));

      console.log('📍 Location detected for order:', locationData);
    } catch (error) {
      console.error('Error getting location:', error);

      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert('Location access denied. Please enable location services and enter your address manually.');
            break;
          case error.POSITION_UNAVAILABLE:
            alert('Location information is unavailable. Please enter your address manually.');
            break;
          case error.TIMEOUT:
            alert('Location request timed out. Please enter your address manually.');
            break;
          default:
            alert('Unable to get your location. Please enter your address manually.');
            break;
        }
      } else {
        alert('Unable to get your location. Please enter your address manually.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    // Since user details are already populated from context, just proceed to confirmation
    setStep('confirm');
  };

  const [orderData, setOrderData] = useState<any>(null);

  const handleConfirmOrder = async () => {
    setIsLoading(true);

    // Generate order ID
    const orderId = Date.now().toString().slice(-6);

    // Prepare order data
    const orderPayload = {
      customerName: orderDetails.customerName,
      phone: orderDetails.phone,
      email: orderDetails.email,
      address: orderDetails.address,
      planTitle: selectedPlan?.title || '',
      planDuration: selectedPlan?.duration || '',
      planPrice: selectedPlan?.discountedPrice?.toString() || '',
      startDate: orderDetails.startDate,
      preferences: orderDetails.preferences,
      orderId: orderId
    };

    // Store order data for display
    setOrderData({
      ...orderPayload,
      timestamp: new Date().toLocaleString()
    });

    // Simulate professional order processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Send order to admin WhatsApp using standardized service
    try {
      const success = sendOrderToWhatsApp(orderPayload);

      if (success) {
        console.log('📱 Order sent to WhatsApp: +91 6299367631');
        console.log('📄 Order data:', orderPayload);
      } else {
        console.warn('⚠️ Failed to send order to WhatsApp');
      }
    } catch (error) {
      console.warn('⚠️ WhatsApp error:', error);
    }

    setIsLoading(false);
    setStep('success');
  };

  const resetModal = () => {
    setStep('confirm');
    setOrderDetails({
      customerName: state.user?.fullName || '',
      phone: state.user?.phone || '',
      email: state.user?.email || '',
      address: state.user?.address || '',
      preferences: '',
      startDate: ''
    });
    setDetectedLocation('');
    setIsLoading(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetModal, 300);
  };

  if (!selectedPlan) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {step === 'confirm' && 'Confirm Your Order'}
                {step === 'success' && 'Order Confirmation'}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Selected Plan Summary */}
            <div className="bg-green-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center space-x-3">
                <Utensils className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedPlan.title}</h3>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-green-600 font-bold">₹{selectedPlan.discountedPrice}</span>
                    <span className="text-gray-500 line-through">₹{selectedPlan.originalPrice}</span>
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                      {selectedPlan.discount}% off
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Confirmation */}
            {step === 'confirm' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Customer Details */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-gray-800 mb-3">Customer Details</h3>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="font-medium">{orderDetails.customerName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span>{orderDetails.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <span>{orderDetails.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">{orderDetails.address}</span>
                  </div>
                </div>

                {/* Order Preferences */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={orderDetails.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Preferences (Optional)
                    </label>
                    <textarea
                      value={orderDetails.preferences}
                      onChange={(e) => handleInputChange('preferences', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                      placeholder="Any dietary preferences or special instructions"
                      rows={3}
                    />
                  </div>
                </div>

                <motion.button
                  onClick={handleConfirmOrder}
                  disabled={isLoading || !orderDetails.startDate}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2 ${
                    orderDetails.startDate && !isLoading
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Confirm Order</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}

            {/* Success */}
            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                >
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </motion.div>

                <div>
                  <h3 className="text-2xl font-bold text-green-600 mb-2">
                    Order Placed Successfully!
                  </h3>
                  <p className="text-gray-600">
                    Thank you for choosing Mealzee. Your order has been received and is being processed.
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Order ID:</span>
                    <span className="text-sm font-bold text-green-700">#{orderData?.orderId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Plan:</span>
                    <span className="text-sm text-gray-600">{selectedPlan?.title}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Amount:</span>
                    <span className="text-sm font-bold text-green-600">₹{selectedPlan?.discountedPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Start Date:</span>
                    <span className="text-sm text-gray-600">{orderDetails.startDate}</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">What happens next?</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Our team is processing your order</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>You'll receive a confirmation call within 30 minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Delivery will start from your selected date</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Track your order using Order ID: #{orderData?.orderId}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-xl p-4">
                  <p className="text-sm text-yellow-700">
                    📞 <strong>Need help?</strong> Call us at +91 6299367631 for any queries about your order.
                  </p>
                </div>

                <motion.button
                  onClick={() => {
                    dispatch({ type: 'CLOSE_ORDER_MODAL' });
                    dispatch({ type: 'RESET_ORDER_FLOW' });
                    resetModal();
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  Continue Browsing
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderModal;
