import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Reservation.css';

const baseURL = 'http://localhost:5000';

function Reservation() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(1);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [reservationSubmitted, setReservationSubmitted] = useState(false);

  useEffect(() => {
    if (date) {
      fetchAvailableTimes();
    }
  }, [date]);

  const fetchAvailableTimes = async () => {
    const response = await axios.get(`${baseURL}/api/reservations/times?date=${date}`);
    setAvailableTimes(response.data.times);
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

  return (
    <div className="reservation-container">
      <h2>Book Your Table</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Date:
          <input type="date" name="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>
        <label>
          Time:
          <select name="time" value={time} onChange={e => setTime(e.target.value)} disabled={!date}>
            <option value="">Select Time</option>
            {availableTimes.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </label>
        <label>
          Number of Guests:
          <input type="number" name="guests" value={guests} onChange={e => setGuests(e.target.value)} min="1" />
        </label>
        <button type="submit">Book Table</button>
      </form>
      {reservationSubmitted && <p>Reservation Successful!</p>}
    </div>
  );
}

export default Reservation;
