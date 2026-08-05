import React, { createContext, useState, useEffect } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('shopez_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('shopez_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item._id === product._id);
      if (exists) {
        return prev.filter((item) => item._id !== product._id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item._id !== productId));
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isInWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
