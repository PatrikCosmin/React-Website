import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Feedback.css';
import '../styles/GlowBtnMenu.css';

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/feedbacks'); // Fetch all feedbacks
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const deleteFeedback = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/feedback/delete/${id}`); // Delete a feedback by id
      fetchFeedbacks(); // Refetch feedbacks after deletion
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  const deleteAllFeedbacks = async () => {
    try {
      await axios.delete('http://localhost:5000/api/feedback/all'); // Delete all feedbacks
      fetchFeedbacks(); // Refetch feedbacks after deletion
    } catch (error) {
      console.error('Error deleting all feedbacks:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter feedbacks based on search term
  const filteredFeedbacks = feedbacks.filter((feedback) =>
    feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.feedback.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className='feedback-container'>
        <h2>Manage your feedbacks:</h2>
        <input
          type="text"
          placeholder="Search feedbacks by name, email, or feedback content"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className='glow-on-hover-menu-fed' onClick={deleteAllFeedbacks}>Delete All</button>
        <div>
          {filteredFeedbacks.map((feedback) => (
            <div className='feedback-item' key={feedback.id}> {/* Enclosing each feedback in its own container */}
              <p>Name: {feedback.name}</p>
              <p>Email: {feedback.email}</p>
              <p>Feedback: {feedback.feedback}</p>
              <button className='glow-on-hover-menu-fed' onClick={() => deleteFeedback(feedback.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackManagement;
