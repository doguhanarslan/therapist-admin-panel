// File: src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Sessions from './components/Sessions';
import SessionForm from './components/SessionForm';
import Notes from './components/Notes';
import NoteForm from './components/NoteForm';
import Navbar from './components/Navbar';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Set base URL for API requests from environment variables
axios.defaults.baseURL = 'https://demo2.demo.doguhanarslan.com/api';
axios.defaults.withCredentials = true; // Important for cookies
axios.interceptors.request.use(
  config => {
    console.log('Request headers:', config.headers);
    return config;
  },
  error => Promise.reject(error)
);

axios.interceptors.response.use(
  response => response,
  error => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Navbar />
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/sessions" element={
              <ProtectedRoute>
                <Navbar />
                <Sessions />
              </ProtectedRoute>
            } />
            <Route path="/sessions/new" element={
              <ProtectedRoute>
                <Navbar />
                <SessionForm />
              </ProtectedRoute>
            } />
            <Route path="/sessions/:id" element={
              <ProtectedRoute>
                <Navbar />
                <SessionForm />
              </ProtectedRoute>
            } />
            <Route path="/notes" element={
              <ProtectedRoute>
                <Navbar />
                <Notes />
              </ProtectedRoute>
            } />
            <Route path="/notes/new" element={
              <ProtectedRoute>
                <Navbar />
                <NoteForm />
              </ProtectedRoute>
            } />
            <Route path="/notes/:id" element={
              <ProtectedRoute>
                <Navbar />
                <NoteForm />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Protected route component
function ProtectedRoute({ children }) {
  const { authenticated, loading } = React.useContext(AuthContext);
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return authenticated ? children : <Navigate to="/login" />;
}

export default App;