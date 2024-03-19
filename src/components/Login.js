import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import '../styles/FormStyles.css';
import '../styles/FormBtn.css';

const baseURL = 'http://localhost:5000';

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

    try {
      const response = await axios.post(`${baseURL}/api/login`, { username, password });
      setShowLoginFailed(false);
      setShowLoginSuccess(true);
      login({ username, isAdmin: response.data.isAdmin });
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      setShowLoginFailed(true);
    } finally {
      setLoading(false);
    }
  };

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
    </div>
  );
}

export default Login;
