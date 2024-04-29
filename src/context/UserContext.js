import React, { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check for user info in localStorage during initial load
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [showLoginFailed, setShowLoginFailed] = useState(false);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Save user to localStorage
    setShowLoginSuccess(true);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Clear user from localStorage
  };

  const isLoggedIn = () => {
    return user !== null;
  };

  const handleCloseLoginSuccess = () => setShowLoginSuccess(false);
  const handleCloseLoginFailed = () => setShowLoginFailed(false);

  return (
    <UserContext.Provider value={{ user, login, logout, isLoggedIn, showLoginSuccess, handleCloseLoginSuccess, showLoginFailed, handleCloseLoginFailed }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
