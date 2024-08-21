import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import StudentDashboard from './components/StudentDashboard';
import PlannerDashboard from './components/PlannerDashboard';
import EventList from './components/EventList';
import CampusMap from './components/CampusMap';
import ErrorBoundary from './components/ErrorBoundary';

const ProtectedRoute = ({ children, allowedRole }) => {
  const userString = localStorage.getItem('user');
  let user = null;

  if (userString) {
    try {
      user = JSON.parse(userString);
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }

  if (!user || user.role !== allowedRole) {
    // Redirect to login if user data is missing or role doesn't match
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/student" 
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/planner" 
          element={
            <ProtectedRoute allowedRole="planner">
              <PlannerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/events" 
          element={
            <ProtectedRoute allowedRole="student">
              <EventList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/map" 
          element={
            <ProtectedRoute allowedRole="student">
              <ErrorBoundary>
                <CampusMap />
              </ErrorBoundary>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
