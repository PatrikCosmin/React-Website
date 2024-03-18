import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; 
import { Modal } from 'react-bootstrap';
import '../components/FormStyles.css';
import '../components/FormBtn.css';

function Login() {
  const { login } = useUser();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginFailed, setShowLoginFailed] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Simulate login process
    try {
      if (username === 'patrik' && password === 'patrik') {
        await login({ username, token: 'abc123' });
        setShowLoginFailed(false);
        setShowLoginSuccess(true); // Set login success to true
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
        navigate('/'); // Navigate to home after successful login
      }, 2000); // Delay before redirection to show success message

      return () => clearTimeout(timeout);
    }
  }, [showLoginSuccess, navigate]);

  return (
    <div className='img'>
      <div className="form-container">
        <div className="form-box">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input type="text" className="form-input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" className="form-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" className="login-btn" style={{ fontWeight: 'bold' }}>
              {loading ? <div className="spinner"></div> : 'Login'}
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
        <Modal.Body>You have successfully logged in.</Modal.Body>
      </Modal>
    </div>
  );
}

export default Login;
