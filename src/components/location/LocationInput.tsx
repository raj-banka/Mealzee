'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Search, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { getCurrentLocation, reverseGeocode, getLocationSuggestions, validateServiceArea, LocationData } from '@/lib/location';

interface LocationInputProps {
  value: string;
  onChange: (address: string, locationData?: LocationData) => void;
  placeholder?: string;
  className?: string;
  showCurrentLocationButton?: boolean;
  validateOnChange?: boolean;
}

const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  placeholder = "Enter your delivery address",
  className = "",
  showCurrentLocationButton = true,
  validateOnChange = true
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid' | 'loading'>('idle');
  const [validationMessage, setValidationMessage] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounced search for suggestions
  useEffect(() => {
    if (value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await getLocationSuggestions(value);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Error getting suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value]);

  // Validate address on change
  useEffect(() => {
    if (!validateOnChange || value.length < 5) {
      setValidationStatus('idle');
      setValidationMessage('');
      return;
    }

    const timeoutId = setTimeout(async () => {
      setValidationStatus('loading');
      try {
        const result = await validateServiceArea(value);
        if (result.isValid) {
          setValidationStatus('valid');
          setValidationMessage(result.message);
        } else {
          setValidationStatus('invalid');
          setValidationMessage(result.message);
        }
      } catch (error) {
        setValidationStatus('invalid');
        setValidationMessage('Unable to validate address. Please try again.');
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [value, validateOnChange]);

  // Handle current location
  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    setValidationStatus('loading');
    setValidationMessage('Getting your location...');

    try {
      const coordinates = await getCurrentLocation();
      const locationData = await reverseGeocode(coordinates);

      // Check if the detected location is serviceable
      const addressString = `${locationData.sector ? locationData.sector + ', ' : ''}${locationData.city}, ${locationData.state}${locationData.pincode ? ' - ' + locationData.pincode : ''}`;

      if (locationData.isServiceable) {
        onChange(addressString, locationData);
        setValidationStatus('valid');
        setValidationMessage('Location detected and verified!');
      } else {
        onChange(addressString, locationData);
        setValidationStatus('invalid');
        setValidationMessage('Location detected but not in our service area. We serve Sector 3, 4, and 5 in Bokaro Steel City.');
      }
      setShowSuggestions(false);
    } catch (error) {
      console.error('Error getting location:', error);
      setValidationStatus('invalid');
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setValidationMessage('Location access denied. Please enable location services.');
            break;
          case error.POSITION_UNAVAILABLE:
            setValidationMessage('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setValidationMessage('Location request timed out.');
            break;
          default:
            setValidationMessage('Unable to get your location.');
            break;
        }
      } else {
        setValidationMessage('Unable to get your location. Please enter manually.');
      }
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: LocationData) => {
    onChange(suggestion.address, suggestion);
    setShowSuggestions(false);
    // Always show as valid - AuthModal will handle redirection if not serviceable
    setValidationStatus('valid');
    setValidationMessage('Address selected successfully!');
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (newValue !== value) {
      setValidationStatus('idle');
      setValidationMessage('');
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getValidationIcon = () => {
    switch (validationStatus) {
      case 'loading':
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'invalid':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <MapPin className="w-4 h-4 text-gray-400" />;
    }
  };

  const getValidationColor = () => {
    switch (validationStatus) {
      case 'valid':
        return 'border-green-300 focus:border-green-500 focus:ring-green-200';
      case 'invalid':
        return 'border-red-300 focus:border-red-500 focus:ring-red-200';
      case 'loading':
        return 'border-blue-300 focus:border-blue-500 focus:ring-blue-200';
      default:
        return 'border-gray-300 focus:border-blue-500 focus:ring-blue-200';
    }
  };

  return (
    <div className="relative">
      {/* Input Field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {getValidationIcon()}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${getValidationColor()} ${className}`}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />

        {/* Current Location Button */}
        {showCurrentLocationButton && (
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isGettingLocation}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-600 hover:text-blue-700 disabled:opacity-50"
            title="Use current location"
          >
            {isGettingLocation ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Validation Message */}
      <AnimatePresence>
        {validationMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-2 text-sm flex items-center space-x-2 ${
              validationStatus === 'valid' ? 'text-green-600' : 
              validationStatus === 'invalid' ? 'text-red-600' : 
              'text-blue-600'
            }`}
          >
            {validationStatus === 'valid' && <CheckCircle className="w-4 h-4" />}
            {validationStatus === 'invalid' && <AlertCircle className="w-4 h-4" />}
            {validationStatus === 'loading' && <Loader className="w-4 h-4 animate-spin" />}
            <span>{validationMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto scrollbar-hide"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => handleSuggestionSelect(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                whileHover={{ backgroundColor: '#f9fafb' }}
              >
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {suggestion.sector && `${suggestion.sector}, `}
                      {suggestion.city}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {suggestion.address}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
            
            {isLoading && (
              <div className="px-4 py-3 text-center text-gray-500">
                <Loader className="w-4 h-4 animate-spin mx-auto mb-2" />
                <div className="text-sm">Searching locations...</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationInput;
