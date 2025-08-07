'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, CheckCircle, AlertCircle } from 'lucide-react';
import { SERVICE_AREA } from '@/lib/constants';
import { LocationCoordinates, getServiceAreaInfo } from '@/lib/location';

interface ServiceAreaMapProps {
  userLocation?: LocationCoordinates;
  className?: string;
}

const ServiceAreaMap: React.FC<ServiceAreaMapProps> = ({
  userLocation,
  className = ""
}) => {
  const serviceInfo = userLocation ? getServiceAreaInfo(userLocation) : null;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <MapPin className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Service Areas</h3>
      </div>

      <div className="space-y-4">
        {/* Service Sectors */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">We deliver to these areas:</h4>
          <div className="grid gap-3">
            {SERVICE_AREA.serviceSectors.map((sector, index) => {
              const isUserInThisSector = serviceInfo?.nearestServiceSector === sector.name && serviceInfo.isServiceable;
              
              return (
                <motion.div
                  key={sector.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isUserInThisSector 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {isUserInThisSector ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{sector.name}</div>
                        <div className="text-sm text-gray-500">
                          Pin: {sector.pincode} • Radius: {sector.radius}km
                        </div>
                      </div>
                    </div>
                    
                    {userLocation && (
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {serviceInfo?.allDistances.find(d => d.sector === sector.name)?.distance}km
                        </div>
                        <div className="text-xs text-gray-500">
                          {serviceInfo?.allDistances.find(d => d.sector === sector.name)?.withinRadius 
                            ? 'In range' 
                            : 'Out of range'
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* User Location Status */}
        {userLocation && serviceInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-lg border-2 ${
              serviceInfo.isServiceable
                ? 'border-green-300 bg-green-50'
                : 'border-red-300 bg-red-50'
            }`}
          >
            <div className="flex items-start space-x-3">
              {serviceInfo.isServiceable ? (
                <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <div className={`font-medium ${
                  serviceInfo.isServiceable ? 'text-green-900' : 'text-red-900'
                }`}>
                  {serviceInfo.isServiceable ? 'Your location is serviceable!' : 'Location not in service area'}
                </div>
                <div className={`text-sm mt-1 ${
                  serviceInfo.isServiceable ? 'text-green-700' : 'text-red-700'
                }`}>
                  {serviceInfo.isServiceable 
                    ? `You're ${serviceInfo.distanceToNearestService}km from ${serviceInfo.nearestServiceSector}`
                    : `Closest service area is ${serviceInfo.distanceToNearestService}km away`
                  }
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Service Area Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Navigation className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <div className="font-medium text-blue-900">Service Coverage</div>
              <div className="text-sm text-blue-700 mt-1">
                We deliver within a 2.5km radius of each sector center in Bokaro Steel City, Jharkhand.
                Total coverage area includes parts of Sectors 1-6 and surrounding neighborhoods.
              </div>
            </div>
          </div>
        </div>

        {/* Coordinates Display (for debugging) */}
        {userLocation && (
          <details className="text-xs text-gray-500">
            <summary className="cursor-pointer hover:text-gray-700">Technical Details</summary>
            <div className="mt-2 space-y-1 font-mono">
              <div>User: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}</div>
              {SERVICE_AREA.serviceSectors.map(sector => (
                <div key={sector.name}>
                  {sector.name}: {sector.coordinates.lat.toFixed(6)}, {sector.coordinates.lng.toFixed(6)}
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export default ServiceAreaMap;