'use client';

import { SERVICE_AREA, APP_CONFIG } from './constants';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface LocationData {
  address: string;
  coordinates: LocationCoordinates;
  city: string;
  state: string;
  country: string;
  pincode?: string;
  sector?: string;
  landmark?: string;
  isServiceable: boolean;
}

export interface GeocodeResult {
  formatted_address: string;
  geometry: {
    location: LocationCoordinates;
  };
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Check if coordinates are within service area
 */
export function isLocationServiceable(coordinates: LocationCoordinates): boolean {
  const distance = calculateDistance(
    coordinates.lat,
    coordinates.lng,
    SERVICE_AREA.coordinates.lat,
    SERVICE_AREA.coordinates.lng
  );
  
  return distance <= APP_CONFIG.maxDeliveryRadius;
}

/**
 * Find nearest sector based on coordinates
 */
export function findNearestSector(coordinates: LocationCoordinates): string | null {
  let nearestSector = null;
  let minDistance = Infinity;
  
  for (const sector of SERVICE_AREA.sectors) {
    const distance = calculateDistance(
      coordinates.lat,
      coordinates.lng,
      sector.coordinates.lat,
      sector.coordinates.lng
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      nearestSector = sector.name;
    }
  }
  
  return nearestSector;
}

/**
 * Get current location using browser geolocation API
 */
export async function getCurrentLocation(): Promise<LocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
}

/**
 * Reverse geocode coordinates to address using OpenStreetMap Nominatim API
 * (Free alternative to Google Maps API)
 */
export async function reverseGeocode(coordinates: LocationCoordinates): Promise<LocationData> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.lat}&lon=${coordinates.lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Mealzee-App/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding failed');
    }

    const data = await response.json();
    
    // Extract address components
    const address = data.address || {};
    const formattedAddress = data.display_name || 'Unknown location';
    
    // Determine if location is serviceable
    const isServiceable = isLocationServiceable(coordinates);
    const nearestSector = findNearestSector(coordinates);
    
    // Extract relevant address components
    const city = address.city || address.town || address.village || 'Unknown';
    const state = address.state || 'Unknown';
    const country = address.country || 'India';
    const pincode = address.postcode || '';
    
    return {
      address: formattedAddress,
      coordinates,
      city,
      state,
      country,
      pincode,
      sector: nearestSector || undefined,
      isServiceable
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    
    // Fallback: Check if coordinates are in our service area
    const isServiceable = isLocationServiceable(coordinates);
    const nearestSector = findNearestSector(coordinates);
    
    return {
      address: `Location near ${SERVICE_AREA.city}`,
      coordinates,
      city: SERVICE_AREA.city,
      state: SERVICE_AREA.state,
      country: 'India',
      sector: nearestSector || undefined,
      isServiceable
    };
  }
}

/**
 * Forward geocode address to coordinates using OpenStreetMap Nominatim API
 */
export async function forwardGeocode(address: string): Promise<LocationData[]> {
  try {
    const encodedAddress = encodeURIComponent(`${address}, ${SERVICE_AREA.city}, ${SERVICE_AREA.state}, India`);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=5&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Mealzee-App/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding failed');
    }

    const data = await response.json();
    
    return data.map((result: any) => {
      const coordinates = {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon)
      };
      
      const address = result.address || {};
      const isServiceable = isLocationServiceable(coordinates);
      const nearestSector = findNearestSector(coordinates);
      
      return {
        address: result.display_name,
        coordinates,
        city: address.city || address.town || address.village || SERVICE_AREA.city,
        state: address.state || SERVICE_AREA.state,
        country: address.country || 'India',
        pincode: address.postcode || '',
        sector: nearestSector || undefined,
        isServiceable
      };
    });
  } catch (error) {
    console.error('Forward geocoding error:', error);
    return [];
  }
}

/**
 * Get location suggestions for autocomplete
 */
export async function getLocationSuggestions(query: string): Promise<LocationData[]> {
  if (query.length < 3) return [];
  
  try {
    // Search within our service area
    const encodedQuery = encodeURIComponent(`${query}, ${SERVICE_AREA.city}, ${SERVICE_AREA.state}, India`);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=10&addressdetails=1&bounded=1&viewbox=${SERVICE_AREA.coordinates.lng-0.1},${SERVICE_AREA.coordinates.lat+0.1},${SERVICE_AREA.coordinates.lng+0.1},${SERVICE_AREA.coordinates.lat-0.1}`,
      {
        headers: {
          'User-Agent': 'Mealzee-App/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Search failed');
    }

    const data = await response.json();
    
    return data.map((result: any) => {
      const coordinates = {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon)
      };
      
      const address = result.address || {};
      const isServiceable = isLocationServiceable(coordinates);
      const nearestSector = findNearestSector(coordinates);
      
      return {
        address: result.display_name,
        coordinates,
        city: address.city || address.town || address.village || SERVICE_AREA.city,
        state: address.state || SERVICE_AREA.state,
        country: address.country || 'India',
        pincode: address.postcode || '',
        sector: nearestSector || undefined,
        isServiceable
      };
    }).filter(location => location.isServiceable); // Only return serviceable locations
  } catch (error) {
    console.error('Location suggestions error:', error);
    return [];
  }
}

/**
 * Validate if an address is within service area
 */
export async function validateServiceArea(address: string): Promise<{ isValid: boolean; message: string; suggestions?: LocationData[] }> {
  try {
    const locations = await forwardGeocode(address);
    
    if (locations.length === 0) {
      return {
        isValid: false,
        message: 'Address not found. Please enter a valid address.'
      };
    }
    
    const serviceableLocations = locations.filter(loc => loc.isServiceable);
    
    if (serviceableLocations.length === 0) {
      return {
        isValid: false,
        message: `Sorry, we don't deliver to this area yet. We currently serve ${SERVICE_AREA.city}, ${SERVICE_AREA.state}.`,
        suggestions: locations
      };
    }
    
    return {
      isValid: true,
      message: 'Address is within our delivery area!',
      suggestions: serviceableLocations
    };
  } catch (error) {
    return {
      isValid: false,
      message: 'Unable to validate address. Please try again.'
    };
  }
}
