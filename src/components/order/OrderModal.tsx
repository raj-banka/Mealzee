'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  User,
  Phone,
  CheckCircle,
  Utensils,
  Download
} from 'lucide-react';
import { useApp, MenuItem } from '@/contexts/AppContext';
import { Z_INDEX } from '@/lib/constants';
import { generateInvoicePDF, generateInvoiceData } from '@/utils/invoiceGenerator';

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
  selectedDish?: MenuItem;
  orderType: 'meal-plan' | 'individual-dish';
}

interface OrderDetails {
  customerName: string;
  phone: string;
  address: string;
  city?: string;
  sector?: string;
  isTemporaryAddress: boolean;
  preferences: string;
  startDate: string;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, selectedPlan, selectedDish, orderType }) => {
  const { state, dispatch } = useApp();
  const [step, setStep] = useState<'confirm' | 'success'>('confirm');
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    customerName: state.user?.fullName || '',
    phone: state.user?.phone || '',
    // email removed
    address: state.user?.address || '',
    city: state.user?.city,
    sector: state.user?.sector,
    isTemporaryAddress: false,
    preferences: '',
    startDate: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen && state.user) {
      // Set default start date to tomorrow and populate user data
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setOrderDetails({
        customerName: state.user.fullName,
        phone: state.user.phone,
        // email removed
        address: state.user.address,
        isTemporaryAddress: false,
        preferences: '',
        startDate: tomorrow.toISOString().split('T')[0]
      });
    }
  }, [isOpen, state.user]);

  // Reset quantity when modal opens or order type changes
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen, orderType]);

  const handleInputChange = (field: keyof OrderDetails, value: string) => {
    setOrderDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };





  const [orderData, setOrderData] = useState<any>(null);

  const handleConfirmOrder = async () => {
    console.log('🟢 handleConfirmOrder invoked', { isLoading, orderType, startDate: orderDetails.startDate });
    // Validate that address is provided
    if (!orderDetails.address.trim()) {
      alert('Please enter your delivery address.');
      return;
    }

    setIsLoading(true);

    // Generate order ID
    const orderId = Date.now().toString().slice(-6);

    // Get dietary preference, dob, and referral info from user context
    const dietaryPreference = state.user?.dietaryPreference || 'vegetarian';
    const dob = state.user?.dateOfBirth || '';
    // Get referral info from user context (entered at signup)
    const referralCode = state.user?.referralCode || '';
    const referralName = state.user?.referralName || '';

    // Prepare order data based on order type
    const orderPayload = {
      customerName: orderDetails.customerName,
      phone: orderDetails.phone,
      // email removed
      address: orderDetails.address,
      city: orderDetails.city,
      sector: orderDetails.sector,
      isTemporaryAddress: orderDetails.isTemporaryAddress,
      planTitle: orderType === 'meal-plan' ? (selectedPlan?.title || '') : (selectedDish?.name || ''),
      planDuration: orderType === 'meal-plan' ? (selectedPlan?.duration || '') : 'Single Dish Order',
      planPrice: orderType === 'meal-plan' ? (selectedPlan?.discountedPrice?.toString() || '') : ((selectedDish?.price || 0) * quantity).toString(),
      startDate: orderType === 'individual-dish' ? new Date().toISOString().split('T')[0] : orderDetails.startDate,
      preferences: orderDetails.preferences,
      orderId: orderId,
      dietaryPreference,
      dob,
      referralCode: referralCode || undefined,
      referralName: referralName || undefined,
      // Additional dish-specific data
      orderType,
      dishDescription: orderType === 'individual-dish' ? selectedDish?.description : undefined,
      dishSpiceLevel: orderType === 'individual-dish' ? selectedDish?.spiceLevel : undefined,
      dishCalories: orderType === 'individual-dish' ? selectedDish?.calories : undefined,
      dishRating: orderType === 'individual-dish' ? selectedDish?.rating : undefined,
      dishPrepTime: orderType === 'individual-dish' ? selectedDish?.time : undefined,
      dishQuantity: orderType === 'individual-dish' ? quantity : undefined
    };

    // Store order data for immediate display
    setOrderData({
      ...orderPayload,
      timestamp: new Date().toLocaleString()
    });

    // Persist non-temporary address to user profile if different
    try {
      console.log('ℹ️ Attempting to persist address if needed', { isTemporary: orderDetails.isTemporaryAddress, hasStateUser: !!state.user });
      if (!orderDetails.isTemporaryAddress && state.user && orderDetails.address && orderDetails.address !== state.user.address) {
        // Update backend profile with new address
        const saveResp = await fetch('/api/user/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: state.user.phone,
            profile: { address: orderDetails.address }
          })
        });

        // If saved successfully, fetch the canonical server user and update local app state
        if (saveResp.ok) {
        console.log('✅ Profile save successful, fetching canonical server profile');
          try {
            const phoneEnc = encodeURIComponent(state.user.phone);
            const profResp = await fetch(`/api/user/profile?phone=${phoneEnc}`);
            if (profResp.ok) {
              const profJson = await profResp.json();
              const serverUser = profJson.user;
              if (serverUser) {
             console.log('✅ Server user fetched', { serverUserId: serverUser.id });
                const serverAddress = Array.isArray(serverUser.addresses) && serverUser.addresses.length > 0 ? serverUser.addresses[0] : (serverUser.address || '');
                const mergedUser = {
                  id: serverUser.id,
                  fullName: state.user?.fullName || serverUser.name || '',
                  email: serverUser.email || state.user?.email,
                  phone: serverUser.phone || state.user?.phone,
                  address: serverAddress || state.user?.address || '',
                  sector: serverUser.sector || state.user?.sector,
                  city: serverUser.city || state.user?.city,
                  dietaryPreference: state.user?.dietaryPreference || 'vegetarian',
                  dateOfBirth: state.user?.dateOfBirth || (serverUser.dob ? String(serverUser.dob).split('T')[0] : ''),
                  isAuthenticated: true,
                  referralCode: serverUser.referralCode || state.user?.referralCode,
                  referralName: serverUser.referralName || state.user?.referralName || undefined,
                } as any;
                dispatch({ type: 'SET_USER', payload: mergedUser });
              }
            }
          } catch (err) {
            console.warn('Failed to fetch server profile after save:', err);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to persist address to profile:', err);
    }

    // Send order to backend to persist
    try {
      const payloadPreview = {
        userId: state.user?.id,
        phone: orderDetails.phone,
        customerName: orderDetails.customerName,
        items: orderType === 'meal-plan' ? [{ plan: selectedPlan, qty: 1 }] : [{ dish: selectedDish, qty: quantity }],
        status: 'pending',
        deliveryAddress: { address: orderPayload.address, city: orderPayload.city, sector: orderPayload.sector },
        subtotal: orderType === 'meal-plan' ? (selectedPlan?.discountedPrice || 0) : ((selectedDish?.price || 0) * quantity),
        total: orderType === 'meal-plan' ? (selectedPlan?.discountedPrice || 0) : ((selectedDish?.price || 0) * quantity),
        paymentMethod: 'cash-on-delivery',
        specialInstructions: orderPayload.preferences,
      };
      console.log('➡️ Sending order to /api/orders with payload:', payloadPreview);

      const userId = state.user?.id;
      const createResp = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          phone: orderDetails.phone,
          customerName: orderDetails.customerName,
          items: orderType === 'meal-plan' ? [{ plan: selectedPlan, qty: 1 }] : [{ dish: selectedDish, qty: quantity }],
          status: 'pending',
          deliveryAddress: {
            address: orderPayload.address,
            city: orderPayload.city,
            sector: orderPayload.sector,
          },
          subtotal: orderType === 'meal-plan' ? (selectedPlan?.discountedPrice || 0) : ((selectedDish?.price || 0) * quantity),
          total: orderType === 'meal-plan' ? (selectedPlan?.discountedPrice || 0) : ((selectedDish?.price || 0) * quantity),
          paymentMethod: 'cash-on-delivery',
          specialInstructions: orderPayload.preferences,
        })
      });
      console.log('⬅️ /api/orders response status:', createResp.status, 'ok:', createResp.ok);
      let respBody = null;
      try {
        respBody = await createResp.json();
      } catch (e) {
        console.warn('Failed to parse /api/orders response as JSON', e);
      }
      console.log('⬅️ /api/orders response body:', respBody);

      if (createResp.ok) {
        const savedOrder = respBody?.order;
        // Store server order id locally so success UI can show it
        setOrderData((prev: any) => ({ ...(prev || {}), savedOrderId: savedOrder?.id }));
      } else {
        console.warn('Order API returned non-OK response', respBody);
      }
    } catch (err) {
      console.warn('Failed to persist order to backend:', err);
    }

    // Simulate short processing delay for UX
    await new Promise(resolve => setTimeout(resolve, 800));

    setIsLoading(false);
    setStep('success');
  };

  const resetModal = () => {
    setStep('confirm');
    setOrderDetails({
      customerName: state.user?.fullName || '',
      phone: state.user?.phone || '',
      // email removed
      address: state.user?.address || '',
      city: state.user?.city,
      sector: state.user?.sector,
      isTemporaryAddress: false,
      preferences: '',
      startDate: ''
    });
    setIsLoading(false);
    setQuantity(1);
  };

  const handleDownloadInvoice = () => {
    if (!orderData) return;

    try {
      const invoiceData = generateInvoiceData(orderData, orderDetails, orderType);
      generateInvoicePDF(invoiceData);
    } catch (error) {
      console.error('Error generating invoice:', error);
      // Show user-friendly error message
      alert('Unable to generate invoice. Please try again or contact support.');
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetModal, 300);
  };

  if (!selectedPlan && !selectedDish) return null;

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
            className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 max-w-sm sm:max-w-md w-full shadow-xl ring-1 ring-black/5 max-h-[75vh] sm:max-h-[70vh] overflow-y-auto mx-auto scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {step === 'confirm' && 'Confirm Order'}
                {step === 'success' && 'Order Confirmed'}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-green-50 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-3 sm:mb-4">
              <div className="flex items-center space-x-3">
                <Utensils className="w-6 h-6 text-green-600" />
                <div className="flex-1">
                  {orderType === 'meal-plan' && selectedPlan ? (
                    <>
                      <h3 className="font-semibold text-gray-800">{selectedPlan.title}</h3>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-green-600 font-bold">₹{selectedPlan.discountedPrice}</span>
                        <span className="text-gray-500 line-through">₹{selectedPlan.originalPrice}</span>
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                          {selectedPlan.discount}% off
                        </span>
                      </div>
                    </>
                  ) : orderType === 'individual-dish' && selectedDish ? (
                    <>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-800 leading-tight">{selectedDish.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                          <span className="text-green-600 font-bold">₹{selectedDish.price}</span>
                          <span className={`px-1 sm:px-2 py-1 rounded-full text-xs ${
                            selectedDish.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {selectedDish.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="mt-2 sm:mt-3 flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Qty:</span>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <button
                            type="button"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors text-xs sm:text-sm"
                          >
                            -
                          </button>
                          <span className="w-5 sm:w-6 text-center font-medium text-xs sm:text-sm">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors text-xs sm:text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total Price */}
                      {quantity > 1 && (
                        <div className="mt-1 sm:mt-2 text-right">
                          <span className="text-xs sm:text-sm text-gray-600">Total: </span>
                          <span className="text-sm sm:text-base font-bold text-green-600">₹{selectedDish.price * quantity}</span>
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Order Confirmation */}
            {step === 'confirm' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Customer Details */}
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-3 space-y-1 sm:space-y-2">
                  <h3 className="font-semibold text-gray-800 text-xs sm:text-sm">Customer Details</h3>
                  <div className="text-xs sm:text-sm space-y-1">
                    <div className="flex items-center space-x-2">
                      <User className="w-3 h-3 text-gray-600 flex-shrink-0" />
                      <span className="font-medium truncate">{orderDetails.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3 h-3 text-gray-600 flex-shrink-0" />
                      <span className="truncate">{orderDetails.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Delivery Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <textarea
                      value={orderDetails.address}
                      onChange={(e) => {
                        const address = e.target.value;
                        setOrderDetails(prev => ({
                          ...prev,
                          address,
                          isTemporaryAddress: address !== state.user?.address
                        }));
                      }}
                      placeholder="Enter your hostel name or complete address in Bokaro"
                      rows={3}
                      className="w-full pl-10 pr-3 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors text-xs sm:text-sm resize-none"
                      required
                    />
                  </div>
                  {orderDetails.isTemporaryAddress && (
                    <p className="text-xs text-blue-600">
                      📍 Using different address for this order (won't update your profile)
                    </p>
                  )}
                </div>

                {/* Order Preferences */}
                <div className="space-y-2 sm:space-y-3">
                  {orderType === 'meal-plan' && (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={orderDetails.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="w-full px-2 sm:px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors text-xs sm:text-sm"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Special Preferences (Optional)
                    </label>
                    <textarea
                      value={orderDetails.preferences}
                      onChange={(e) => handleInputChange('preferences', e.target.value)}
                      className="w-full px-2 sm:px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors text-xs sm:text-sm resize-none"
                      placeholder="Any dietary preferences"
                      rows={2}
                    />
                  </div>
                </div>

                <motion.button
                  onClick={handleConfirmOrder}
                  disabled={isLoading || (orderType === 'meal-plan' && !orderDetails.startDate)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-2 sm:py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base ${
                    (orderType === 'individual-dish' || orderDetails.startDate) && !isLoading
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
                className="text-center space-y-3 sm:space-y-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                >
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                </motion.div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-green-600 mb-1 sm:mb-2">
                    Order Placed Successfully!
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Thank you for choosing Mealzee. Your order is being processed.
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-1 sm:space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Order ID:</span>
                    <span className="text-xs sm:text-sm font-bold text-green-700">#{orderData?.orderId}</span>
                  </div>

                  {orderType === 'meal-plan' && selectedPlan ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Plan:</span>
                        <span className="text-xs sm:text-sm text-gray-600 text-right max-w-[60%] truncate" title={selectedPlan.title}>
                          {selectedPlan.title}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Amount:</span>
                        <span className="text-xs sm:text-sm font-bold text-green-600">₹{selectedPlan.discountedPrice}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Start Date:</span>
                        <span className="text-xs sm:text-sm text-gray-600">{orderDetails.startDate}</span>
                      </div>
                    </>
                  ) : orderType === 'individual-dish' && selectedDish ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Dish:</span>
                        <span className="text-xs sm:text-sm text-gray-600 text-right max-w-[60%] truncate" title={selectedDish.name}>
                          {selectedDish.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Quantity:</span>
                        <span className="text-xs sm:text-sm text-gray-600">{quantity}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Amount:</span>
                        <span className="text-xs sm:text-sm font-bold text-green-600">₹{selectedDish.price * quantity}</span>
                      </div>
                    </>
                  ) : null}
                </div>

                {/* <div className="bg-blue-50 rounded-xl p-4">
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
                </div> */}

                <div className="bg-yellow-50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm text-yellow-700">
                    📞 <strong>Need help?</strong> Call us at +91 9204666105 for any queries.
                  </p>
                </div>

                {/* Invoice Download Button */}
                {/* <motion.button
                  onClick={handleDownloadInvoice}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Invoice</span>
                </motion.button> */}

                <motion.button
                  onClick={() => {
                    dispatch({ type: 'CLOSE_ORDER_MODAL' });
                    dispatch({ type: 'RESET_ORDER_FLOW' });
                    resetModal();
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-green-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm sm:text-base"
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
