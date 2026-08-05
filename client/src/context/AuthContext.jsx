import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('shopez_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('shopez_user', JSON.stringify(userData));
    localStorage.setItem('shopez_token', userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shopez_user');
    localStorage.removeItem('shopez_token');
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('shopez_user', JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
