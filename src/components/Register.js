// src/pages/Register.js

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // Import useUser from your UserContext
import '../styles/FormStyles.css';
import '../styles/FormBtn.css';

const baseURL = 'http://localhost:5000';

function Register() {
  const navigate = useNavigate();
  const { login } = useUser(); // Use the login function from the context
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${baseURL}/api/register`, { username, email, password });
      // Assuming the response includes user data needed for login
      // Adjust as per your backend response
      login({ username: response.data.username }); 

      navigate('/'); // Redirect to home page after successful registration and login
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className='img'>
      <div className="form-container">
        <div className="form-box">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <input type="text" className="form-input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="email" className="form-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" className="form-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="password" className="form-input" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <button type="submit" className="login-btn-reg" style={{ fontWeight: 'bold' }}>Submit</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </form>
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
