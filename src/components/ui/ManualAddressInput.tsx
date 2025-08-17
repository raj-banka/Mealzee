'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronDown, AlertCircle, CheckCircle, X } from 'lucide-react';
import {
  getSectorsForCity,
  validateServiceArea
} from '@/utils/serviceArea';

interface AddressData {
  fullAddress: string;
  sector: string;
}

interface ManualAddressInputProps {
  value: string;
  onChange: (address: string) => void;
  onAddressChange?: (addressData: AddressData) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
}

const ManualAddressInput: React.FC<ManualAddressInputProps> = ({
  value,
  onChange,
  onAddressChange,
  placeholder = "Enter your hostel name or complete address in Bokaro",
  className = "",
  label = "Delivery Address",
  required = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedSector, setSelectedSector] = useState('');
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);
  const [showValidationPopup, setShowValidationPopup] = useState(false);

  // Get all sectors from Bokaro Steel City, Jharkhand
  const sectors = getSectorsForCity('Bokaro Steel City');

  // Validate service area when sector changes
  useEffect(() => {
    if (selectedSector) {
      const result = validateServiceArea('Bokaro Steel City', selectedSector);
      setValidationResult(result);

      if (!result.isValid) {
        setShowValidationPopup(true);
      }
    }
  }, [selectedSector]);

  // Memoize the address change callback to prevent infinite loops
  const handleAddressChange = useCallback((addressData: AddressData) => {
    if (onAddressChange) {
      onAddressChange(addressData);
    }
  }, [onAddressChange]);



  const handleSectorSelect = (sector: string) => {
    setSelectedSector(sector);
    setShowSectorDropdown(false);

    // Always call the callback when sector is selected, even if address is empty
    // This allows users to select sector at any time
    if (handleAddressChange) {
      handleAddressChange({
        fullAddress: value, // Use current address value (can be empty or filled)
        sector: sector
      });
    }
  };

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Update parent when address text changes and we have a selected sector
  useEffect(() => {
    if (selectedSector && handleAddressChange) {
      // Debounce the callback to avoid too many calls while typing
      const timeoutId = setTimeout(() => {
        handleAddressChange({
          fullAddress: value,
          sector: selectedSector
        });
      }, 300); // 300ms delay

      return () => clearTimeout(timeoutId);
    }
  }, [value, selectedSector, handleAddressChange]);

  const closeValidationPopup = () => {
    setShowValidationPopup(false);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {/* Full Address Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className={`h-5 w-5 transition-colors ${
            isFocused ? 'text-olive-500' : 'text-gray-400'
          }`} />
        </div>
        
        <motion.textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          rows={3}
          className={`
            block w-full pl-10 pr-3 py-3
            border border-gray-300 rounded-lg
            placeholder-gray-500 text-gray-900
            focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-olive-500
            transition-all duration-200 resize-none
            ${isFocused ? 'shadow-md' : 'shadow-sm'}
          `}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>

      {/* Sector Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-600">
          Select Sector in Bokaro Steel City <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          You can select your sector before or after entering your address
        </p>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowSectorDropdown(!showSectorDropdown)}
            className="w-full px-4 py-3 text-left bg-white border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 flex items-center justify-between hover:border-gray-300 transition-colors"
          >
            <span className={selectedSector ? 'text-gray-900 font-medium' : 'text-gray-500'}>
              {selectedSector || 'Choose your sector (can be selected anytime)'}
            </span>
            <ChevronDown className={`w-5 h-5 transition-transform ${showSectorDropdown ? 'rotate-180' : ''} ${selectedSector ? 'text-green-600' : 'text-gray-400'}`} />
          </button>

          <AnimatePresence>
            {showSectorDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: "spring", duration: 0.2 }}
                className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto"
              >
                <div className="p-2">
                  {sectors.map((sector, index) => (
                    <button
                      key={sector}
                      type="button"
                      onClick={() => handleSectorSelect(sector)}
                      className={`w-full px-3 py-2.5 text-left hover:bg-green-50 focus:bg-green-50 focus:outline-none transition-colors rounded-lg text-sm ${
                        index === 0 ? 'rounded-t-lg' : ''
                      } ${
                        index === sectors.length - 1 ? 'rounded-b-lg' : ''
                      } ${
                        selectedSector === sector ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {sector}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Show selected sector info */}
        {selectedSector && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">
                <strong>{selectedSector}</strong> will be automatically added to your complete address
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Validation Status */}
      {validationResult && (
        <div className={`flex items-center space-x-2 p-3 rounded-lg ${
          validationResult.isValid 
            ? 'bg-green-50 text-green-700' 
            : 'bg-red-50 text-red-700'
        }`}>
          {validationResult.isValid ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">{validationResult.message}</span>
        </div>
      )}

      {/* Service Area Validation Popup */}
      <AnimatePresence>
        {showValidationPopup && validationResult && !validationResult.isValid && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeValidationPopup}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Service Area Notice</h3>
                <button
                  onClick={closeValidationPopup}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="flex items-start space-x-3 mb-6">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{validationResult.message}</p>
              </div>
              
              <button
                onClick={closeValidationPopup}
                className="w-full py-3 bg-olive-600 text-white rounded-lg font-medium hover:bg-olive-700 transition-colors"
              >
                Understood
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManualAddressInput;
