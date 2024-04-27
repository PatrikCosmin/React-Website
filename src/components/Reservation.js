import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import '../styles/Reservation.css';
import { useUser } from '../context/UserContext'; 

const baseURL = 'http://localhost:5000';

function Reservation() {
  const { user, isLoggedIn } = useUser(); 
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(1);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reservationSubmitted, setReservationSubmitted] = useState(false);
  const [editReservationId, setEditReservationId] = useState(null); // Track reservation being edited
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editGuests, setEditGuests] = useState(1);

  useEffect(() => {
    if (date) {
      fetchAvailableTimes();
    }
    if (user && user.isAdmin) {
      fetchReservations();
    }
  }, [date, user]);
  
  useEffect(() => {
    if (editDate) {
      fetchAvailableTimes();
    }
  }, [editDate]);
  
  const fetchAvailableTimes = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/reservations/times?date=${date || editDate}`);
      setAvailableTimes(response.data.times);
    } catch (error) {
      console.error('Error fetching available times:', error);
    }
  };

  const fetchReservations = async () => {
    const response = await axios.get(`${baseURL}/api/reservations`);
    setReservations(response.data);
  };

  const handleAdminActions = async (action, reservationId, reservationData) => {
    try {
      if (action === 'delete') {
        await axios.delete(`${baseURL}/api/reservations/${reservationId}`);
      } else if (action === 'edit') {
        setEditReservationId(reservationId); // Set the reservation ID being edited
        // Set the initial values for edit form
        const reservation = reservations.find(res => res.id === reservationId);
        setEditDate(reservation.date);
        setEditTime(reservation.time);
        setEditGuests(reservation.guests);
      }
      fetchReservations();
    } catch (error) {
      console.error('Error managing reservation:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reservationData = { date, time, guests };
    const response = await axios.post(`${baseURL}/api/reservations`, reservationData);
    if (response.status === 200) {
      setReservationSubmitted(true);
      setTimeout(() => setReservationSubmitted(false), 5000);
    }
  };

  const handleEdit = async () => {
    try {
      const updatedReservationData = { date: editDate, time: editTime, guests: editGuests };
      await axios.put(`${baseURL}/api/reservations/${editReservationId}`, updatedReservationData);
      setEditReservationId(null);
      // Fetch available times with updated editDate
      fetchAvailableTimes();
      fetchReservations();
    } catch (error) {
      console.error('Error editing reservation:', error);
    }
  };
  

  if (!isLoggedIn()) {
    return (
      <div className="container-master">
        <div className="reservation-container">
          <h2>You must be logged in to make a reservation.</h2>
          <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-master">
      <div className="reservation-container">
        <h2>Book Your Table</h2>
        <form onSubmit={handleSubmit}>
          <label>Date:
            <input type="date" name="date" value={date} onChange={e => setDate(e.target.value)} />
          </label>
          <label>Time:
            <select name="time" value={time} onChange={e => setTime(e.target.value)} disabled={!date}>
              <option value="">Select Time</option>
              {availableTimes.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </label>
          <label>Number of Guests:
            <input type="number" name="guests" value={guests} onChange={e => setGuests(e.target.value)} min="1" />
          </label>
          <button type="submit">Book Table</button>
        </form>
        {reservationSubmitted && <p>Reservation Successful!</p>}
        {user && user.isAdmin && (
          <div>
            <h3>Reservation Management</h3>
            {reservations.map(reservation => (
              <div key={reservation.id}>
                <p>Date: {reservation.date}, Time: {reservation.time}, Guests: {reservation.guests}</p>
                <button onClick={() => handleAdminActions('edit', reservation.id)}>Edit</button>
                <button onClick={() => handleAdminActions('delete', reservation.id)}>Delete</button>
              </div>
            ))}
            {/* Edit Reservation Form */}
            {editReservationId && (
              <div>
                <h3>Edit Reservation</h3>
                <form onSubmit={handleEdit}>
                  <label>New Date:
                    <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} />
                  </label>
                  <label>New Time:
                    <select value={editTime} onChange={e => setEditTime(e.target.value)}>
                      <option value="">Select Time</option>
                      {availableTimes.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </label>
                  <label>Number of Guests:
                    <input type="number" value={editGuests} onChange={e => setEditGuests(e.target.value)} min="1" />
                  </label>
                  <button type="submit">Update Reservation</button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reservation;
