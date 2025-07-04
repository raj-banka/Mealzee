'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, ArrowRight, Check, User, Calendar } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
import LocationInput from '@/components/location/LocationInput';
import { LocationData, validateServiceArea, getCurrentLocation, reverseGeocode } from '@/lib/location';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'input' | 'otp' | 'location-check' | 'details' | 'success';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, dispatch, state } = useApp();
  const router = useRouter();
  const [authStep, setAuthStep] = useState<AuthStep>('input');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    address: '',
    dietaryPreference: 'vegetarian' as 'vegetarian' | 'non-vegetarian',
    dateOfBirth: ''
  });
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const [resendCooldown, setResendCooldown] = useState(0);

  // Handle location checking after OTP verification
  useEffect(() => {
    if (authStep === 'location-check') {
      handleLocationCheck();
    }
  }, [authStep]);

  const handleLocationCheck = async () => {
    try {
      console.log('🔍 Checking location serviceability...');
      const coordinates = await getCurrentLocation();
      const locationData = await reverseGeocode(coordinates);

      // Store location data for later use
      setLocationData(locationData);

      if (!locationData.isServiceable) {
        console.log('❌ Location not serviceable, redirecting to not-available page');
        // Close modal and redirect to not-available page
        dispatch({ type: 'CLOSE_AUTH_MODAL' });
        router.push('/not-available');
        resetModal();
        return;
      }

      console.log('✅ Location is serviceable, proceeding to details');
      // Pre-fill address if location is serviceable
      const addressString = `${locationData.sector ? locationData.sector + ', ' : ''}${locationData.city}, ${locationData.state}${locationData.pincode ? ' - ' + locationData.pincode : ''}`;
      setUserDetails(prev => ({ ...prev, address: addressString }));

      setAuthStep('details');
    } catch (error) {
      console.error('Location check failed:', error);
      // If location check fails, continue to details step
      // User can manually enter address
      setAuthStep('details');
    }
  };

  // Phone number validation
  const validatePhoneNumber = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits
    if (cleanPhone.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits');
      return false;
    }
    if (!cleanPhone.match(/^[6-9]/)) {
      setPhoneError('Phone number must start with 6, 7, 8, or 9');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 10) {
      setPhoneNumber(value);
      if (phoneError) {
        setPhoneError(''); // Clear error when user starts typing
      }
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      return;
    }

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

    // If location data is available from OTP step, use it
    // Otherwise validate the manually entered address
    let isAddressServiceable = true;
    if (locationData) {
      // Location was already checked during OTP verification
      isAddressServiceable = locationData.isServiceable;
    } else {
      // Validate manually entered address
      try {
        const validation = await validateServiceArea(userDetails.address);
        isAddressServiceable = validation.isValid;
      } catch (error) {
        console.error('Address validation error:', error);
        // Assume not serviceable if validation fails
        isAddressServiceable = false;
      }
    }

    // Login the user with collected data
    login({
      fullName: userDetails.fullName,
      email: '',
      phone: phoneNumber,
      address: userDetails.address,
      dietaryPreference: userDetails.dietaryPreference,
      dateOfBirth: userDetails.dateOfBirth,
    });

    setIsLoading(false);
    setAuthStep('success');

    // Close auth modal and check location serviceability
    setTimeout(() => {
      dispatch({ type: 'CLOSE_AUTH_MODAL' });

      // Check if location is serviceable
      if (!isAddressServiceable) {
        // Redirect to not-available page if location is not serviceable
        router.push('/not-available');
        resetModal();
        return;
      }

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
      setAuthStep('location-check');
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



  const resetModal = () => {
    setAuthStep('input');
    setPhoneNumber('');
    setPhoneError('');
    setUserDetails({ fullName: '', address: '', dietaryPreference: 'vegetarian', dateOfBirth: '' });
    setOtp(['', '', '', '', '', '']);
    setIsLoading(false);
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
            className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-2xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto mx-auto scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                {authStep === 'input' && 'Welcome to Mealzee'}
                {authStep === 'otp' && 'Verify OTP'}
                {authStep === 'location-check' && 'Checking Location'}
                {authStep === 'details' && 'Complete Your Profile'}
                {authStep === 'success' && 'Welcome!'}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
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
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  Enter your phone number to get started
                </p>

                <form onSubmit={handleContactSubmit}>
                  <div className="relative mb-2">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Enter your 10-digit phone number"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      className={`w-full pl-12 pr-4 py-3 sm:py-4 border-2 rounded-xl sm:rounded-2xl focus:outline-none transition-colors text-sm sm:text-base ${
                        phoneError
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-200 focus:border-green-500'
                      }`}
                      required
                      maxLength={10}
                    />
                  </div>

                  {/* Error Message */}
                  {phoneError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 text-red-500 text-sm flex items-center space-x-1"
                    >
                      <span>⚠️</span>
                      <span>{phoneError}</span>
                    </motion.div>
                  )}

                  <div className="mb-6"></div>

                  <motion.button
                    type="submit"
                    disabled={!phoneNumber.trim() || phoneNumber.length !== 10 || !!phoneError || isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all flex items-center justify-center space-x-2 text-sm sm:text-base ${
                      phoneNumber.trim() && phoneNumber.length === 10 && !phoneError && !isLoading
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
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  We've sent a 6-digit code to{' '}
                  <span className="font-semibold text-green-600">{phoneNumber}</span>
                </p>

                <form onSubmit={handleOtpSubmit}>
                  <div className="flex space-x-2 sm:space-x-3 mb-4 sm:mb-6 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                      />
                    ))}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={otp.join('').length !== 6 || isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all flex items-center justify-center space-x-2 text-sm sm:text-base ${
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
                  Back to phone number
                </button>
              </motion.div>
            )}

            {/* Step 3: Location Check */}
            {authStep === 'location-check' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <div className="mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Checking Your Location
                  </h3>
                  <p className="text-gray-600 text-sm">
                    We're verifying if we deliver to your area...
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 4: User Details */}
            {authStep === 'details' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  Please provide your details to complete registration
                </p>

                <form onSubmit={handleDetailsSubmit}>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={userDetails.fullName}
                        onChange={(e) => setUserDetails(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-green-500 focus:outline-none transition-colors text-sm sm:text-base"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Dietary Preference
                      </label>
                      <div className="flex bg-gray-100 rounded-xl sm:rounded-2xl p-1">
                        <button
                          type="button"
                          onClick={() => setUserDetails(prev => ({ ...prev, dietaryPreference: 'vegetarian' }))}
                          className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl font-medium transition-all text-xs sm:text-sm ${
                            userDetails.dietaryPreference === 'vegetarian'
                              ? 'bg-white text-green-600 shadow-sm'
                              : 'text-gray-600'
                          }`}
                        >
                          🥬 Vegetarian
                        </button>
                        <button
                          type="button"
                          onClick={() => setUserDetails(prev => ({ ...prev, dietaryPreference: 'non-vegetarian' }))}
                          className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl font-medium transition-all text-xs sm:text-sm ${
                            userDetails.dietaryPreference === 'non-vegetarian'
                              ? 'bg-white text-green-600 shadow-sm'
                              : 'text-gray-600'
                          }`}
                        >
                          🍗 Non-Vegetarian
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={userDetails.dateOfBirth}
                          onChange={(e) => setUserDetails(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                          className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-green-500 focus:outline-none transition-colors text-sm sm:text-base"
                          required
                          max={new Date().toISOString().split('T')[0]} // Prevent future dates
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Delivery Address
                      </label>
                      <LocationInput
                        value={userDetails.address}
                        onChange={(address, locData) => {
                          setUserDetails(prev => ({ ...prev, address }));
                          if (locData) {
                            setLocationData(locData);
                          }
                        }}
                        placeholder="Enter your complete delivery address"
                        className="border-2 border-gray-200 focus:border-green-500"
                        showCurrentLocationButton={true}
                        validateOnChange={true}
                      />
                    </div>
                  </div>



                  <motion.button
                    type="submit"
                    disabled={!userDetails.fullName.trim() || !userDetails.address.trim() || !userDetails.dateOfBirth.trim() || isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all flex items-center justify-center space-x-2 mt-4 sm:mt-6 text-sm sm:text-base ${
                      userDetails.fullName.trim() && userDetails.address.trim() && userDetails.dateOfBirth.trim() && !isLoading
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

            {/* Step 5: Success */}
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
