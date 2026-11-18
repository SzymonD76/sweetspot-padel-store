import React, { createContext, useState, useContext, useCallback, useMemo, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  // Cart state initialized from localStorage — ensures cart persists across page reloads.
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('sweetspot_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('sweetspot_cart', JSON.stringify(cartItems));
    } catch {
      // Storage can be unavailable (e.g. private mode) — the cart still works in memory
    }
  }, [cartItems]);

  // addToCart logic — if product exists, increase quantity, otherwise add new item with quantity 1
  const addToCart = useCallback((product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  // increaseQuantity logic — increases quantity of a specific product by 1
  const increaseQuantity = useCallback((productId) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  // removeFromCart logic — decreases quantity of a specific product by 1, removes it if quantity reaches 0
  const removeFromCart = useCallback((productId) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter(item => item.id !== productId);
    });
  }, []);

  // removeAllFromCart logic — removes all quantities of a specific product from the cart
  const removeAllFromCart = useCallback((productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  }, []);

  // clearCart logic — empties the entire cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Summary values — total item count and subtotal, recalculated only when the cart changes
  const totals = useMemo(() => ({
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    subtotal:  cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
  }), [cartItems]);

  // Memoized context value — consumers re-render only when the cart actually changes
  const value = useMemo(() => ({
    cartItems,
    totals,
    addToCart,
    increaseQuantity,
    removeFromCart,
    removeAllFromCart,
    clearCart,
  }), [cartItems, totals, addToCart, increaseQuantity, removeFromCart, removeAllFromCart, clearCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
