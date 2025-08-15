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
 * Check if coordinates are within service area (radius-based checking for Sectors 3, 4, and 5)
 */
export function isLocationServiceable(coordinates: LocationCoordinates): boolean {
  // Check if location is within radius of any of our service sectors
  const serviceableAreas = SERVICE_AREA.serviceSectors;
  
  let isServiceable = false;
  let nearestServiceSector = null;
  let minDistanceToService = Infinity;
  
  // Check distance from each service sector
  for (const sector of serviceableAreas) {
    const distance = calculateDistance(
      coordinates.lat,
      coordinates.lng,
      sector.coordinates.lat,
      sector.coordinates.lng
    );
    
    console.log(`📍 Distance from ${sector.name}: ${distance.toFixed(2)} km (radius: ${sector.radius} km)`);
    
    // Check if within this sector's service radius
    if (distance <= sector.radius) {
      isServiceable = true;
      if (distance < minDistanceToService) {
        minDistanceToService = distance;
        nearestServiceSector = sector.name;
      }
    }
  }
  
  // Additional check: if not in any sector radius, check if within overall Bokaro Steel City area
  if (!isServiceable) {
    const distanceFromCenter = calculateDistance(
      coordinates.lat,
      coordinates.lng,
      SERVICE_AREA.coordinates.lat,
      SERVICE_AREA.coordinates.lng
    );
    
    console.log(`📍 Distance from BSC center: ${distanceFromCenter.toFixed(2)} km`);
    
    // If within 5km of BSC center, might be serviceable (manual review needed)
    if (distanceFromCenter <= 5) {
      console.log(`📍 Within BSC area but outside service sectors - potential service area`);
    }
  }
  
  console.log(`📍 Location serviceable: ${isServiceable}`);
  if (nearestServiceSector) {
    console.log(`📍 Nearest service sector: ${nearestServiceSector} (${minDistanceToService.toFixed(2)} km)`);
  }
  
  return isServiceable;
}

/**
 * Get detailed service area information for coordinates
 */
export function getServiceAreaInfo(coordinates: LocationCoordinates): {
  isServiceable: boolean;
  nearestServiceSector: string | null;
  distanceToNearestService: number;
  allDistances: Array<{ sector: string; distance: number; withinRadius: boolean }>;
} {
  const serviceableAreas = SERVICE_AREA.serviceSectors;
  let nearestServiceSector = null;
  let minDistanceToService = Infinity;
  let isServiceable = false;
  
  const allDistances = serviceableAreas.map(sector => {
    const distance = calculateDistance(
      coordinates.lat,
      coordinates.lng,
      sector.coordinates.lat,
      sector.coordinates.lng
    );
    
    const withinRadius = distance <= sector.radius;
    
    if (withinRadius) {
      isServiceable = true;
      if (distance < minDistanceToService) {
        minDistanceToService = distance;
        nearestServiceSector = sector.name;
      }
    }
    
    return {
      sector: sector.name,
      distance: parseFloat(distance.toFixed(2)),
      withinRadius
    };
  });
  
  return {
    isServiceable,
    nearestServiceSector,
    distanceToNearestService: parseFloat(minDistanceToService.toFixed(2)),
    allDistances
  };
}

/**
 * Find nearest sector based on coordinates (checks all sectors)
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
 * Find nearest serviceable sector based on coordinates (checks only service sectors)
 */
export function findNearestServiceSector(coordinates: LocationCoordinates): {
  sector: string | null;
  distance: number;
  isWithinRadius: boolean;
} {
  let nearestSector = null;
  let minDistance = Infinity;
  let isWithinRadius = false;
  
  for (const sector of SERVICE_AREA.serviceSectors) {
    const distance = calculateDistance(
      coordinates.lat,
      coordinates.lng,
      sector.coordinates.lat,
      sector.coordinates.lng
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      nearestSector = sector.name;
      isWithinRadius = distance <= sector.radius;
    }
  }
  
  return {
    sector: nearestSector,
    distance: parseFloat(minDistance.toFixed(2)),
    isWithinRadius
  };
}

/**
 * Get current location using browser geolocation API
 * @deprecated This function is deprecated. Use address-based location instead.
 */
export async function getCurrentLocation(): Promise<LocationCoordinates> {
  throw new Error('GPS location is no longer supported. Please use address-based location.');
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
    
    return data.map((result: any): LocationData => {
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
    }).filter((location: LocationData) => location.isServiceable); // Only return serviceable locations
  } catch (error) {
    console.error('Location suggestions error:', error);
    return [];
  }
}

/**
 * Validate if an address is within service area using geocoding and radius checking
 */
export async function validateServiceArea(address: string): Promise<{ isValid: boolean; message: string; suggestions?: LocationData[] }> {
  try {
    console.log('🏠 Validating service area for:', address);

    // First, try to geocode the address to get coordinates
    const geocodeResults = await forwardGeocode(address);
    
    if (geocodeResults.length === 0) {
      // Fallback to text-based validation for basic checks
      const addressLower = address.toLowerCase();
      const allowedSectorPatterns = [
        'sector 4', 'sec 4', 'sector-4', 'sec-4',
        'sector 3', 'sec 3', 'sector-3', 'sec-3',
        'sector 5', 'sec 5', 'sector-5', 'sec-5'
      ];

      const isAllowedSector = allowedSectorPatterns.some(pattern =>
        addressLower.includes(pattern)
      );

      const isBokaro = addressLower.includes('bokaro') ||
                       addressLower.includes('bsc') ||
                       addressLower.includes('bokaro steel city');

      // Also check for correct pin codes
      const hasCorrectPincode = /8270[345]/i.test(address);

      if (isAllowedSector && (isBokaro || hasCorrectPincode)) {
        return {
          isValid: true,
          message: '✅ Address appears to be in our service area (Sectors 3, 4, or 5 in Bokaro Steel City). Location will be verified during delivery.',
          suggestions: []
        };
      } else if (isAllowedSector && !isBokaro && !hasCorrectPincode) {
        return {
          isValid: false,
          message: '❌ Please specify the complete address including Bokaro Steel City, Jharkhand and pin code (827003, 827004, or 827005).',
          suggestions: []
        };
      } else if (isBokaro || hasCorrectPincode) {
        return {
          isValid: false,
          message: '❌ We only deliver to Sectors 3, 4, and 5 in Bokaro Steel City. Please specify the correct sector.',
          suggestions: []
        };
      } else {
        return {
          isValid: false,
          message: '❌ We only deliver to Sectors 3, 4, and 5 in Bokaro Steel City, Jharkhand (Pin codes: 827003, 827004, 827005).',
          suggestions: []
        };
      }
    }

    // Use the first (most relevant) geocoded result
    const primaryResult = geocodeResults[0];
    const serviceInfo = getServiceAreaInfo(primaryResult.coordinates);
    
    if (serviceInfo.isServiceable) {
      return {
        isValid: true,
        message: `✅ Perfect! We deliver to your area. You're ${serviceInfo.distanceToNearestService}km from ${serviceInfo.nearestServiceSector}.`,
        suggestions: geocodeResults.filter(result => result.isServiceable)
      };
    } else {
      // Find the closest service sector for better messaging
      const closestSector = serviceInfo.allDistances.reduce((closest, current) =>
        current.distance < closest.distance ? current : closest
      );

      let message = `❌ Sorry, this location is ${closestSector.distance}km from ${closestSector.sector}. `;

      if (closestSector.distance <= 5) {
        message += `We deliver within 2.5km radius of Sectors 3, 4, and 5 in Bokaro Steel City, Jharkhand (Pin codes: 827003, 827004, 827005). Please check if you have the correct sector address.`;
      } else {
        message += `We only deliver to Sectors 3, 4, and 5 in Bokaro Steel City, Jharkhand (Pin codes: 827003, 827004, 827005).`;
      }

      return {
        isValid: false,
        message,
        suggestions: geocodeResults.filter(result => result.isServiceable)
      };
    }
  } catch (error) {
    console.error('Address validation error:', error);
    return {
      isValid: false,
      message: 'Unable to validate address. Please try again or contact support.'
    };
  }
}
