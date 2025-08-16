'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import LocationPicker from './LocationPicker';

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  landmark?: string;
  sector?: string;
  city?: string;
  pincode?: string;
}

interface SimpleAddressInputProps {
  value: string;
  onChange: (address: string) => void;
  onLocationChange?: (location: LocationData) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
  showLocationPicker?: boolean;
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
}

const SimpleAddressInput: React.FC<SimpleAddressInputProps> = ({
  value,
  onChange,
  onLocationChange,
  placeholder = "Enter your delivery address",
  className = "",
  label = "Delivery Address",
  required = false,
  showLocationPicker = true,
  initialLocation
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);

  const handleLocationSelect = (location: LocationData) => {
    onChange(location.address);
    if (onLocationChange) {
      onLocationChange(location);
    }
  };

  const handleFetchLocationClick = async () => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    // Request permission immediately
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      if (permission.state === 'denied') {
        alert('Location permission is denied. Please enable location access in your browser settings and try again.');
        return;
      }
    } catch (error) {
      console.log('Permission API not supported, proceeding with geolocation request');
    }

    // Open the location picker modal
    setIsLocationPickerOpen(true);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className={`h-5 w-5 transition-colors ${
            isFocused ? 'text-olive-500' : 'text-gray-400'
          }`} />
        </div>
        
        <motion.textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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

      {/* Live Location Button */}
      {showLocationPicker && (
        <motion.button
          type="button"
          onClick={handleFetchLocationClick}
          className="flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-olive-500 to-olive-600 hover:from-olive-600 hover:to-olive-700 rounded-lg transition-all duration-200 border border-olive-400 shadow-md hover:shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Navigation className="w-4 h-4" />
          <span>📍 Fetch Live Location</span>
        </motion.button>
      )}

      {/* Location Picker Modal */}
      <LocationPicker
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onLocationSelect={handleLocationSelect}
        initialLocation={initialLocation}
      />
    </div>
  );
};

export default SimpleAddressInput;
