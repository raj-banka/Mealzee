'use client';

import { useState, useEffect, useCallback } from 'react';
import { LocationData, Address } from '@/types';
import {
  getCurrentLocation as getGeoLocation,
  reverseGeocode,
  forwardGeocode,
  getLocationSuggestions,
  validateServiceArea
} from '@/lib/location';

interface UseLocationReturn {
  currentLocation: LocationData | null;
  selectedAddress: Address | null;
  isLoading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<void>;
  setSelectedAddress: (address: Address) => void;
  clearLocation: () => void;
  searchLocations: (query: string) => Promise<LocationData[]>;
  validateAddress: (address: string) => Promise<{ isValid: boolean; message: string; suggestions?: LocationData[] }>;
}

export function useLocation(): UseLocationReturn {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [selectedAddress, setSelectedAddressState] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('foodie_location');
    const savedAddress = localStorage.getItem('foodie_selected_address');
    
    if (savedLocation) {
      try {
        setCurrentLocation(JSON.parse(savedLocation));
      } catch (error) {
        console.error('Error parsing saved location:', error);
      }
    }

    if (savedAddress) {
      try {
        setSelectedAddressState(JSON.parse(savedAddress));
      } catch (error) {
        console.error('Error parsing saved address:', error);
      }
    }
  }, []);

  // Save location to localStorage whenever it changes
  useEffect(() => {
    if (currentLocation) {
      localStorage.setItem('foodie_location', JSON.stringify(currentLocation));
    }
  }, [currentLocation]);

  useEffect(() => {
    if (selectedAddress) {
      localStorage.setItem('foodie_selected_address', JSON.stringify(selectedAddress));
    } else {
      localStorage.removeItem('foodie_selected_address');
    }
  }, [selectedAddress]);

  const getCurrentLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get current coordinates using browser geolocation
      const coordinates = await getGeoLocation();

      // Reverse geocode to get detailed address information
      const locationData = await reverseGeocode(coordinates);

      // Check if location is serviceable
      if (!locationData.isServiceable) {
        setError(`Sorry, we don't deliver to this area yet. We currently serve Bokaro Steel City, Jharkhand and surrounding areas within 15km radius.`);
      }

      setCurrentLocation(locationData);
    } catch (error) {
      console.error('Error getting location:', error);

      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied. Please enable location services and try again.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable. Please enter your address manually.');
            break;
          case error.TIMEOUT:
            setError('Location request timed out. Please try again or enter your address manually.');
            break;
          default:
            setError('An unknown error occurred while retrieving location.');
            break;
        }
      } else {
        setError('Failed to get current location. Please enter your address manually.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setSelectedAddress = useCallback((address: Address) => {
    setSelectedAddressState(address);
    
    // Also update current location based on the selected address
    const locationData: LocationData = {
      address: `${address.street}, ${address.city}`,
      coordinates: address.coordinates || { lat: 0, lng: 0 },
      city: address.city,
      state: address.state,
      country: address.country,
    };
    
    setCurrentLocation(locationData);
  }, []);

  const clearLocation = useCallback(() => {
    setCurrentLocation(null);
    setSelectedAddressState(null);
    setError(null);
    localStorage.removeItem('foodie_location');
    localStorage.removeItem('foodie_selected_address');
  }, []);

  const searchLocations = useCallback(async (query: string): Promise<LocationData[]> => {
    try {
      return await getLocationSuggestions(query);
    } catch (error) {
      console.error('Error searching locations:', error);
      return [];
    }
  }, []);

  const validateAddress = useCallback(async (address: string) => {
    try {
      return await validateServiceArea(address);
    } catch (error) {
      console.error('Error validating address:', error);
      return {
        isValid: false,
        message: 'Unable to validate address. Please try again.'
      };
    }
  }, []);

  return {
    currentLocation,
    selectedAddress,
    isLoading,
    error,
    getCurrentLocation,
    setSelectedAddress,
    clearLocation,
    searchLocations,
    validateAddress,
  };
}

// Hook for address management
export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load addresses from localStorage
    const savedAddresses = localStorage.getItem('foodie_addresses');
    if (savedAddresses) {
      try {
        setAddresses(JSON.parse(savedAddresses));
      } catch (error) {
        console.error('Error parsing saved addresses:', error);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Save addresses to localStorage
    localStorage.setItem('foodie_addresses', JSON.stringify(addresses));
  }, [addresses]);

  const addAddress = useCallback((address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: Date.now().toString(), // Simple ID generation
    };

    setAddresses(prev => {
      // If this is set as default, remove default from others
      if (newAddress.isDefault) {
        const updatedAddresses = prev.map(addr => ({ ...addr, isDefault: false }));
        return [...updatedAddresses, newAddress];
      }
      return [...prev, newAddress];
    });

    return newAddress;
  }, []);

  const updateAddress = useCallback((id: string, updates: Partial<Address>) => {
    setAddresses(prev => prev.map(address => {
      if (address.id === id) {
        const updatedAddress = { ...address, ...updates };
        
        // If this address is being set as default, remove default from others
        if (updates.isDefault) {
          setAddresses(prevAddresses => 
            prevAddresses.map(addr => 
              addr.id === id ? updatedAddress : { ...addr, isDefault: false }
            )
          );
          return updatedAddress;
        }
        
        return updatedAddress;
      }
      return address;
    }));
  }, []);

  const deleteAddress = useCallback((id: string) => {
    setAddresses(prev => prev.filter(address => address.id !== id));
  }, []);

  const getDefaultAddress = useCallback(() => {
    return addresses.find(address => address.isDefault) || addresses[0] || null;
  }, [addresses]);

  return {
    addresses,
    isLoading,
    addAddress,
    updateAddress,
    deleteAddress,
    getDefaultAddress,
  };
}
