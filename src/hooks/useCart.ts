'use client';

import { useState, useEffect, useCallback } from 'react';
import { Cart, CartItem, MenuItem, Restaurant } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { generateId } from '@/lib/utils';

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(STORAGE_KEYS.cart);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart) {
      localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
    } else {
      localStorage.removeItem(STORAGE_KEYS.cart);
    }
  }, [cart]);

  const addToCart = useCallback((
    menuItem: MenuItem,
    restaurant: Restaurant,
    quantity: number = 1,
    customizations: any[] = [],
    specialInstructions?: string
  ) => {
    const itemPrice = menuItem.price + customizations.reduce((sum, c) => sum + c.price, 0);
    const totalPrice = itemPrice * quantity;

    const cartItem: CartItem = {
      id: generateId(),
      menuItem,
      quantity,
      customizations,
      specialInstructions,
      totalPrice,
    };

    setCart(prevCart => {
      // If cart is empty or from different restaurant, create new cart
      if (!prevCart || prevCart.restaurantId !== restaurant.id) {
        const newCart: Cart = {
          id: generateId(),
          restaurantId: restaurant.id,
          restaurant,
          items: [cartItem],
          subtotal: totalPrice,
          deliveryFee: restaurant.deliveryFee,
          tax: totalPrice * 0.08, // 8% tax
          total: totalPrice + restaurant.deliveryFee + (totalPrice * 0.08),
        };
        return newCart;
      }

      // Check if same item with same customizations exists
      const existingItemIndex = prevCart.items.findIndex(item => 
        item.menuItem.id === menuItem.id &&
        JSON.stringify(item.customizations) === JSON.stringify(customizations)
      );

      let updatedItems;
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
          totalPrice: updatedItems[existingItemIndex].totalPrice + totalPrice,
        };
      } else {
        // Add new item
        updatedItems = [...prevCart.items, cartItem];
      }

      const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const tax = subtotal * 0.08;
      const total = subtotal + prevCart.deliveryFee + tax;

      return {
        ...prevCart,
        items: updatedItems,
        subtotal,
        tax,
        total,
      };
    });
  }, []);

  const updateCartItem = useCallback((itemId: string, quantity: number) => {
    setCart(prevCart => {
      if (!prevCart) return null;

      const updatedItems = prevCart.items.map(item => {
        if (item.id === itemId) {
          const itemPrice = item.menuItem.price + item.customizations.reduce((sum, c) => sum + c.price, 0);
          return {
            ...item,
            quantity,
            totalPrice: itemPrice * quantity,
          };
        }
        return item;
      });

      const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const tax = subtotal * 0.08;
      const total = subtotal + prevCart.deliveryFee + tax;

      return {
        ...prevCart,
        items: updatedItems,
        subtotal,
        tax,
        total,
      };
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prevCart => {
      if (!prevCart) return null;

      const updatedItems = prevCart.items.filter(item => item.id !== itemId);

      if (updatedItems.length === 0) {
        return null; // Clear cart if no items left
      }

      const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const tax = subtotal * 0.08;
      const total = subtotal + prevCart.deliveryFee + tax;

      return {
        ...prevCart,
        items: updatedItems,
        subtotal,
        tax,
        total,
      };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart(null);
  }, []);

  const getItemCount = useCallback(() => {
    return cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }, [cart]);

  const applyPromoCode = useCallback((promoCode: string) => {
    // This would typically validate the promo code with the backend
    // For now, we'll apply a simple 10% discount
    setCart(prevCart => {
      if (!prevCart) return null;

      const discount = prevCart.subtotal * 0.1; // 10% discount
      const total = prevCart.subtotal + prevCart.deliveryFee + prevCart.tax - discount;

      return {
        ...prevCart,
        promoCode,
        discount,
        total,
      };
    });
  }, []);

  const removePromoCode = useCallback(() => {
    setCart(prevCart => {
      if (!prevCart) return null;

      const total = prevCart.subtotal + prevCart.deliveryFee + prevCart.tax;

      return {
        ...prevCart,
        promoCode: undefined,
        discount: undefined,
        total,
      };
    });
  }, []);

  return {
    cart,
    isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getItemCount,
    applyPromoCode,
    removePromoCode,
  };
}
