'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Star, Clock, Truck } from 'lucide-react';
import { mockRestaurants } from '@/lib/mockData';
import { CUISINE_TYPES, PRICE_RANGES, SORT_OPTIONS } from '@/lib/constants';
import { formatPrice, sortRestaurants, filterRestaurants } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { SearchFilters } from '@/types';

const RestaurantsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    cuisine: [],
    priceRange: [],
    rating: undefined,
    deliveryTime: undefined,
    features: [],
    sortBy: 'rating',
  });

  // Filter and sort restaurants
  const filteredAndSortedRestaurants = useMemo(() => {
    let filtered = mockRestaurants;

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply filters
    filtered = filterRestaurants(filtered, filters);

    // Apply sorting
    return sortRestaurants(filtered, filters.sortBy || 'rating');
  }, [searchQuery, filters]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleArrayFilter = (key: 'cuisine' | 'priceRange' | 'features', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key]?.includes(value)
        ? prev[key]?.filter(item => item !== value)
        : [...(prev[key] || []), value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      cuisine: [],
      priceRange: [],
      rating: undefined,
      deliveryTime: undefined,
      features: [],
      sortBy: 'rating',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Restaurants Near You
            </h1>
            <p className="text-gray-600 mb-6">
              Discover amazing food from {mockRestaurants.length} restaurants in your area
            </p>

            {/* Search and Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search restaurants, cuisines, or dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent"
                />
              </div>

              {/* Filter Button */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </Button>

              {/* Sort Dropdown */}
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: showFilters ? 1 : 0,
              x: showFilters ? 0 : -20,
              width: showFilters ? 'auto' : 0,
            }}
            className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-olive-500 hover:text-olive-600"
                >
                  Clear All
                </button>
              </div>

              {/* Cuisine Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Cuisine</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
                  {CUISINE_TYPES.slice(0, 10).map(cuisine => (
                    <label key={cuisine} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.cuisine?.includes(cuisine) || false}
                        onChange={() => toggleArrayFilter('cuisine', cuisine)}
                        className="rounded border-gray-300 text-olive-500 focus:ring-olive-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{cuisine}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {PRICE_RANGES.map(range => (
                    <label key={range.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.priceRange?.includes(range.value) || false}
                        onChange={() => toggleArrayFilter('priceRange', range.value)}
                        className="rounded border-gray-300 text-olive-500 focus:ring-olive-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Minimum Rating</h4>
                <div className="space-y-2">
                  {[4.5, 4.0, 3.5, 3.0].map(rating => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === rating}
                        onChange={() => handleFilterChange('rating', rating)}
                        className="border-gray-300 text-olive-500 focus:ring-olive-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 flex items-center">
                        {rating}+ <Star className="w-4 h-4 text-yellow-400 fill-current ml-1" />
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Restaurant Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                {filteredAndSortedRestaurants.length} restaurants found
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredAndSortedRestaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
                >
                  {/* Restaurant Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                    
                    {/* Status Badge */}
                    <div className={`absolute top-4 left-4 px-2 py-1 rounded-full text-xs font-medium ${
                      restaurant.isOpen 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {restaurant.isOpen ? 'Open' : 'Closed'}
                    </div>

                    {/* Delivery Fee */}
                    <div className="absolute top-4 right-4 bg-olive-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {restaurant.deliveryFee === 0 ? 'Free' : formatPrice(restaurant.deliveryFee)}
                    </div>
                  </div>

                  {/* Restaurant Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-olive-500 transition-colors">
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700">
                          {restaurant.rating}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {restaurant.description}
                    </p>

                    {/* Cuisine Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {restaurant.cuisine.slice(0, 2).map((cuisine) => (
                        <span
                          key={cuisine}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {cuisine}
                        </span>
                      ))}
                    </div>

                    {/* Delivery Info */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Truck className="w-4 h-4" />
                        <span>Min {formatPrice(restaurant.minimumOrder)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* No Results */}
            {filteredAndSortedRestaurants.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No restaurants found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filters to find more restaurants.
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantsPage;
