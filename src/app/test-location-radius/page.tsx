'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Search, RefreshCw } from 'lucide-react';
import LocationInput from '@/components/location/LocationInput';
import ServiceAreaMap from '@/components/location/ServiceAreaMap';
import { 
  getCurrentLocation, 
  reverseGeocode, 
  forwardGeocode, 
  getServiceAreaInfo,
  findNearestServiceSector,
  LocationCoordinates,
  LocationData 
} from '@/lib/location';
import { SERVICE_AREA } from '@/lib/constants';

export default function TestLocationRadius() {
  const [address, setAddress] = useState('');
  const [currentLocation, setCurrentLocation] = useState<LocationCoordinates | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  const handleAddressChange = (newAddress: string, data?: LocationData) => {
    setAddress(newAddress);
    if (data) {
      setLocationData(data);
      setCurrentLocation(data.coordinates);
    }
  };

  const handleGetCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const coordinates = await getCurrentLocation();
      const data = await reverseGeocode(coordinates);
      setCurrentLocation(coordinates);
      setLocationData(data);
      setAddress(data.address);
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testSpecificCoordinates = async (lat: number, lng: number, name: string) => {
    const coordinates = { lat, lng };
    const serviceInfo = getServiceAreaInfo(coordinates);
    const nearestService = findNearestServiceSector(coordinates);
    
    const result = {
      name,
      coordinates,
      serviceInfo,
      nearestService,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setTestResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
    return result;
  };

  const runTestSuite = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    // Test coordinates around Bokaro Steel City
    const testCases = [
      // Sector centers (should be serviceable)
      { lat: 23.669296, lng: 86.151115, name: 'Sector 3 Center' },
      { lat: 23.671203, lng: 86.1573709, name: 'Sector 4 Center' },
      { lat: 23.6655, lng: 86.1675, name: 'Sector 5 Center' },
      
      // Points within radius
      { lat: 23.670, lng: 86.152, name: 'Near Sector 3' },
      { lat: 23.672, lng: 86.158, name: 'Near Sector 4' },
      { lat: 23.666, lng: 86.168, name: 'Near Sector 5' },
      
      // Points outside radius
      { lat: 23.680, lng: 86.140, name: 'North of BSC' },
      { lat: 23.660, lng: 86.180, name: 'East of BSC' },
      { lat: 23.650, lng: 86.150, name: 'South of BSC' },
      
      // Far away points
      { lat: 23.700, lng: 86.200, name: 'Far East' },
    ];
    
    for (const testCase of testCases) {
      await testSpecificCoordinates(testCase.lat, testCase.lng, testCase.name);
      // Small delay to see results appear
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Enhanced Location System Test
          </h1>
          <p className="text-gray-600">
            Test the new radius-based location checking for Sectors 3, 4, and 5 in Bokaro Steel City
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Address Input */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Address Testing</h2>
              <LocationInput
                value={address}
                onChange={handleAddressChange}
                placeholder="Enter address to test location validation"
                showCurrentLocationButton={true}
                validateOnChange={true}
              />
            </div>

            {/* Current Location */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Current Location</h2>
                <button
                  onClick={handleGetCurrentLocation}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Navigation className="w-4 h-4" />
                  )}
                  <span>Get Location</span>
                </button>
              </div>
              
              {currentLocation && (
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Coordinates:</span> {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                  </div>
                  {locationData && (
                    <>
                      <div>
                        <span className="font-medium">Address:</span> {locationData.address}
                      </div>
                      <div>
                        <span className="font-medium">Serviceable:</span> 
                        <span className={locationData.isServiceable ? 'text-green-600' : 'text-red-600'}>
                          {locationData.isServiceable ? ' Yes' : ' No'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Test Suite */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Automated Tests</h2>
                <button
                  onClick={runTestSuite}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span>Run Tests</span>
                </button>
              </div>
              
              <p className="text-sm text-gray-600">
                Test various coordinates around Bokaro Steel City to verify the radius-based location checking.
              </p>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {testResults.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg border-2 ${
                        result.serviceInfo.isServiceable 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-900">{result.name}</div>
                        <div className={`text-sm font-medium ${
                          result.serviceInfo.isServiceable ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {result.serviceInfo.isServiceable ? 'SERVICEABLE' : 'NOT SERVICEABLE'}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>Coords: {result.coordinates.lat.toFixed(6)}, {result.coordinates.lng.toFixed(6)}</div>
                        <div>
                          Nearest: {result.serviceInfo.nearestServiceSector} 
                          ({result.serviceInfo.distanceToNearestService}km)
                        </div>
                        <div>Time: {result.timestamp}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Service Area Map */}
          <div>
            <ServiceAreaMap 
              userLocation={currentLocation || undefined}
              className="sticky top-8"
            />
          </div>
        </div>

        {/* Service Area Configuration */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Configuration</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {SERVICE_AREA.serviceSectors.map((sector) => (
              <div key={sector.name} className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900">{sector.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  <div>Pin: {sector.pincode}</div>
                  <div>Lat: {sector.coordinates.lat}</div>
                  <div>Lng: {sector.coordinates.lng}</div>
                  <div>Radius: {sector.radius}km</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}