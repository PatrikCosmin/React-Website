import React from 'react';
import '../components/FormStyles.css';
import '../components/GlowBtnNav.css'; // Same button styling

function Register() {
  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Register</h2>
        <form>
          <input type="text" className="form-input" placeholder="Username" />
          <input type="email" className="form-input" placeholder="Email" />
          <input type="password" className="form-input" placeholder="Password" />
          <input type="password" className="form-input" placeholder="Confirm Password" />
          <button type="submit" className="login-btn" style={{ fontWeight: 'bold' }}>Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
