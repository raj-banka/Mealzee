'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { NominatimAddress } from '@/types';
import { isLocationServiceable, getServiceAreaInfo } from '@/lib/location';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, lat?: number, lon?: number) => void;
  placeholder?: string;
  className?: string;
  showValidation?: boolean;
  onValidationChange?: (isValid: boolean, message: string) => void;
}

interface AddressSuggestion {
  display_name: string;
  lat: number;
  lon: number;
  formatted_address: string;
  isPredefined?: boolean;
}

// Predefined suggestions for Bokaro Steel City service areas
const PREDEFINED_SUGGESTIONS: AddressSuggestion[] = [
  {
    display_name: 'Sector 3, Bokaro Steel City, Jharkhand 827003',
    lat: 23.669296,
    lon: 86.151115,
    formatted_address: 'Sector 3, Bokaro Steel City, Jharkhand, 827003',
    isPredefined: true
  },
  {
    display_name: 'Sector 4, Bokaro Steel City, Jharkhand 827004',
    lat: 23.671203,
    lon: 86.1573709,
    formatted_address: 'Sector 4, Bokaro Steel City, Jharkhand, 827004',
    isPredefined: true
  },
  {
    display_name: 'Sector 5, Bokaro Steel City, Jharkhand 827005',
    lat: 23.6655,
    lon: 86.1675,
    formatted_address: 'Sector 5, Bokaro Steel City, Jharkhand, 827005',
    isPredefined: true
  }
];

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Enter your delivery address",
  className = "",
  showValidation = true,
  onValidationChange
}) => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid' | 'loading'>('idle');
  const [validationMessage, setValidationMessage] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Debounced search function
  const searchAddresses = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // For short queries, show predefined suggestions that match
    if (query.length < 3) {
      const matchingPredefined = PREDEFINED_SUGGESTIONS.filter(suggestion =>
        suggestion.formatted_address.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(matchingPredefined);
      setShowSuggestions(matchingPredefined.length > 0);
      return;
    }

    setIsLoading(true);

    try {
      // Enhanced search with Bokaro Steel City context for better results
      const searchQueries = [
        // Primary search with Bokaro Steel City context
        `${query}, Bokaro Steel City, Jharkhand`,
        // Secondary search with specific sectors if query doesn't include them
        ...(!/sector\s*[345]/i.test(query) ? [
          `Sector 3, ${query}, Bokaro Steel City, Jharkhand`,
          `Sector 4, ${query}, Bokaro Steel City, Jharkhand`,
          `Sector 5, ${query}, Bokaro Steel City, Jharkhand`
        ] : []),
        // Fallback with just the query
        query
      ];

      let allResults: NominatimAddress[] = [];

      // Try each search query until we get good results
      for (const searchQuery of searchQueries) {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&limit=3&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'Mealzee-App/1.0 (mealzeeindia@gmail.com)'
            }
          }
        );

        if (response.ok) {
          const data: NominatimAddress[] = await response.json();
          allResults = [...allResults, ...data];

          // If we have good results from Bokaro area, prioritize them
          const bokaroResults = data.filter(item =>
            item.display_name.toLowerCase().includes('bokaro') ||
            item.address?.city?.toLowerCase().includes('bokaro') ||
            item.address?.postcode?.match(/^82700[345]$/)
          );

          if (bokaroResults.length > 0) {
            allResults = [...bokaroResults, ...allResults.filter(item => !bokaroResults.includes(item))];
            break; // Use these results
          }
        }

        // Small delay between requests to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Remove duplicates and limit results
      const uniqueResults = allResults.filter((item, index, self) =>
        index === self.findIndex(t => t.lat === item.lat && t.lon === item.lon)
      ).slice(0, 3); // Limit API results to make room for predefined suggestions

      const apiSuggestions: AddressSuggestion[] = uniqueResults.map(item => ({
        display_name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        formatted_address: formatAddress(item),
        isPredefined: false
      }));

      // Add relevant predefined suggestions
      const matchingPredefined = PREDEFINED_SUGGESTIONS.filter(suggestion =>
        suggestion.formatted_address.toLowerCase().includes(query.toLowerCase()) ||
        query.toLowerCase().includes('sector')
      );

      // Combine predefined suggestions first, then API results
      const combinedSuggestions = [
        ...matchingPredefined,
        ...apiSuggestions.filter(api =>
          !matchingPredefined.some(pred =>
            Math.abs(pred.lat - api.lat) < 0.001 && Math.abs(pred.lon - api.lon) < 0.001
          )
        )
      ].slice(0, 5);

      setSuggestions(combinedSuggestions);
      setShowSuggestions(combinedSuggestions.length > 0);
    } catch (error) {
      console.error('Address search error:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Format address from Nominatim response with Bokaro Steel City specific formatting
  const formatAddress = (item: NominatimAddress): string => {
    const addr = item.address;
    const parts = [];

    // Handle sector information specifically for Bokaro Steel City
    const isBokaro = addr.city?.toLowerCase().includes('bokaro') ||
                     addr.town?.toLowerCase().includes('bokaro') ||
                     item.display_name.toLowerCase().includes('bokaro');

    // For Bokaro addresses, prioritize sector information
    if (isBokaro) {
      // Check if sector is mentioned in suburb or road
      const sectorMatch = (addr.suburb || addr.road || '')?.match(/sector\s*([345])/i);
      if (sectorMatch) {
        parts.push(`Sector ${sectorMatch[1]}`);
      }
    }

    // Add road/house number
    if (addr.house_number && addr.road) {
      parts.push(`${addr.house_number} ${addr.road}`);
    } else if (addr.road && !parts.some(p => p && p.toLowerCase().includes(addr.road!.toLowerCase()))) {
      parts.push(addr.road);
    }

    // Add suburb if not already included
    if (addr.suburb && !parts.some(p => p && p.toLowerCase().includes(addr.suburb!.toLowerCase()))) {
      parts.push(addr.suburb);
    }

    // Add city
    if (addr.city || addr.town || addr.village) {
      const city = addr.city || addr.town || addr.village;
      if (city && !parts.some(p => p && p.toLowerCase().includes(city.toLowerCase()))) {
        parts.push(city);
      }
    }

    // Add state
    if (addr.state && !parts.some(p => p && p.toLowerCase().includes(addr.state!.toLowerCase()))) {
      parts.push(addr.state);
    }

    // Add postcode (prioritize Bokaro pin codes)
    if (addr.postcode) {
      const isBokaroPincode = /^8270[0-9][0-9]$/.test(addr.postcode);
      if (isBokaroPincode || !isBokaro) {
        parts.push(addr.postcode);
      }
    }

    return parts.join(', ');
  };

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Set new debounce
    debounceRef.current = setTimeout(() => {
      searchAddresses(newValue);
    }, 300);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: AddressSuggestion) => {
    onChange(suggestion.formatted_address, suggestion.lat, suggestion.lon);
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Validate the selected address
    if (showValidation) {
      validateAddress(suggestion.formatted_address, suggestion.lat, suggestion.lon);
    }
  };

  // Validate address (check if it's in serviceable area)
  const validateAddress = async (addressText: string, lat: number, lon: number) => {
    setValidationStatus('loading');
    setValidationMessage('Checking service availability...');

    try {
      const coordinates = { lat, lng: lon };
      const isServiceable = isLocationServiceable(coordinates);
      const serviceInfo = getServiceAreaInfo(coordinates);

      if (isServiceable) {
        setValidationStatus('valid');
        setValidationMessage(`✅ Perfect! We deliver to this area. You're ${serviceInfo.distanceToNearestService}km from ${serviceInfo.nearestServiceSector}.`);
        onValidationChange?.(true, `Address "${addressText}" is in serviceable area`);
      } else {
        setValidationStatus('invalid');
        const closestSector = serviceInfo.allDistances.reduce((closest, current) =>
          current.distance < closest.distance ? current : closest
        );

        // Provide specific guidance based on location
        let message = `❌ Sorry, this location is ${closestSector.distance}km from ${closestSector.sector}. `;

        if (closestSector.distance <= 5) {
          message += `We currently deliver within 2.5km radius of Sectors 3, 4, and 5 in Bokaro Steel City (Pin: 827003, 827004, 827005). You're close - please check if you have the correct sector address.`;
        } else {
          message += `We only deliver to Sectors 3, 4, and 5 in Bokaro Steel City, Jharkhand (Pin codes: 827003, 827004, 827005).`;
        }

        setValidationMessage(message);
        onValidationChange?.(false, `Address "${addressText}" is outside serviceable area`);
      }
    } catch (error) {
      console.error('Address validation error:', error);
      setValidationStatus('invalid');
      setValidationMessage('Unable to validate address. Please try again.');
      onValidationChange?.(false, 'Validation failed');
    }
  };

  // Handle click outside to close suggestions
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

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const getValidationIcon = () => {
    switch (validationStatus) {
      case 'loading':
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'valid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'invalid':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <MapPin className="w-5 h-5 text-gray-400" />;
    }
  };

  const getValidationColor = () => {
    switch (validationStatus) {
      case 'valid':
        return 'border-green-300 focus:ring-green-500';
      case 'invalid':
        return 'border-red-300 focus:ring-red-500';
      case 'loading':
        return 'border-blue-300 focus:ring-blue-500';
      default:
        return 'border-gray-300 focus:ring-green-500';
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
        
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Loader className="w-5 h-5 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                  suggestion.isPredefined ? 'bg-green-50 hover:bg-green-100' : ''
                }`}
                onClick={() => handleSuggestionSelect(suggestion)}
              >
                <div className="flex items-start space-x-3">
                  <MapPin className={`w-4 h-4 mt-1 flex-shrink-0 ${
                    suggestion.isPredefined ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {suggestion.formatted_address}
                      </p>
                      {suggestion.isPredefined && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Service Area
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {suggestion.display_name}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Validation Message */}
      {showValidation && (
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
      )}
    </div>
  );
};

export default AddressAutocomplete;
