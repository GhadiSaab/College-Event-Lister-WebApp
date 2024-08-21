import React, { useState } from 'react';
import axios from 'axios';
import './EventList.css';

const EventList = ({ events = [], onEventUpdate }) => {
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleEnroll = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }
      await axios.post(`http://localhost:5000/api/events/${eventId}/enroll`, {}, {
        headers: { 'x-auth-token': token }
      });
      alert('Enrolled successfully');
      onEventUpdate();
    } catch (err) {
      setError('Enrollment failed: ' + (err.response ? err.response.data : err.message));
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }
      const response = await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
        headers: { 'x-auth-token': token }
      });
      console.log('Delete response:', response);
      alert('Event deleted successfully');
      onEventUpdate();
    } catch (err) {
      console.log('Delete error response:', err.response);
      setError('Deletion failed: ' + (err.response ? err.response.data : err.message));
    }
  };

  const isExpired = (date) => {
    const eventDate = new Date(date);
    const today = new Date();
    return eventDate < today;
  };

  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="event-list">
      <h2 className="event-list__title">Events</h2>
      
      {error && (
        <div className="event-list__error">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      
      <div className="event-list__container">
        {Array.isArray(sortedEvents) && sortedEvents.length > 0 ? (
          sortedEvents.map(event => (
            <div key={event.id} className={`event-card ${isExpired(event.date) ? 'expired-event' : ''}`}>
              <h3 className="event-card__title">{event.title}</h3>
              <p className="event-card__description">{event.description}</p>
              <div className="event-card__details">
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Organizer:</strong> {event.organizer.username}</p>
                <p><strong>Attendees:</strong> {event.attendees.length}</p>
              </div>
              <button 
                onClick={() => handleEnroll(event.id)}
                className="event-card__enroll-button"
              >
                Enroll
              </button>
              {user.role === 'planner' && (
                <button 
                  onClick={() => handleDelete(event.id)}
                  className="event-card__delete-button"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No events available</p>
        )}
      </div>
    </div>
  );
};

export default EventList;
