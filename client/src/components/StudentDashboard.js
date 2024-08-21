import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import EventList from './EventList';

function StudentDashboard() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in.');
          return;
        }
        const res = await axios.get('http://localhost:5000/api/events', {
          headers: { 'x-auth-token': token }
        });
        setEvents(res.data);
      } catch (err) {
        setError('Error fetching events: ' + (err.response ? err.response.data : err.message));
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Student Dashboard</h1>
      <nav>
        <Link to="/events">Events</Link>
        <Link to="/map">Campus Map</Link>
      </nav>
      {error && <p>{error}</p>}
      <EventList events={events} />
    </div>
  );
}

export default StudentDashboard;
