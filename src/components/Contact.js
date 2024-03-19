import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Contact.css';
import '../styles/FormBtn.css';

const baseURL = 'http://localhost:5000';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', feedback: '' });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseURL}/api/feedback`, formData);
      if (response.status === 200 && response.data && response.data.message === 'Feedback submitted successfully') {
        setFeedbackSubmitted(true);
        // Reset form data
        setFormData({ name: '', email: '', feedback: '' });
      } else {
        console.error('Error submitting feedback:', response.data.message);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="contact-container">
      <div className="contact-info">
        <h2>Contact Details</h2>
        <p>Please feel free to reach us on below details:</p>
        <ul>
          <li>Email: contact@restaurant.com</li>
          <li>Phone: +123 456 7890</li>
          <li>Address: 123 Food Street, Flavor Town, USA</li>
        </ul>
      </div>

      <div className="feedback-form">
        <h2>Send Us Your Feedback</h2>
        <p style={{ textAlign: 'center' }}>We value your feedback. Tell us what you think.</p>
        {feedbackSubmitted ? (
          <p style={{ textAlign: 'center' }}>Thank you for your feedback!</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              Your Name:
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </label>
            <label>
              Your Email:
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </label>
            <label>
              Your Feedback:
              <textarea name="feedback" value={formData.feedback} onChange={handleChange} />
            </label>
            <button className='login-btn' type="submit">Send Feedback</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Contact;
