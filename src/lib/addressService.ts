import { NominatimAddress } from '@/types';

/**
 * Search for addresses using OpenStreetMap Nominatim API
 * Limited to India for better relevance
 */
export async function searchAddresses(query: string): Promise<NominatimAddress[]> {
  if (query.length < 3) return [];

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=5&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Mealzee-App/1.0 (mealzeeindia@gmail.com)'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch address suggestions');
    }

    return await response.json();
  } catch (error) {
    console.error('Address search error:', error);
    return [];
  }
}

/**
 * Format address from Nominatim response for display
 */
export function formatNominatimAddress(item: NominatimAddress): string {
  const addr = item.address;
  const parts = [];
  
  if (addr.house_number && addr.road) {
    parts.push(`${addr.house_number} ${addr.road}`);
  } else if (addr.road) {
    parts.push(addr.road);
  }
  
  if (addr.suburb) parts.push(addr.suburb);
  if (addr.city || addr.town || addr.village) {
    parts.push(addr.city || addr.town || addr.village);
  }
  if (addr.state) parts.push(addr.state);
  if (addr.postcode) parts.push(addr.postcode);
  
  return parts.join(', ');
}

/**
 * Check if coordinates are within service area
 */
export function isAddressServiceable(lat: number, lon: number): boolean {
  // Import location validation functions
  const { isLocationServiceable } = require('@/lib/location');
  return isLocationServiceable({ lat, lng: lon });
}

/**
 * Get service area information for coordinates
 */
export function getAddressServiceInfo(lat: number, lon: number) {
  // Import location validation functions
  const { getServiceAreaInfo } = require('@/lib/location');
  return getServiceAreaInfo({ lat, lng: lon });
}
