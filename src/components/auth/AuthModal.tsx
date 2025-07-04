'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, ArrowRight, Check, User, MapPin, Navigation } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'input' | 'otp' | 'details' | 'success';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, dispatch, state } = useApp();
  const [authStep, setAuthStep] = useState<AuthStep>('input');
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('phone');
  const [contactValue, setContactValue] = useState('');
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    address: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactValue.trim()) return;

    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Always succeed for demo/testing
    setAuthStep('otp');

    // Show fake OTP in console for testing
    console.log('🔧 DEMO MODE: Use OTP 123456 to login');
    // alert('Demo Mode: Use OTP 123456 to login');

    setIsLoading(false);
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDetails.fullName.trim() || !userDetails.address.trim()) return;

    setIsLoading(true);

    // Login the user with collected data
    login({
      fullName: userDetails.fullName,
      email: contactMethod === 'email' ? contactValue : '',
      phone: contactMethod === 'phone' ? contactValue : '',
      address: userDetails.address,
    });

    setIsLoading(false);
    setAuthStep('success');

    // Close auth modal and continue order flow
    setTimeout(() => {
      dispatch({ type: 'CLOSE_AUTH_MODAL' });

      // Continue with the order flow based on current state
      if (state.orderFlow === 'auth') {
        if (state.selectedMealPlan) {
          dispatch({ type: 'SET_ORDER_FLOW', payload: 'order-confirmation' });
          dispatch({ type: 'OPEN_ORDER_MODAL' });
        } else {
          dispatch({ type: 'SET_ORDER_FLOW', payload: 'meal-selection' });
          dispatch({ type: 'OPEN_MEAL_PLAN_SELECTION' });
        }
      }

      resetModal();
    }, 2000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) return;

    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check for demo OTP
    if (otpValue === '123456') {
      console.log('✅ Demo OTP verified successfully');
      setAuthStep('details');
    } else {
      alert('Invalid OTP. Use 123456 for demo mode.');
      // Reset OTP inputs
      setOtp(['', '', '', '', '', '']);
    }

    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Reset OTP inputs
    setOtp(['', '', '', '', '', '']);

    // Start 60-second cooldown for resend
    setResendCooldown(60);
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    console.log('🔧 DEMO MODE: Use OTP 123456 to login');
    alert('Demo Mode: Use OTP 123456 to login');

    setIsLoading(false);
  };

  const getCurrentLocation = () => {
    setIsLocationLoading(true);

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      setIsLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Simulate reverse geocoding
          await new Promise(resolve => setTimeout(resolve, 1000));
          const mockAddress = 'Sector 4, B.S. City, Delhi - 110001';
          setUserDetails(prev => ({
            ...prev,
            address: mockAddress
          }));
        } catch (error) {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter manually.');
        } finally {
          setIsLocationLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to access your location. Please enter your address manually.');
        setIsLocationLoading(false);
      }
    );
  };

  const resetModal = () => {
    setAuthStep('input');
    setContactValue('');
    setUserDetails({ fullName: '', address: '' });
    setOtp(['', '', '', '', '', '']);
    setIsLoading(false);
    setIsLocationLoading(false);
    setResendCooldown(0);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetModal, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ zIndex: 1050 }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {authStep === 'input' && 'Welcome to Mealzee'}
                {authStep === 'otp' && 'Verify OTP'}
                {authStep === 'details' && 'Complete Your Profile'}
                {authStep === 'success' && 'Welcome!'}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Step 1: Contact Input */}
            {authStep === 'input' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <p className="text-gray-600 mb-6">
                  Enter your phone number or email to get started
                </p>

                {/* Contact Method Toggle */}
                <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
                  <button
                    onClick={() => setContactMethod('phone')}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                      contactMethod === 'phone'
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'text-gray-600'
                    }`}
                  >
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone
                  </button>
                  <button
                    onClick={() => setContactMethod('email')}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                      contactMethod === 'email'
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'text-gray-600'
                    }`}
                  >
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </button>
                </div>

                <form onSubmit={handleContactSubmit}>
                  <div className="relative mb-6">
                    <input
                      type={contactMethod === 'email' ? 'email' : 'tel'}
                      placeholder={
                        contactMethod === 'email'
                          ? 'Enter your email address'
                          : 'Enter your phone number'
                      }
                      value={contactValue}
                      onChange={(e) => setContactValue(e.target.value)}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={!contactValue.trim() || isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-2xl font-semibold transition-all flex items-center justify-center space-x-2 ${
                      contactValue.trim() && !isLoading
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        <span>Send OTP</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* Step 2: OTP Verification */}
            {authStep === 'otp' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <p className="text-gray-600 mb-6">
                  We've sent a 6-digit code to{' '}
                  <span className="font-semibold text-green-600">{contactValue}</span>
                </p>

                <form onSubmit={handleOtpSubmit}>
                  <div className="flex space-x-3 mb-6">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                      />
                    ))}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={otp.join('').length !== 6 || isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-2xl font-semibold transition-all flex items-center justify-center space-x-2 ${
                      otp.join('').length === 6 && !isLoading
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        <span>Verify OTP</span>
                        <Check className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Resend OTP */}
                <div className="text-center mt-4">
                  <button
                    onClick={handleResendOTP}
                    disabled={resendCooldown > 0 || isLoading}
                    className={`text-sm font-medium ${
                      resendCooldown > 0 || isLoading
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-green-600 hover:text-green-700'
                    }`}
                  >
                    {resendCooldown > 0
                      ? `Resend OTP in ${resendCooldown}s`
                      : 'Resend OTP'
                    }
                  </button>
                </div>

                <button
                  onClick={() => setAuthStep('input')}
                  className="w-full mt-4 text-green-600 hover:text-green-700 font-medium"
                >
                  Back to {contactMethod}
                </button>
              </motion.div>
            )}

            {/* Step 3: User Details */}
            {authStep === 'details' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <p className="text-gray-600 mb-6">
                  Please provide your details to complete registration
                </p>

                <form onSubmit={handleDetailsSubmit}>
                  <div className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={userDetails.fullName}
                        onChange={(e) => setUserDetails(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    <div className="relative">
                      <MapPin className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                      <textarea
                        placeholder="Enter your complete address"
                        value={userDetails.address}
                        onChange={(e) => setUserDetails(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:outline-none transition-colors resize-none"
                        rows={3}
                        required
                      />
                    </div>
                  </div>

                  {/* Use Current Location Button */}
                  <motion.button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isLocationLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-blue-600 text-white py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 mt-4"
                  >
                    {isLocationLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        <Navigation className="w-5 h-5" />
                        <span>Use Current Location</span>
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    type="submit"
                    disabled={!userDetails.fullName.trim() || !userDetails.address.trim() || isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-2xl font-semibold transition-all flex items-center justify-center space-x-2 mt-6 ${
                      userDetails.fullName.trim() && userDetails.address.trim() && !isLoading
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>

                <button
                  onClick={() => setAuthStep('otp')}
                  className="w-full mt-4 text-green-600 hover:text-green-700 font-medium"
                >
                  Back to OTP
                </button>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {authStep === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="w-8 h-8 text-green-600" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Login Successful!
                </h3>
                <p className="text-gray-600">
                  Welcome to Mealzee family. You can now place orders and enjoy our services.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
