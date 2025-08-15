'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, ArrowRight, Check, User, Calendar } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
import AddressAutocomplete from '@/components/location/AddressAutocomplete';
import { isValidReferralCode } from '@/utils/referral';
import {
  sendWhatsAppOTP,
  verifyWhatsAppOTP,
  cleanupAuth
} from '@/lib/auth';
import { Z_INDEX } from '@/lib/constants';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'input' | 'otp' | 'details' | 'success';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, dispatch, state } = useApp();
  const router = useRouter();
  const [authStep, setAuthStep] = useState<AuthStep>('input');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    address: '',
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    dietaryPreference: 'vegetarian' as 'vegetarian' | 'non-vegetarian',
    dateOfBirth: ''
  });
  const [hasReferralCode, setHasReferralCode] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [referralName, setReferralName] = useState('');
  const [addressValidation, setAddressValidation] = useState({ isValid: false, message: '' });
  const [otp, setOtp] = useState(['', '', '', '']); // 4-digit WhatsApp OTP
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Auto-detect referral code from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get('ref') || urlParams.get('referral');
    if (refParam && isValidReferralCode(refParam.toUpperCase())) {
      setReferralCode(refParam.toUpperCase());
      setHasReferralCode(true);
      console.log('✅ Auto-applied referral code from URL:', refParam.toUpperCase());
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (resendTimerRef.current) {
        clearInterval(resendTimerRef.current);
      }
      cleanupAuth();
    };
  }, []);

  const [resendCooldown, setResendCooldown] = useState(0);
  const resendTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to start the resend timer
  const startResendTimer = () => {
    // Clear any existing timer
    if (resendTimerRef.current) {
      clearInterval(resendTimerRef.current);
    }

    setResendCooldown(30);
    resendTimerRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (resendTimerRef.current) {
            clearInterval(resendTimerRef.current);
            resendTimerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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
    try {
      // Send WhatsApp OTP via Message Central
      const result = await sendWhatsAppOTP(phoneNumber);
      if (result.success) {
        setAuthStep('otp');
        setOtpError('');
        setPhoneError('');
        // Optionally show a message somewhere in the modal
        // Start initial 30-second cooldown for resend
        startResendTimer();
      } else if (
        result.error &&
        (result.error.toLowerCase().includes('already pending') ||
         result.error.toLowerCase().includes('already exists') ||
         result.error.toLowerCase().includes('wait'))
      ) {
        setAuthStep('otp');
        setOtpError('OTP already sent to your WhatsApp. Please check your messages.');
        setPhoneError('');
        startResendTimer();
      } else {
        setPhoneError(result.error || 'Failed to send OTP. Please try again or contact support if the issue persists.');
      }
    } catch (error: any) {
      console.error('❌ Error sending OTP:', error);
      setPhoneError('Failed to send OTP. Please check your phone number and try again.');
    }
    setIsLoading(false);
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDetails.fullName.trim() || !userDetails.address.trim()) return;

    setIsLoading(true);

    // Check if address was validated during input
    if (!addressValidation.isValid) {
      alert('Please enter a valid address in our service area.');
      setIsLoading(false);
      return;
    }

    // Login the user with collected data
    login({
      fullName: userDetails.fullName,
      phone: phoneNumber,
      address: userDetails.address,
      latitude: userDetails.latitude,
      longitude: userDetails.longitude,
      dietaryPreference: userDetails.dietaryPreference,
      dateOfBirth: userDetails.dateOfBirth,
      referralCode: hasReferralCode && referralCode && isValidReferralCode(referralCode) ? referralCode : undefined,
      referralName: hasReferralCode && referralCode && isValidReferralCode(referralCode) ? referralName : undefined,
    });

    setIsLoading(false);
    setAuthStep('success');

    // Close auth modal and continue with order flow
    setTimeout(() => {
      dispatch({ type: 'CLOSE_AUTH_MODAL' });

      // Continue with the order flow based on current state
      if (state.orderFlow === 'auth') {
        if (state.selectedMealPlan || state.selectedDish) {
          // User has selected either a meal plan or individual dish - go to order confirmation
          dispatch({ type: 'SET_ORDER_FLOW', payload: 'order-confirmation' });
          dispatch({ type: 'OPEN_ORDER_MODAL' });
        } else {
          // No selection made - go to meal plan selection
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

    // Clear error when user starts typing
    if (otpError) {
      setOtpError('');
    }

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Clear error when user starts typing
    if (otpError) {
      setOtpError('');
    }

    // Handle Ctrl+A or Ctrl+Backspace to clear all fields
    if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'Backspace')) {
      e.preventDefault();
      setOtp(['', '', '', '']);
      const firstInput = document.getElementById('otp-0');
      firstInput?.focus();
      return;
    }

    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otp];

      if (newOtp[index]) {
        // If current field has value, clear it
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // If current field is empty, go to previous field and clear it
        newOtp[index - 1] = '';
        setOtp(newOtp);
        const prevInput = document.getElementById(`otp-${index - 1}`);
        prevInput?.focus();
      }
      return;
    }

    // Handle delete key
    if (e.key === 'Delete') {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
      return;
    }

    if (e.key === 'ArrowRight' && index < 3) {
      e.preventDefault();
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
      return;
    }

    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      // Let the paste event handle this
      return;
    }

    // Only allow numbers
    if (!/^\d$/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);

    if (pastedData.length > 0) {
      const newOtp = ['', '', '', ''];
      for (let i = 0; i < pastedData.length && i < 4; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);

      // Focus the next empty field or the last field
      const nextEmptyIndex = Math.min(pastedData.length, 3);
      const nextInput = document.getElementById(`otp-${nextEmptyIndex}`);
      nextInput?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 4) return;

    setIsLoading(true);
    setOtpError('');

    try {
      // Verify WhatsApp OTP via Message Central
      const success = await verifyWhatsAppOTP(otpValue, phoneNumber);
      
      if (success) {
        // Go directly to details step after OTP verification
        setAuthStep('details');
      } else {
        setOtpError('Invalid OTP code. Please try again.');
        // Reset OTP inputs (4-digit)
        setOtp(['', '', '', '']);
        // Focus first input
        const firstInput = document.getElementById('otp-0');
        firstInput?.focus();
      }
    } catch (error) {
      console.error('❌ Error verifying OTP:', error);
      setOtpError('Failed to verify OTP. Please try again.');
      // Reset OTP inputs (4-digit)
      setOtp(['', '', '', '']);
      // Focus first input
      const firstInput = document.getElementById('otp-0');
      firstInput?.focus();
    }

    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setIsLoading(true);
    setOtpError('');

    try {
      // Resend WhatsApp OTP via Message Central
      const success = await sendWhatsAppOTP(phoneNumber);
      
      if (success) {
        // Reset OTP inputs
        setOtp(['', '', '', '']);

        // Start 30-second cooldown for resend
        startResendTimer();

        // Focus first input
        const firstInput = document.getElementById('otp-0');
        firstInput?.focus();
      } else {
        alert('Failed to resend OTP. Please try again or contact support if the issue persists.');
      }
    } catch (error: any) {
      console.error('❌ Error resending OTP:', error);
      alert('Failed to resend OTP. Please try again.');
    }

    setIsLoading(false);
  };



  const resetModal = () => {
    setAuthStep('input');
    setPhoneNumber('');
    setPhoneError('');
    setUserDetails({
      fullName: '',
      address: '',
      latitude: undefined,
      longitude: undefined,
      dietaryPreference: 'vegetarian',
      dateOfBirth: ''
    });
    setHasReferralCode(false);
    setReferralCode('');
    setReferralName('');
    setOtp(['', '', '', '']);
    setOtpError('');
    setIsLoading(false);
    setResendCooldown(0);

    // Clear the resend timer
    if (resendTimerRef.current) {
      clearInterval(resendTimerRef.current);
      resendTimerRef.current = null;
    }

    cleanupAuth();
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
          className="fixed inset-0 grid place-items-center p-4 bg-black/60 backdrop-blur-sm"
          style={{ zIndex: Z_INDEX.modalBackdrop }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 12 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-6 max-w-sm sm:max-w-md w-full shadow-xl ring-1 ring-black/5 max-h-[75vh] sm:max-h-[70vh] overflow-y-auto mx-auto scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                {authStep === 'input' && 'Welcome to Mealzee'}

                {authStep === 'otp' && 'Verify OTP'}
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
                  We&apos;ve sent a 4-digit code to{' '}
                  <span className="font-semibold text-green-600">{phoneNumber}</span>
                </p>

                <form onSubmit={handleOtpSubmit}>
                  <div className="flex space-x-2 sm:space-x-3 mb-2 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className={`w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold border-2 rounded-lg sm:rounded-xl focus:outline-none transition-colors ${
                          otpError
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-200 focus:border-green-500'
                        }`}
                      />
                    ))}
                  </div>

                  {/* OTP Error Message */}
                  {otpError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 text-red-500 text-sm text-center flex items-center justify-center space-x-1"
                    >
                      <span>⚠️</span>
                      <span>{otpError}</span>
                    </motion.div>
                  )}



                  <div className="mb-4 sm:mb-6"></div>

                  <motion.button
                    type="submit"
                    disabled={otp.join('').length !== 4 || isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all flex items-center justify-center space-x-2 text-sm sm:text-base ${
                      otp.join('').length === 4 && !isLoading
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
                        : 'text-green-600 hover:text-green-700 cursor-pointer'
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

            {/* Step 3: User Details */}
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
                      <AddressAutocomplete
                        value={userDetails.address}
                        onChange={(address, lat, lon) => {
                          setUserDetails(prev => ({
                            ...prev,
                            address,
                            latitude: lat,
                            longitude: lon
                          }));
                        }}
                        placeholder="Enter your complete delivery address"
                        className="border-2 border-gray-200 focus:border-green-500"
                        showValidation={true}
                        onValidationChange={(isValid, message) => {
                          setAddressValidation({ isValid, message });
                        }}
                      />
                    </div>

                    {/* Referral Code Section */}
                    <div className="space-y-3 border-t border-gray-200 pt-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="hasReferralCode"
                          checked={hasReferralCode}
                          onChange={(e) => setHasReferralCode(e.target.checked)}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label htmlFor="hasReferralCode" className="text-sm font-medium text-gray-700">
                          Have any referral code?
                        </label>
                      </div>

                      {hasReferralCode && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3"
                        >
                          <div>
                            <input
                              type="text"
                              placeholder="Enter referral code (e.g., MEAL123456)"
                              value={referralCode}
                              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-sm ${
                                referralCode && isValidReferralCode(referralCode)
                                  ? 'border-green-500 focus:border-green-600 bg-green-50'
                                  : referralCode && !isValidReferralCode(referralCode)
                                  ? 'border-red-500 focus:border-red-600 bg-red-50'
                                  : 'border-gray-200 focus:border-green-500'
                              }`}
                            />
                            {referralCode && !isValidReferralCode(referralCode) && (
                              <p className="text-red-500 text-xs mt-1">
                                Invalid referral code format. Should be like MEAL123456
                              </p>
                            )}
                          </div>
                          <div>
                            <input
                              type="text"
                              placeholder="Referral name (optional)"
                              value={referralName}
                              onChange={(e) => setReferralName(e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors text-sm"
                            />
                          </div>
                          {referralCode && isValidReferralCode(referralCode) && (
                            <div className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                              ✅ Referral code {referralCode} will be applied to your order
                            </div>
                          )}
                        </motion.div>
                      )}
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
