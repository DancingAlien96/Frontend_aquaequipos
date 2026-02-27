'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Product, CartItem } from '@/types';
import { useAuth } from './AuthContext';
import { fetchCart, addToCart, updateCartItem, removeFromCart, clearCart as clearCartAPI } from '@/lib/api';

interface CartContextType {
  items: CartItem[];
  itemsCount: number;
  total: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
  getItemQuantity: (productId: number) => number;
  loading: boolean;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'aquaequipos_cart';

interface CartItemDB {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  product_data: Product;
  created_at: string;
  updated_at: string;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [dbItemsMap, setDbItemsMap] = useState<Map<number, number>>(new Map()); // product_id -> db_item_id
  const { user } = useAuth();

  // Load cart from localStorage (for non-logged users) or DB (for logged users)
  const loadCart = useCallback(async () => {
    if (user) {
      // User is logged in - load from database
      setLoading(true);
      try {
        const cartData: CartItemDB[] = await fetchCart(user.uid);
        const cartItems: CartItem[] = cartData.map(item => ({
          product: item.product_data,
          quantity: item.quantity,
        }));
        setItems(cartItems);
        
        // Create map of product_id -> db_item_id for updates/deletes
        const map = new Map<number, number>();
        cartData.forEach(item => {
          map.set(item.product_id, item.id);
        });
        setDbItemsMap(map);
      } catch (error) {
        console.error('Error loading cart from DB:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // User not logged in - load from localStorage
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          setItems(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, [user]);

  // Migrate localStorage cart to DB when user logs in
  const migrateLocalCartToDB = useCallback(async () => {
    if (!user) return;

    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const localItems: CartItem[] = JSON.parse(stored);
        
        if (localItems.length > 0) {
          // Add each local item to the database
          for (const item of localItems) {
            try {
              await addToCart(user.uid, {
                product_id: item.product.id,
                quantity: item.quantity,
                product_data: item.product,
              });
            } catch (error) {
              console.error('Error migrating item to DB:', error);
            }
          }
          
          // Clear localStorage after migration
          localStorage.removeItem(CART_STORAGE_KEY);
          
          // Reload cart from DB
          await loadCart();
        }
      }
    } catch (error) {
      console.error('Error migrating cart to DB:', error);
    }
  }, [user, loadCart]);

  // Load cart when user changes
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Migrate localStorage to DB when user logs in
  useEffect(() => {
    if (user) {
      migrateLocalCartToDB();
    }
  }, [user, migrateLocalCartToDB]);

  // Save cart to localStorage only when user is NOT logged in
  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [items, user]);

  const itemsCount = items.reduce((total, item) => total + item.quantity, 0);
  
  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.product.price);
    return sum + (price * item.quantity);
  }, 0);

  const addItem = useCallback(async (product: Product, quantity: number = 1) => {
    if (user) {
      // User logged in - add to DB
      try {
        await addToCart(user.uid, {
          product_id: product.id,
          quantity,
          product_data: product,
        });
        await loadCart(); // Reload from DB
      } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
      }
    } else {
      // User not logged in - add to localStorage
      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex(item => item.product.id === product.id);
        
        if (existingIndex >= 0) {
          const newItems = [...prevItems];
          newItems[existingIndex].quantity += quantity;
          return newItems;
        } else {
          return [...prevItems, { product, quantity }];
        }
      });
    }
  }, [user, loadCart]);

  const removeItem = useCallback(async (productId: number) => {
    if (user) {
      // User logged in - remove from DB
      const itemId = dbItemsMap.get(productId);
      if (itemId) {
        try {
          await removeFromCart(user.uid, itemId);
          await loadCart(); // Reload from DB
        } catch (error) {
          console.error('Error removing from cart:', error);
          throw error;
        }
      }
    } else {
      // User not logged in - remove from localStorage
      setItems((prevItems) => prevItems.filter(item => item.product.id !== productId));
    }
  }, [user, dbItemsMap, loadCart]);

  const updateQuantity = useCallback(async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

    if (user) {
      // User logged in - update in DB
      const itemId = dbItemsMap.get(productId);
      if (itemId) {
        try {
          await updateCartItem(user.uid, itemId, quantity);
          await loadCart(); // Reload from DB
        } catch (error) {
          console.error('Error updating cart:', error);
          throw error;
        }
      }
    } else {
      // User not logged in - update in localStorage
      setItems((prevItems) => {
        const newItems = [...prevItems];
        const index = newItems.findIndex(item => item.product.id === productId);
        if (index >= 0) {
          newItems[index].quantity = quantity;
        }
        return newItems;
      });
    }
  }, [user, dbItemsMap, removeItem, loadCart]);

  const clearCart = useCallback(async () => {
    if (user) {
      // User logged in - clear DB
      try {
        await clearCartAPI(user.uid);
        setItems([]);
        setDbItemsMap(new Map());
      } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
      }
    } else {
      // User not logged in - clear localStorage
      setItems([]);
    }
  }, [user]);

  const isInCart = useCallback((productId: number) => {
    return items.some(item => item.product.id === productId);
  }, [items]);

  const getItemQuantity = useCallback((productId: number) => {
    const item = items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }, [items]);

  const syncCart = useCallback(async () => {
    await loadCart();
  }, [loadCart]);

  return (
    <CartContext.Provider value={{
      items,
      itemsCount,
      total,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isInCart,
      getItemQuantity,
      loading,
      syncCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
