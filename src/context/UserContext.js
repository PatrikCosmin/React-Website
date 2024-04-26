import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [showLoginFailed, setShowLoginFailed] = useState(false);

  const login = (userData) => {
    setUser(userData);
    setShowLoginSuccess(true);
  };

  const logout = () => {
    setUser(null);
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
