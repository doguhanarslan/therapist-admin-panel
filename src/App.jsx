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
import './index.css';

// Axios yapılandırması
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

// Axios interceptor'ları
axios.interceptors.request.use(
  config => {
    console.log('İstek gönderiliyor:', config.url);
    return config;
  },
  error => {
    console.error('İstek hatası:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error('Sunucu yanıt hatası:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <div className="flex-grow pt-16 pb-6 px-4 md:pt-20 md:pb-10">
                    <Dashboard />
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/sessions" element={
              <ProtectedRoute>
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <div className="flex-grow pt-16 pb-6 px-4 md:pt-20 md:pb-10">
                    <Sessions />
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/sessions/new" element={
              <ProtectedRoute>
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <div className="flex-grow pt-16 pb-6 px-4 md:pt-20 md:pb-10">
                    <SessionForm />
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/sessions/:id" element={
              <ProtectedRoute>
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <div className="flex-grow pt-16 pb-6 px-4 md:pt-20 md:pb-10">
                    <SessionForm />
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/notes" element={
              <ProtectedRoute>
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <div className="flex-grow pt-16 pb-6 px-4 md:pt-20 md:pb-10">
                    <Notes />
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/notes/new" element={
              <ProtectedRoute>
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <div className="flex-grow pt-16 pb-6 px-4 md:pt-20 md:pb-10">
                    <NoteForm />
                  </div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/notes/:id" element={
              <ProtectedRoute>
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <div className="flex-grow pt-16 pb-6 px-4 md:pt-20 md:pb-10">
                    <NoteForm />
                  </div>
                </div>
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
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-blue-500 border-blue-200 animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }
  
  return authenticated ? children : <Navigate to="/login" />;
}

export default App;