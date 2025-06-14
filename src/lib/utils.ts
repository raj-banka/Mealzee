import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in kilometers
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  return date.toLocaleDateString();
}

export function isRestaurantOpen(restaurant: { isOpen: boolean }): boolean {
  // This is a simplified version. In a real app, you'd check actual opening hours
  return restaurant.isOpen;
}

export function calculateDeliveryTime(
  baseTime: number,
  distance: number,
  orderVolume: number = 1
): number {
  // Base delivery time + distance factor + order volume factor
  const distanceFactor = Math.ceil(distance * 2); // 2 minutes per km
  const volumeFactor = Math.ceil(orderVolume * 0.5); // 0.5 minutes per order
  return baseTime + distanceFactor + volumeFactor;
}

export function getEstimatedDeliveryTime(
  preparationTime: number,
  deliveryTime: number
): Date {
  const now = new Date();
  const totalMinutes = preparationTime + deliveryTime;
  return new Date(now.getTime() + totalMinutes * 60000);
}

export function formatDeliveryTime(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((date.getTime() - now.getTime()) / 60000);
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min`;
  }
  
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  
  if (minutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${minutes}m`;
}

export function sortRestaurants(
  restaurants: any[],
  sortBy: string,
  userLocation?: { lat: number; lng: number }
) {
  return [...restaurants].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'delivery_time':
        return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
      case 'price':
        return a.deliveryFee - b.deliveryFee;
      case 'distance':
        if (!userLocation) return 0;
        const distanceA = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          a.coordinates.lat,
          a.coordinates.lng
        );
        const distanceB = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          b.coordinates.lat,
          b.coordinates.lng
        );
        return distanceA - distanceB;
      default:
        return 0;
    }
  });
}

export function filterRestaurants(restaurants: any[], filters: any) {
  return restaurants.filter(restaurant => {
    if (filters.cuisine && filters.cuisine.length > 0) {
      if (!restaurant.cuisine.some((c: string) => filters.cuisine.includes(c))) {
        return false;
      }
    }

    if (filters.priceRange && filters.priceRange.length > 0) {
      if (!filters.priceRange.includes(restaurant.priceRange)) {
        return false;
      }
    }

    if (filters.rating && restaurant.rating < filters.rating) {
      return false;
    }

    if (filters.deliveryTime) {
      const deliveryTime = parseInt(restaurant.deliveryTime);
      if (deliveryTime > filters.deliveryTime) {
        return false;
      }
    }

    if (filters.features && filters.features.length > 0) {
      if (!filters.features.every((feature: string) => 
        restaurant.features.includes(feature)
      )) {
        return false;
      }
    }

    return true;
  });
}
