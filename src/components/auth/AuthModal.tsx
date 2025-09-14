'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, ArrowRight, Check, User, Calendar, MapPin, ChevronDown } from 'lucide-react';
import Image from 'next/image';
// import SmartImage from '@/components/ui/SmartImage';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
import { isValidReferralCode } from '@/utils/referral';
import {
  sendSMSOTP,
  verifySMSOTP,
  cleanupAuth
} from '@/lib/auth';
import { Z_INDEX } from '@/lib/constants';
import { getSectorsForCity } from '@/utils/serviceArea';
import { WEEKLY_MENU } from '@/lib/weeklyMenu';


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
    sector: '',
    dietaryPreference: 'vegetarian' as 'vegetarian' | 'non-vegetarian',
    dateOfBirth: ''
  });
  const [hasReferralCode, setHasReferralCode] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [referralName, setReferralName] = useState('');
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const [showDietaryDropdown, setShowDietaryDropdown] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signupError, setSignupError] = useState('');

  const [otp, setOtp] = useState(['', '', '', '']); // 4-digit SMS OTP
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMode, setSuccessMode] = useState<'signin' | 'signup'>('signin');

  // Carousel: today image list (single at a time)
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [todayImages, setTodayImages] = useState<string[]>([]);

  useEffect(() => {
    const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const dayMenu = WEEKLY_MENU[day as keyof typeof WEEKLY_MENU];
    if (dayMenu) {
      const list = [...(dayMenu.breakfast || []), ...(dayMenu.lunch || []), ...(dayMenu.dinner || [])]
        .map(i => i.image)
        .filter((src): src is string => Boolean(src));
      setTodayImages(list.length ? list : ['/images/vegthali.jpg']);
    } else {
      setTodayImages(['/images/vegthali.jpg']);
    }
  }, []);

  useEffect(() => {
    if (!todayImages.length) return;
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % todayImages.length);
    }, 3000); // advance every 3s for smoother, slower scroll
    return () => clearInterval(timer);
  }, [todayImages]);

  // Image set for Sign In marquee
  const signInImages = [
    '/images/biryani.jpg',
    '/images/vegthali.jpg',
    '/images/pasta.jpg',
    '/images/paratha.jpg',
    '/images/roti-manchuriyan.jpg',
  ];
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

    // Optional non-blocking existence check: keep for UX hints but DO NOT block OTP send.
    try {
      const res = await fetch(`/api/user/profile?phone=${encodeURIComponent(phoneNumber)}`);
      const exists = res.ok; // 200 => exists, 404 => not exists

      // Provide hints to user but don't stop OTP send. This allows login/signup to work
      // even when backend is unavailable or user record isn't found.
      if (authMode === 'signin' && !exists) {
        // Original behaviour: if signing in but user doesn't exist, switch to signup
        setPhoneError("You don’t have an account. Please create one.");
        setAuthMode('signup');
        setIsLoading(false);
        return; // stop here — user will be shown signup form
      } else if (authMode === 'signup' && exists) {
        // If signing up but user already exists, show warning but continue to send OTP
        setSignupError('You already have an account. We will still send OTP to verify.');
      }
    } catch (err) {
      // If existence check fails, log and continue — OTP will be sent regardless.
      console.warn('Non-blocking user existence check failed; proceeding to OTP:', err);
    }

    try {
      // Step 2: Send SMS OTP via Message Central
      const result = await sendSMSOTP(phoneNumber);
      if (result.success) {
        setAuthStep('otp');
        setOtpError('');
        setPhoneError('');
        // Start initial 30-second cooldown for resend
        startResendTimer();
      } else if (
        result.error &&
        (result.error.toLowerCase().includes('already pending') ||
         result.error.toLowerCase().includes('already exists') ||
         result.error.toLowerCase().includes('wait'))
      ) {
        setAuthStep('otp');
        setOtpError('OTP already sent to your phone. Please check your SMS.');
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
    if (!userDetails.fullName.trim() || !userDetails.address.trim() || !userDetails.sector.trim()) return;

    setIsLoading(true);

    // Check if address is provided
    if (!userDetails.address.trim()) {
      alert('Please enter your delivery address.');
      setIsLoading(false);
      return;
    }

    // Create complete address by appending sector to the address
    const completeAddress = `${userDetails.address.trim()}, ${userDetails.sector}, Bokaro Steel City`;

    // Attempt backend user creation (non-blocking; UI proceeds regardless)
    try {
      await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          profile: {
            name: userDetails.fullName || null,
            dob: userDetails.dateOfBirth || null,
            referredByCode: hasReferralCode && referralCode && isValidReferralCode(referralCode) ? referralCode : undefined,
          }
        })
      });
    } catch (e) {
      console.warn('User create fallback (DB may be unavailable):', e);
    }

  // Login the user locally and reconcile with backend (async)
  await login({
      fullName: userDetails.fullName,
      phone: phoneNumber,
      address: completeAddress,
      sector: userDetails.sector,
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
      // Verify SMS OTP via Message Central
      const success = await verifySMSOTP(otpValue, phoneNumber);
      
      if (success) {
        // If user selected Sign Up and we already collected profile basics, create account and finish
        if (authMode === 'signup') {
          try {
            await fetch('/api/users/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                phone: phoneNumber,
                profile: {
                  name: userDetails.fullName || null,
                  dob: userDetails.dateOfBirth || null,
                  referredByCode: hasReferralCode && referralCode && isValidReferralCode(referralCode) ? referralCode : undefined,
                }
              })
            });
          } catch (e) {
            console.warn('User create fallback (DB may be unavailable):', e);
          }

          // Login locally using info collected in the signup form
          // Sector is required in signup, so always append it to the address for consistency
          const completeAddress = `${userDetails.address.trim()}, ${userDetails.sector}, Bokaro Steel City`;

          await login({
            fullName: userDetails.fullName,
            phone: phoneNumber,
            address: completeAddress,
            sector: userDetails.sector,
            dietaryPreference: userDetails.dietaryPreference,
            dateOfBirth: userDetails.dateOfBirth,
            referralCode: hasReferralCode && referralCode && isValidReferralCode(referralCode) ? referralCode : undefined,
            referralName: hasReferralCode && referralCode && isValidReferralCode(referralCode) ? referralName : undefined,
          });

          setSuccessMode('signup');
          setAuthStep('success');

          // Close modal and continue flow
          setTimeout(() => {
            dispatch({ type: 'CLOSE_AUTH_MODAL' });
            if (state.orderFlow === 'auth') {
              if (state.selectedMealPlan || state.selectedDish) {
                dispatch({ type: 'SET_ORDER_FLOW', payload: 'order-confirmation' });
                dispatch({ type: 'OPEN_ORDER_MODAL' });
              } else {
                dispatch({ type: 'SET_ORDER_FLOW', payload: 'meal-selection' });
                dispatch({ type: 'OPEN_MEAL_PLAN_SELECTION' });
              }
            }
            resetModal();
          }, 1200);
        } else {
          // Sign In: directly log in the user (no details form)
          const minimalAddress = 'Address not provided';
          await login({
            fullName: 'Guest',
            phone: phoneNumber,
            address: minimalAddress,
            dietaryPreference: 'vegetarian',
            dateOfBirth: '',
          });

          setSuccessMode('signin');
          setAuthStep('success');

          // Close modal and continue flow
          setTimeout(() => {
            dispatch({ type: 'CLOSE_AUTH_MODAL' });
            if (state.orderFlow === 'auth') {
              if (state.selectedMealPlan || state.selectedDish) {
                dispatch({ type: 'SET_ORDER_FLOW', payload: 'order-confirmation' });
                dispatch({ type: 'OPEN_ORDER_MODAL' });
              } else {
                dispatch({ type: 'SET_ORDER_FLOW', payload: 'meal-selection' });
                dispatch({ type: 'OPEN_MEAL_PLAN_SELECTION' });
              }
            }
            resetModal();
          }, 1200);
        }
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
      // Resend SMS OTP via Message Central
      const result = await sendSMSOTP(phoneNumber);
      
      if (result.success) {
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
    setAuthMode('signin');
    setPhoneNumber('');
    setPhoneError('');
    setUserDetails({
      fullName: '',
      address: '',
      sector: '',
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
            initial={{ scale: 0.98, opacity: 0, y: 6 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 6 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="bg-transparent p-0 shadow-none ring-0 w-full max-w-xs sm:max-w-sm lg:max-w-md mx-auto px-2 sm:px-4"
            onClick={(e) => e.stopPropagation()}
          >


            {/* Step 1: Input (flippable) */}
            {authStep === 'input' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <div className="relative w-full overflow-hidden h-[520px] sm:h-[560px] lg:h-[580px] rounded-2xl lg:rounded-3xl" style={{ perspective: 1000 }}>
                  <motion.div
                    initial={false}
                    animate={{ rotateY: authMode === 'signup' ? 0 : 180 }}
                    transition={{ duration: 0.5 }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="w-full h-full"
                  >
                    {/* SIGN UP (front) */}
                    <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                      <div className="rounded-2xl lg:rounded-3xl border border-emerald-200/70 bg-white/95 backdrop-blur-sm p-4 sm:p-5 lg:p-6 shadow-md shadow-emerald-500/10 h-full flex flex-col">
                        <div className="text-center mb-3 lg:mb-4">
                          <h3 className="text-lg lg:text-xl font-semibold text-gray-800">Hello welcome to Mealzee</h3>
                          <p className="text-xs lg:text-sm text-gray-500">Create your account to get started</p>
                        </div>
                        <div className="space-y-2 lg:space-y-3 flex-1 overflow-y-auto pr-2 sm:pr-3 scrollbar-hide overscroll-contain pb-2 pl-2">
                          <input type="text" placeholder="Full Name" value={userDetails.fullName} onChange={(e) => setUserDetails(prev => ({ ...prev, fullName: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-3 lg:px-4 mt-2 py-2 lg:py-3 text-sm lg:text-base focus:outline-none focus:ring-4 focus:ring-emerald-400/50" />
                          <div className="flex gap-2 lg:gap-3">
                            <span className="inline-flex items-center px-3 lg:px-4 rounded-xl bg-gray-100 text-gray-600 text-sm lg:text-base border border-gray-200">+91</span>
                            <div className="relative flex-1">
                              <Phone size={16} className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input value={phoneNumber} onChange={handlePhoneChange} placeholder="Phone Number" inputMode="numeric" maxLength={10} className="w-full rounded-xl border border-emerald-300 pl-9 lg:pl-12 pr-3 lg:pr-4 py-2 lg:py-3 text-sm lg:text-base focus:outline-none focus:ring-4 focus:ring-emerald-400/60" />
                            </div>
                          </div>
                          {phoneError && <p className="text-xs lg:text-sm text-red-600">{phoneError}</p>}
                          <div>
                            <label className="block text-[11px] lg:text-xs text-gray-500 mb-1">Date of Birth</label>
                            <input type="date" value={userDetails.dateOfBirth} max={new Date().toISOString().split('T')[0]} onChange={(e) => setUserDetails(prev => ({ ...prev, dateOfBirth: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base focus:outline-none focus:ring-4 focus:ring-emerald-400/50" />
                          </div>
                          <textarea placeholder="Address" rows={2} value={userDetails.address} onChange={(e) => setUserDetails(prev => ({ ...prev, address: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base focus:outline-none focus:ring-4 focus:ring-emerald-400/50" />

                    

                          {/* Sector + Dietary (two columns) */}
                          <div className="grid grid-cols-2 gap-2 lg:gap-3">
                            <div className="space-y-1">
                              <label className="block text-[11px] lg:text-xs text-gray-500">Sector</label>
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setShowSectorDropdown(!showSectorDropdown)}
                                  className="w-full px-3 lg:px-4 py-2 lg:py-2.5 border border-emerald-300 rounded-xl text-sm lg:text-base text-left flex items-center justify-between hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300/50 transition-colors"
                                >
                                  <span className={userDetails.sector ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                                    {userDetails.sector || 'Choose'}
                                  </span>
                                  <ChevronDown className={`w-4 h-4 lg:w-5 lg:h-5 text-gray-400 transition-transform ${showSectorDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                {showSectorDropdown && (
                                  <div className="absolute z-50 w-full mt-1 bg-white border border-emerald-200/70 rounded-xl lg:rounded-2xl shadow-lg shadow-emerald-500/10 max-h-48 lg:max-h-56 overflow-y-auto scrollbar-hide top-full">
                                    {getSectorsForCity('Bokaro Steel City').map((sector) => (
                                      <button
                                        key={sector}
                                        type="button"
                                        onClick={() => {
                                          setUserDetails(prev => ({ ...prev, sector }));
                                          setShowSectorDropdown(false);
                                        }}
                                        className="w-full px-3 lg:px-4 py-2 lg:py-3 text-left hover:bg-gray-50 text-sm lg:text-base border-b border-gray-100 last:border-b-0 transition-colors"
                                      >
                                        {sector}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Dietary Preference (dropdown same as Sector) */}
                            <div className="space-y-1">
                              <label className="block text-[11px] lg:text-xs text-gray-500">Dietary Preference</label>
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setShowDietaryDropdown(!showDietaryDropdown)}
                                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-emerald-300 rounded-xl text-sm lg:text-base text-left flex items-center justify-between hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300/50 transition-colors"
                                >
                                  <span className={'text-gray-900 font-medium'}>
                                    {userDetails.dietaryPreference === 'vegetarian' ? 'Vegetarian' : 'Non-Vegetarian'}
                                  </span>
                                  <ChevronDown className={`w-4 h-4 lg:w-5 lg:h-5 text-gray-400 transition-transform ${showDietaryDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                {showDietaryDropdown && (
                                  <div className="absolute z-50 w-full mt-1 bg-white border border-emerald-200/70 rounded-xl lg:rounded-2xl shadow-lg shadow-emerald-500/10 max-h-48 lg:max-h-56 xl:max-h-64 2xl:max-h-72 overflow-y-auto top-full">
                                    {['vegetarian','non-vegetarian'].map((opt) => (
                                      <button
                                        key={opt}
                                        type="button"
                                        onClick={() => { setUserDetails(prev => ({ ...prev, dietaryPreference: opt as 'vegetarian' | 'non-vegetarian' })); setShowDietaryDropdown(false); }}
                                        className="w-full px-3 lg:px-4 xl:px-5 2xl:px-6 py-2 lg:py-3 xl:py-4 2xl:py-5 text-left hover:bg-gray-50 text-sm lg:text-base xl:text-lg 2xl:text-xl border-b border-gray-100 last:border-b-0 transition-colors"
                                      >
                                        {opt === 'vegetarian' ? 'Vegetarian' : 'Non-Vegetarian'}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Referral (optional) */}
                          <div className="space-y-2 lg:space-y-3 xl:space-y-4 border-t border-gray-200 pt-3 lg:pt-4 xl:pt-5">
                            <div className="flex items-center gap-2 lg:gap-3 xl:gap-4">
                              <input
                                type="checkbox"
                                id="signupHasReferralCode"
                                checked={hasReferralCode}
                                onChange={(e) => setHasReferralCode(e.target.checked)}
                                className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-green-600 border-gray-300 rounded"
                              />
                              <label htmlFor="signupHasReferralCode" className="text-xs lg:text-sm xl:text-base 2xl:text-lg text-gray-700">Have any referral code?</label>
                            </div>
                            {hasReferralCode && (
                              <div className="space-y-2 lg:space-y-3 xl:space-y-4">
                                <input
                                  type="text"
                                  placeholder="Referral code (e.g., MEAL123456)"
                                  value={referralCode}
                                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                                  className={`w-full px-3 lg:px-4 xl:px-5 2xl:px-6 py-2 lg:py-3 xl:py-4 2xl:py-5 border rounded-xl text-sm lg:text-base xl:text-lg 2xl:text-xl focus:outline-none ${
                                    referralCode && isValidReferralCode(referralCode)
                                      ? 'border-green-500 bg-green-50'
                                      : referralCode && !isValidReferralCode(referralCode)
                                      ? 'border-red-500 bg-red-50'
                                      : 'border-gray-300'
                                  }`}
                                />
                                {referralCode && !isValidReferralCode(referralCode) && (
                                  <p className="text-red-500 text-[11px] lg:text-xs xl:text-sm">Invalid format. Should be like MEAL123456</p>
                                )}
                                <input
                                  type="text"
                                  placeholder="Referral name (optional)"
                                  value={referralName}
                                  onChange={(e) => setReferralName(e.target.value)}
                                  className="w-full px-3 lg:px-4 xl:px-5 2xl:px-6 py-2 lg:py-3 xl:py-4 2xl:py-5 border border-gray-300 rounded-xl text-sm lg:text-base xl:text-lg 2xl:text-xl"
                                />
                              </div>
                            )}
                          </div>

                         
                          {signupError && <p className="text-xs lg:text-sm xl:text-base 2xl:text-lg text-red-600">{signupError}</p>}
                        </div>
                        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={async (e) => { e.preventDefault(); setSignupError(''); if (!userDetails.fullName.trim()) { setSignupError('Please enter your full name'); return; } if (!validatePhoneNumber(phoneNumber)) return; if (!userDetails.dateOfBirth) { setSignupError('Please select your date of birth'); return; } if (!userDetails.sector.trim()) { setSignupError('Please select your sector'); return; } if (!userDetails.address.trim()) { setSignupError('Please enter your address'); return; }  await handleContactSubmit(e as any); }} disabled={isLoading} className="mt-3 lg:mt-4 xl:mt-5 2xl:mt-6 w-full rounded-xl py-3 lg:py-4 xl:py-5 2xl:py-6 text-sm lg:text-base xl:text-lg 2xl:text-xl font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 shadow-lg">
                          {isLoading ? 'Sending OTP...' : 'Create Account'}
                        </motion.button>
                        <div className="mt-3 lg:mt-4 xl:mt-5 2xl:mt-6 text-center text-xs lg:text-sm xl:text-base 2xl:text-lg text-gray-600">
                          Already have an account?{' '}
                          <button onClick={() => setAuthMode('signin')} className="text-emerald-600 hover:underline font-medium">Sign In</button>
                        </div>
                      </div>
                    </div>

                    {/* SIGN IN (back) */}
                    <div className="absolute inset-0" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                      <div className="rounded-2xl lg:rounded-3xl border border-emerald-200/70 bg-white/95 backdrop-blur-sm p-4 sm:p-5 lg:p-6 shadow-md shadow-emerald-500/10 h-full flex flex-col">
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 lg:space-y-5">
                          {/* Center image - footer logo, appropriate size for desktop */}
                          <div className="relative h-10 w-36 sm:h-12 sm:w-44 lg:h-14 lg:w-52">
                            <Image src="/footer_logo.png" alt="Mealzee logo" fill className="object-contain" sizes="(max-width: 640px) 176px, (max-width: 1024px) 224px, 208px" />
                          </div>

                          {/* Welcome text */}
                          <div className="text-center">
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">Welcome back to Mealzee</h3>
                            <p className="text-xs sm:text-sm lg:text-base text-gray-500 mt-1">Sign in with your mobile number to continue</p>
                          </div>

                          {/* Phone input */}
                          <div className="w-full max-w-xs lg:max-w-sm">
                            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-white p-1 shadow-sm">
                              <span className="inline-flex h-9 lg:h-10 items-center px-2.5 lg:px-3 rounded-md bg-gray-50 text-gray-700 text-sm lg:text-base border-r border-gray-200">+91</span>
                              <div className="relative flex-1">
                                <Phone size={14} className="absolute left-2.5 lg:left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input value={phoneNumber} onChange={handlePhoneChange} placeholder="10 digit number" inputMode="numeric" maxLength={10} className="w-full h-9 lg:h-10 bg-transparent pl-7 lg:pl-8 pr-2.5 lg:pr-3 text-sm lg:text-base focus:outline-none placeholder:text-gray-400" />
                              </div>
                            </div>
                            {phoneError && <p className="text-xs lg:text-sm text-red-600 mt-1.5 text-center">{phoneError}</p>}
                          </div>

                          {/* Animated single-card carousel (today's menu) */}
                          <div className="w-full max-w-xs lg:max-w-sm mt-4">
                            <div className="relative mx-auto w-56 sm:w-64 lg:w-72 aspect-[16/9] rounded-xl lg:rounded-2xl overflow-hidden shadow-lg">
                              <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                  key={todayImages[carouselIndex] || 'placeholder'}
                                  initial={{ opacity: 0, x: 24 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -24 }}
                                  transition={{ duration: 0.35, ease: 'easeOut' }}
                                  className="absolute inset-0"
                                >
                                  {todayImages[carouselIndex] && (
                                    <Image
                                      src={todayImages[carouselIndex]}
                                      alt="Today menu"
                                      fill
                                      sizes="(max-width: 640px) 224px, (max-width: 1024px) 256px, 288px"
                                      className="object-cover"
                                      priority={false}
                                    />
                                  )}
                                </motion.div>
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                        <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98, y: 0 }} onClick={(e) => handleContactSubmit(e as any)} disabled={isLoading || phoneNumber.trim().length !== 10} className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 lg:py-3 text-sm lg:text-base font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 shadow-lg shadow-emerald-600/20 transition-all">
                          {isLoading ? 'Sending...' : (<><span>Continue</span> <ArrowRight size={16} className="lg:w-4 lg:h-4" /></>)}
                        </motion.button>
                        <div className="mt-3 lg:mt-4 text-center text-xs lg:text-sm text-gray-600">
                          Don’t have an account?{' '}
                          <button onClick={() => setAuthMode('signup')} className="text-emerald-600 hover:underline font-medium">Create Account</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Step 2: OTP Verification */}
            {authStep === 'otp' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <motion.div
                  className="p-[2px] rounded-2xl lg:rounded-3xl"
                  style={{ backgroundImage: 'linear-gradient(90deg,#10b981,#14b8a6,#10b981)', backgroundSize: '200% 100%' }}
                  animate={{ backgroundPosition: ['0% 0%','100% 0%','0% 0%'] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                >
                  <motion.div
                    className="rounded-2xl lg:rounded-3xl bg-white shadow-lg p-5 sm:p-6 lg:p-8"
                    initial={{ y: 2, boxShadow: '0 10px 24px rgba(16,185,129,0.08)' }}
                    animate={{ y: 0, boxShadow: ['0 10px 24px rgba(16,185,129,0.08)','0 14px 28px rgba(20,184,166,0.12)','0 10px 24px rgba(16,185,129,0.08)'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 text-center">Verify OTP</h3>
                    <p className="text-gray-600 mt-1 lg:mt-2 mb-5 lg:mb-6 text-center text-sm sm:text-base lg:text-lg">
                      We&apos;ve sent a 4-digit code to{' '}
                      <span className="font-semibold text-gray-900">+91 {phoneNumber}</span>
                    </p>

                    <form onSubmit={handleOtpSubmit}>
                      <div className="flex space-x-2 sm:space-x-3 lg:space-x-4 mb-3 lg:mb-5 justify-center">
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
                            className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-center text-lg sm:text-xl lg:text-2xl font-bold border-2 rounded-lg sm:rounded-xl lg:rounded-2xl focus:outline-none transition-colors ${
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
                          className="mb-4 lg:mb-5 text-red-500 text-sm lg:text-base text-center flex items-center justify-center space-x-1"
                        >
                          <span>⚠️</span>
                          <span>{otpError}</span>
                        </motion.div>
                      )}

                      <motion.button
                        type="submit"
                        disabled={otp.join('').length !== 4 || isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl lg:rounded-3xl font-semibold transition-all flex items-center justify-center space-x-2 lg:space-x-3 text-sm sm:text-base lg:text-lg ${
                          otp.join('').length === 4 && !isLoading
                            ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-500/20'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 lg:w-6 lg:h-6 border-2 border-white/30 border-t-white rounded-full"
                          />
                        ) : (
                          <>
                            <span>Verify OTP</span>
                            <Check className="w-5 h-5 lg:w-6 lg:h-6" />
                          </>
                        )}
                      </motion.button>
                    </form>

                    {/* Resend OTP */}
                    <div className="text-center mt-4 lg:mt-5">
                      <button
                        onClick={handleResendOTP}
                        disabled={resendCooldown > 0 || isLoading}
                        className={`text-sm lg:text-base font-medium ${
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
                      className="w-full mt-4 lg:mt-6 py-2 lg:py-3 text-green-600 hover:text-green-700 font-medium text-sm lg:text-base rounded-lg lg:rounded-xl hover:bg-green-50 transition-colors"
                    >
                      Back to phone number
                    </button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* Step 3: User Details */}
            {authStep === 'details' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl lg:rounded-3xl p-5 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 shadow-lg"
              >
                <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold text-gray-800 text-center mb-4 lg:mb-6 xl:mb-8 2xl:mb-10">Complete Your Profile</h3>
                <form onSubmit={handleDetailsSubmit}>
                  <div className="space-y-3 sm:space-y-4 lg:space-y-5 xl:space-y-6 2xl:space-y-8">
                    <div className="relative">
                      <User className="absolute left-3 lg:left-4 xl:left-5 2xl:left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={userDetails.fullName}
                        onChange={(e) => setUserDetails(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full pl-12 lg:pl-14 xl:pl-16 2xl:pl-18 pr-4 lg:pr-5 xl:pr-6 2xl:pr-7 py-3 sm:py-4 lg:py-5 xl:py-6 2xl:py-7 border-2 border-gray-200 rounded-xl sm:rounded-2xl lg:rounded-3xl focus:border-green-500 focus:outline-none transition-colors text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl"
                        required
                      />
                    </div>



                    <div className="space-y-2 lg:space-y-3 xl:space-y-4">
                      <label className="block text-sm lg:text-base xl:text-lg 2xl:text-xl font-medium text-gray-700">
                        Dietary Preference
                      </label>
                      <div className="flex bg-gray-100 rounded-xl sm:rounded-2xl lg:rounded-3xl p-1 lg:p-2">
                        <button
                          type="button"
                          onClick={() => setUserDetails(prev => ({ ...prev, dietaryPreference: 'vegetarian' }))}
                          className={`flex-1 py-2 sm:py-3 lg:py-4 xl:py-5 2xl:py-6 px-2 sm:px-4 lg:px-5 xl:px-6 2xl:px-7 rounded-lg sm:rounded-xl lg:rounded-2xl font-medium transition-all text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl ${
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
                          className={`flex-1 py-2 sm:py-3 lg:py-4 xl:py-5 2xl:py-6 px-2 sm:px-4 lg:px-5 xl:px-6 2xl:px-7 rounded-lg sm:rounded-xl lg:rounded-2xl font-medium transition-all text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl ${
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

                    {/* Address Input */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Delivery Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <textarea
                          value={userDetails.address}
                          onChange={(e) => setUserDetails(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Enter your hostel name or complete address in Bokaro"
                          rows={3}
                          className="w-full pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-green-500 focus:outline-none transition-colors text-sm sm:text-base resize-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Sector Selection */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Sector <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowSectorDropdown(!showSectorDropdown)}
                          className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-green-500 focus:outline-none transition-colors text-sm sm:text-base text-left flex items-center justify-between"
                        >
                          <span className={userDetails.sector ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                            {userDetails.sector || 'Choose your sector'}
                          </span>
                          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showSectorDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showSectorDropdown && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                            {getSectorsForCity('Bokaro Steel City').map((sector) => (
                              <button
                                key={sector}
                                type="button"
                                onClick={() => {
                                  setUserDetails(prev => ({ ...prev, sector }));
                                  setShowSectorDropdown(false);
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-sm border-b border-gray-100 last:border-b-0"
                              >
                                {sector}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
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
                    disabled={!userDetails.fullName.trim() || !userDetails.address.trim() || !userDetails.sector.trim() || !userDetails.dateOfBirth.trim() || isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all flex items-center justify-center space-x-2 mt-4 sm:mt-6 text-sm sm:text-base ${
                      userDetails.fullName.trim() && userDetails.address.trim() && userDetails.sector.trim() && userDetails.dateOfBirth.trim() && !isLoading
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
                initial={{ opacity: 0, scale: 0.98, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="text-center px-6 py-8 bg-white/95 rounded-2xl border border-emerald-200/70 shadow-md shadow-emerald-500/10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="w-8 h-8 text-emerald-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {successMode === 'signup' ? 'Account Created!' : 'Welcome Back!'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {successMode === 'signup'
                    ? 'Your Mealzee account is ready. Let’s get you to your order.'
                    : 'You are now logged in. Redirecting to continue your order.'}
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
