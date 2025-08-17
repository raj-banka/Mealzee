// Service Area Configuration and Validation

export interface ServiceArea {
  city: string;
  sectors: string[];
}

// Define our service areas based on the image provided
export const SERVICE_AREAS: ServiceArea[] = [
  {
    city: 'Bokaro Steel City',
    sectors: [
      'Sec-4/A',
      'Sec-4/B', 
      'Sec-4/C',
      'Sec-4/D',
      'Sec-4/E',
      'Sec-4/F'
    ]
  }
];

// Get all available cities
export const getAvailableCities = (): string[] => {
  return SERVICE_AREAS.map(area => area.city);
};

// Get sectors for a specific city
export const getSectorsForCity = (city: string): string[] => {
  const serviceArea = SERVICE_AREAS.find(area => 
    area.city.toLowerCase() === city.toLowerCase()
  );
  return serviceArea ? serviceArea.sectors : [];
};

// Check if a city is in our service area
export const isCityInServiceArea = (city: string): boolean => {
  return SERVICE_AREAS.some(area => 
    area.city.toLowerCase() === city.toLowerCase()
  );
};

// Check if a sector is available in a specific city
export const isSectorAvailable = (city: string, sector: string): boolean => {
  const serviceArea = SERVICE_AREAS.find(area => 
    area.city.toLowerCase() === city.toLowerCase()
  );
  
  if (!serviceArea) return false;
  
  return serviceArea.sectors.some(availableSector => 
    availableSector.toLowerCase() === sector.toLowerCase()
  );
};

// Validate complete address (city + sector)
export const validateServiceArea = (city: string, sector?: string): {
  isValid: boolean;
  message: string;
} => {
  // Check if city is in service area
  if (!isCityInServiceArea(city)) {
    return {
      isValid: false,
      message: `Sorry, we are not currently serving in ${city}. We currently serve in: ${getAvailableCities().join(', ')}`
    };
  }

  // If sector is provided, check if it's available
  if (sector && !isSectorAvailable(city, sector)) {
    const availableSectors = getSectorsForCity(city);
    return {
      isValid: false,
      message: `Sorry, we are not currently serving in ${sector}. Available sectors in ${city}: ${availableSectors.join(', ')}`
    };
  }

  return {
    isValid: true,
    message: 'Great! We deliver to your area.'
  };
};

// Extract city and sector from address string
export const parseAddress = (address: string): {
  city?: string;
  sector?: string;
  fullAddress: string;
} => {
  const lowerAddress = address.toLowerCase();
  
  // Find city in address
  let detectedCity: string | undefined;
  for (const area of SERVICE_AREAS) {
    if (lowerAddress.includes(area.city.toLowerCase())) {
      detectedCity = area.city;
      break;
    }
  }

  // Find sector in address
  let detectedSector: string | undefined;
  if (detectedCity) {
    const sectors = getSectorsForCity(detectedCity);
    for (const sector of sectors) {
      if (lowerAddress.includes(sector.toLowerCase())) {
        detectedSector = sector;
        break;
      }
    }
  }

  return {
    city: detectedCity,
    sector: detectedSector,
    fullAddress: address
  };
};

// Format sector options for dropdown
export const formatSectorOptions = (city: string): Array<{label: string, value: string}> => {
  const sectors = getSectorsForCity(city);
  return sectors.map(sector => ({
    label: sector,
    value: sector
  }));
};

// Format complete address with sector and city
export const formatCompleteAddress = (address: string, sector?: string, city?: string): string => {
  if (!address.trim()) return '';

  const defaultCity = 'Bokaro Steel City';
  const finalCity = city || defaultCity;

  // Clean the address to avoid duplication
  let cleanAddress = address.trim();

  // First, split by commas and clean each part
  let addressParts = cleanAddress.split(',').map(part => part.trim()).filter(part => part);

  // Remove all occurrences of the city name from each part
  addressParts = addressParts.filter(part => {
    const isCity = part.toLowerCase() === finalCity.toLowerCase();
    return !isCity;
  });

  // Remove all occurrences of sectors from each part
  const allSectors = getSectorsForCity('Bokaro Steel City');
  addressParts = addressParts.filter(part => {
    const isSector = allSectors.some(sectorName =>
      part.toLowerCase() === sectorName.toLowerCase()
    );
    return !isSector;
  });

  // Remove any parts that are just numbers (like postal codes that got duplicated)
  addressParts = addressParts.filter(part => {
    const isJustNumbers = /^\d+$/.test(part);
    return !isJustNumbers;
  });

  // Remove empty parts and duplicates
  addressParts = [...new Set(addressParts.filter(part => part && part.trim()))];

  // Join the cleaned parts back
  cleanAddress = addressParts.join(', ');

  // Build the complete address
  const parts = [];

  // Add the cleaned address if it's not empty
  if (cleanAddress) {
    parts.push(cleanAddress);
  }

  // Add sector if provided and not already present
  if (sector && !parts.some(part => part.toLowerCase().includes(sector.toLowerCase()))) {
    parts.push(sector);
  }

  // Add city if not already present
  if (!parts.some(part => part.toLowerCase().includes(finalCity.toLowerCase()))) {
    parts.push(finalCity);
  }

  return parts.filter(part => part && part.trim()).join(', ');
};
