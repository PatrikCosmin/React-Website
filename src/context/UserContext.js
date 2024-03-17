import React, { createContext, useState, useContext } from 'react';
import { Alert, Button } from 'react-bootstrap';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false); // State for login success message
  const [showLoginFailed, setShowLoginFailed] = useState(false); // State for login failed message

  const login = (userData) => {
    setUser(userData);
    setShowLoginSuccess(true); // Show login success message
    // Additional login logic (e.g., storing token)
  };

  const handleCloseLoginSuccess = () => {
    setShowLoginSuccess(false); // Close login success message
  };

  const handleCloseLoginFailed = () => {
    setShowLoginFailed(false); // Close login failed message
  };

  return (
    <UserContext.Provider value={{ user, login }}>
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
