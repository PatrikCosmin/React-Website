import React, { createContext, useState, useContext } from 'react';
import { Alert } from 'react-bootstrap';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false); 
  const [showLoginFailed, setShowLoginFailed] = useState(false); 

  const login = (userData) => {
    setUser(userData);
    setShowLoginSuccess(true);
    isLoggedIn(true);
    // Additional login logic
  };

  const logout = () => {
    setUser(null); // Clear user data on logout
    // Additional logout logic if needed
  };

  const isLoggedIn = () => {
    return user !== null;
  };

  const handleCloseLoginSuccess = () => {
    setShowLoginSuccess(false);
  };

  const handleCloseLoginFailed = () => {
    setShowLoginFailed(false);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isLoggedIn }}>
      {children}
      {/* Login success message */}
      <Alert show={showLoginSuccess} variant="success" onClose={handleCloseLoginSuccess} dismissible>
        <Alert.Heading>Login Successful!</Alert.Heading>
        <p>You have successfully logged in.</p>
      </Alert>
      {/* Login failed message */}
      <Alert show={showLoginFailed} variant="danger" onClose={handleCloseLoginFailed} dismissible>
        <Alert.Heading>Login Failed!</Alert.Heading>
        <p>Incorrect username or password.</p>
      </Alert>
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
