import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('shopez_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('shopez_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product._id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Price calculations
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotalPrice = cartItems.reduce((acc, item) => {
    const effectivePrice = item.product.price * (1 - (item.product.discount || 0) / 100);
    return acc + effectivePrice * item.quantity;
  }, 0);

  const discountTotal = cartItems.reduce((acc, item) => {
    const rawDiff = (item.product.price * (item.product.discount || 0)) / 100;
    return acc + rawDiff * item.quantity;
  }, 0);

  const taxAmount = subtotalPrice * 0.08; // 8% Tax
  const shippingFee = subtotalPrice > 100 || cartItems.length === 0 ? 0 : 15; // Free shipping over $100
  const grandTotal = subtotalPrice + taxAmount + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemsCount,
        subtotalPrice,
        discountTotal,
        taxAmount,
        shippingFee,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
