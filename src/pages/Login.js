import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext'; 
import { Modal, Button } from 'react-bootstrap';
import '../components/FormStyles.css';
import '../components/FormBtn.css';

function Login() {
  const { login } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginFailed, setShowLoginFailed] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Simulate login process
    try {
      // Replace this with your actual login logic
      if (username === 'patrik' && password === 'patrik') {
        await login({ username, token: 'abc123' });
        setShowLoginFailed(false); // Reset login failed message
        setShowLoginSuccess(true); // Show success modal
      } else {
        setShowLoginFailed(true);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setShowLoginFailed(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showLoginSuccess) {
      const timeout = setTimeout(() => {
        setShowLoginSuccess(false);
        setRedirectToHome(true);
      }, 500); // Redirect after 1 second

      return () => clearTimeout(timeout);
    }
  }, [showLoginSuccess]);

  useEffect(() => {
    if (redirectToHome) {
      setTimeout(() => {
        setRedirectToHome(false);
        window.location.href = '/';
      }, 200); // Redirect to home after 2 seconds
    }
  }, [redirectToHome]);

  return (
    <div className='img'>
      <div className="form-container">
        <div className="form-box">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input type="text" className="form-input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" className="form-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" className="login-btn" style={{ fontWeight: 'bold' }}>
              {loading ? (
                <div className="spinner"></div>
              ) : (
                'Login'
              )}
            </button>
          </form>
          {showLoginFailed && <p style={{ color: 'red' }}>Username or Password was not correct, try again.</p>}
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
      {/* Login success modal */}
      <Modal show={showLoginSuccess} onHide={() => setShowLoginSuccess(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login Successful!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have successfully logged in.
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Login;
