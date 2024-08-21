import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventList from './EventList';
import './PlannerDashboard.css';

const PlannerDashboard = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }
      await axios.post('http://localhost:5000/api/events', 
        { title, description, date, location },
        { headers: { 'x-auth-token': token } }
      );
      alert('Event created successfully');
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      setIsPopupOpen(false);
      fetchEvents(); // Refresh the event list
    } catch (err) {
      setError('Failed to create event: ' + (err.response ? err.response.data : err.message));
    }
  };

  return (
    <div className="planner-dashboard">
      <h1 className="dashboard-title">Planner Dashboard</h1>

      <div className="create-event-button-container">
        <button onClick={() => setIsPopupOpen(true)} className="create-event-button">
          Create New Event
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      {isPopupOpen && (
        <>
          <div className="overlay" onClick={() => setIsPopupOpen(false)} />
          <div className="popup">
            <h2 className="popup-title">Create New Event</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event Title"
                required
                className="input-field"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Event Description"
                required
                className="input-field textarea"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="input-field"
              />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Event Location"
                required
                className="input-field"
              />
              <button type="submit" className="submit-button">
                Create Event
              </button>
            </form>
          </div>
        </>
      )}

      <EventList events={events} onEventUpdate={fetchEvents} />
    </div>
  );
};

export default PlannerDashboard;
