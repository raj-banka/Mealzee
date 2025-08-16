'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Loader2, Navigation, CheckCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import Portal from '@/components/ui/Portal';
import Button from '@/components/ui/Button';
import { Z_INDEX } from '@/lib/constants';

// Create a dynamic map component to avoid SSR issues
const DynamicMap = dynamic(
  () => import('./MapComponent'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-olive-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }
);

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  landmark?: string;
  sector?: string;
  city?: string;
  pincode?: string;
}

interface LocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
}

interface NominatimResponse {
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    suburb?: string;
    neighbourhood?: string;
    quarter?: string;
    residential?: string;
    hamlet?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    postcode?: string;
    state?: string;
    country?: string;
  };
}





const LocationPicker: React.FC<LocationPickerProps> = ({
  isOpen,
  onClose,
  onLocationSelect,
  initialLocation
}) => {
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [error, setError] = useState<string>('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090]); // Default to Delhi
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Initialize map center
  useEffect(() => {
    if (initialLocation) {
      setMapCenter([initialLocation.latitude, initialLocation.longitude]);
      setSelectedPosition([initialLocation.latitude, initialLocation.longitude]);
    }
  }, [initialLocation]);

  // Auto-request location when modal opens (only if no initial location)
  useEffect(() => {
    if (isOpen && !initialLocation) {
      // Automatically try to get current location when modal opens
      getCurrentLocation();
    }
  }, [isOpen, initialLocation]);

  // Get current location
  const getCurrentLocation = useCallback(() => {
    setIsLoadingLocation(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMapCenter([lat, lng]);
        setSelectedPosition([lat, lng]);
        reverseGeocode(lat, lng);
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Unable to get your current location. Please select manually on the map.');
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0 // Always get fresh location
      }
    );
  }, []);

  // Reverse geocode coordinates to address
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    setError('');

    try {
      // Use higher precision for better accuracy
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat.toFixed(6)}&lon=${lng.toFixed(6)}&email=mealzeeindia@gmail.com&addressdetails=1&zoom=18&accept-language=en&extratags=1`
      );

      if (!response.ok) {
        throw new Error('Failed to get address information');
      }

      const data: NominatimResponse = await response.json();

      // Build a more accurate address string
      const addressParts = [];

      // Add house number and road
      if (data.address.house_number) addressParts.push(data.address.house_number);
      if (data.address.road) addressParts.push(data.address.road);

      // Add locality/area details
      if (data.address.suburb) addressParts.push(data.address.suburb);
      else if (data.address.neighbourhood) addressParts.push(data.address.neighbourhood);
      else if (data.address.quarter) addressParts.push(data.address.quarter);

      // Add city
      if (data.address.city) addressParts.push(data.address.city);
      else if (data.address.town) addressParts.push(data.address.town);
      else if (data.address.village) addressParts.push(data.address.village);

      // Add state and pincode
      if (data.address.state) addressParts.push(data.address.state);
      if (data.address.postcode) addressParts.push(data.address.postcode);

      const formattedAddress = addressParts.join(', ');

      const locationData: LocationData = {
        latitude: lat,
        longitude: lng,
        address: formattedAddress || data.display_name,
        landmark: data.address.suburb || data.address.neighbourhood || data.address.hamlet,
        sector: data.address.quarter || data.address.residential || data.address.suburb,
        city: data.address.city || data.address.town || data.address.village || data.address.municipality,
        pincode: data.address.postcode
      };

      setLocationData(locationData);
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      setError('Unable to get address information for this location.');
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // Handle map click
  const handleMapClick = (lat: number, lng: number) => {
    setSelectedPosition([lat, lng]);
    setMapCenter([lat, lng]); // Center map on selected location
    reverseGeocode(lat, lng);
  };

  // Handle location confirmation
  const handleConfirmLocation = () => {
    if (locationData) {
      onLocationSelect(locationData);
      onClose();
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedPosition(null);
      setLocationData(null);
      setError('');
      setIsLoadingLocation(false);
      setIsReverseGeocoding(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Portal>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
          style={{ zIndex: Z_INDEX.modal + 1 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[95vh] sm:h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-olive-500 to-olive-600 p-5 text-white flex items-center justify-between shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Select Your Location</h2>
                  <p className="text-white/80 text-sm">Choose your delivery address</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col lg:flex-row min-h-0">
              {/* Map Section */}
              <div className="flex-1 relative min-h-[300px] lg:min-h-0">
                <div className="absolute top-4 left-4 z-[1000]">
                  <Button
                    onClick={getCurrentLocation}
                    disabled={isLoadingLocation}
                    className="bg-white text-olive-700 border border-olive-200 hover:bg-olive-50 shadow-lg font-medium"
                    size="sm"
                  >
                    {isLoadingLocation ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Navigation className="w-4 h-4 mr-2" />
                    )}
                    Use Current Location
                  </Button>
                </div>

                <div className="w-full h-full relative">
                  <DynamicMap
                    center={mapCenter}
                    selectedPosition={selectedPosition}
                    onMapClick={handleMapClick}
                    onMapReady={() => setIsMapLoaded(true)}
                  />
                </div>
              </div>

              {/* Info Panel */}
              <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col bg-gray-50 min-h-0">
                <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-olive-600" />
                    Location Details
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                    <p className="text-sm text-blue-700 leading-relaxed">
                      📍 <strong>Tip:</strong> Click anywhere on the map to select your exact delivery location, or use the "Use Current Location" button for GPS accuracy.
                    </p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-700 leading-relaxed">
                      🎯 <strong>For best accuracy:</strong> Zoom in and click on your exact building or house. The system will automatically detect the most precise address available.
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {isReverseGeocoding && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <p className="text-sm text-blue-600">Getting address information...</p>
                    </div>
                  </div>
                )}

                {locationData && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl shadow-sm">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="p-1 bg-green-100 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-800 mb-2">📍 Selected Location</p>
                        <div className="bg-white p-3 rounded-lg border border-green-100">
                          <p className="text-sm text-gray-800 leading-relaxed">{locationData.address}</p>
                        </div>
                      </div>
                    </div>

                    {(locationData.landmark || locationData.sector || locationData.city || locationData.pincode) && (
                      <div className="mt-4 pt-4 border-t border-green-200">
                        <p className="text-sm font-semibold text-green-800 mb-3">📋 Address Breakdown:</p>
                        <div className="grid grid-cols-1 gap-2">
                          {locationData.landmark && (
                            <div className="bg-white p-2 rounded-lg border border-green-100">
                              <p className="text-xs text-gray-600">Area/Landmark</p>
                              <p className="text-sm font-medium text-gray-800">{locationData.landmark}</p>
                            </div>
                          )}
                          {locationData.sector && locationData.sector !== locationData.landmark && (
                            <div className="bg-white p-2 rounded-lg border border-green-100">
                              <p className="text-xs text-gray-600">Sector/Quarter</p>
                              <p className="text-sm font-medium text-gray-800">{locationData.sector}</p>
                            </div>
                          )}
                          {locationData.city && (
                            <div className="bg-white p-2 rounded-lg border border-green-100">
                              <p className="text-xs text-gray-600">City</p>
                              <p className="text-sm font-medium text-gray-800">{locationData.city}</p>
                            </div>
                          )}
                          {locationData.pincode && (
                            <div className="bg-white p-2 rounded-lg border border-green-100">
                              <p className="text-xs text-gray-600">Pincode</p>
                              <p className="text-sm font-medium text-gray-800">{locationData.pincode}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-auto space-y-3">
                  <Button
                    onClick={handleConfirmLocation}
                    disabled={!locationData || isReverseGeocoding}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg"
                    size="lg"
                  >
                    {isReverseGeocoding ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Processing Location...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        ✅ Confirm This Location
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                    size="lg"
                  >
                    Cancel
                  </Button>
                </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </Portal>
  );
};

export default LocationPicker;
