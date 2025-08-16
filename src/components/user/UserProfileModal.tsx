'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar, MapPin, Phone, Cake, Edit2, Save } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Button from '@/components/ui/Button';
import Portal from '@/components/ui/Portal';
import SimpleAddressInput from '@/components/ui/SimpleAddressInput';
import { Z_INDEX } from '@/lib/constants';


interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { state, logout, login } = useApp();
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editedAddress, setEditedAddress] = useState('');
  const [editedLocation, setEditedLocation] = useState<{
    latitude?: number;
    longitude?: number;
  }>({});

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleEditAddress = () => {
    setEditedAddress(state.user?.address || '');
    setEditedLocation({
      latitude: state.user?.latitude,
      longitude: state.user?.longitude
    });
    setIsEditingAddress(true);
  };

  const handleSaveAddress = () => {
    if (!editedAddress.trim()) {
      alert('Please enter your delivery address.');
      return;
    }

    if (state.user) {
      // Update user data with new address and location
      login({
        fullName: state.user.fullName,
        phone: state.user.phone,
        address: editedAddress,
        latitude: editedLocation.latitude,
        longitude: editedLocation.longitude,
        dietaryPreference: state.user.dietaryPreference,
        dateOfBirth: state.user.dateOfBirth,
        referralCode: state.user.referralCode,
        referralName: state.user.referralName,
      });
    }
    setIsEditingAddress(false);
  };

  const handleCancelEdit = () => {
    setIsEditingAddress(false);
    setEditedAddress('');
    setEditedLocation({});
  };

  if (!state.user) return null;

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 grid place-items-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: Z_INDEX.modal
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-xl ring-1 ring-black/5 w-full max-w-sm sm:max-w-md max-h-[75vh] sm:max-h-[70vh] overflow-hidden mx-auto flex flex-col"
            style={{ position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Fixed */}
            <div className="bg-gradient-to-r from-olive-500 to-olive-600 p-5 text-white relative flex-shrink-0">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{state.user.fullName}</h2>
                  <p className="text-white/80 text-sm">Mealzee Member</p>
                </div>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-5 scrollbar-hide" style={{ maxHeight: 'calc(70vh - 96px)' }}>
              {/* User Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{state.user.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <Cake className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">{state.user.dateOfBirth || 'Not provided'}</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-gray-600" />
                      <p className="text-sm text-gray-500">Address</p>
                    </div>
                    {!isEditingAddress && (
                      <button
                        onClick={handleEditAddress}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                    )}
                  </div>

                  {isEditingAddress ? (
                    <div className="space-y-3">
                      <SimpleAddressInput
                        value={editedAddress}
                        onChange={(address) => {
                          setEditedAddress(address);
                        }}
                        onLocationChange={(location) => {
                          setEditedAddress(location.address);
                          setEditedLocation({
                            latitude: location.latitude,
                            longitude: location.longitude
                          });
                        }}
                        placeholder="Enter your new address"
                        className="text-sm"
                        label=""
                        required={true}
                        initialLocation={editedLocation.latitude && editedLocation.longitude ? {
                          latitude: editedLocation.latitude,
                          longitude: editedLocation.longitude
                        } : undefined}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveAddress}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center space-x-1 px-3 py-1 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="font-medium text-sm">{state.user.address}</p>
                  )}
                </div>
              </div>

              {/* Current Plan */}
              {state.selectedMealPlan && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-800">Current Plan</h3>
                  </div>
                  <p className="font-medium text-green-700">{state.selectedMealPlan.title}</p>
                  <p className="text-sm text-green-600">{state.selectedMealPlan.duration}</p>
                  <p className="text-lg font-bold text-green-800 mt-1">
                    ₹{state.selectedMealPlan.discountedPrice}
                  </p>
                </div>
              )}



              {/* Actions */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default UserProfileModal;
