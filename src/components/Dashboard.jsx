import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const Dashboard = () => {
  const [recentSessions, setRecentSessions] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Add debugging to see the actual responses
        console.log('Fetching dashboard data...');
        
        const sessionsPromise = axios.get('/sessions.php')
          .then(res => {
            console.log('Sessions response:', res.data);
            return res;
          })
          .catch(err => {
            console.error('Sessions fetch error:', err.response?.data || err.message);
            return { data: { sessions: [] } }; // Return empty array on error
          });
        
        const notesPromise = axios.get('/personal_notes.php')
          .then(res => {
            console.log('Notes response:', res.data);
            return res;
          })
          .catch(err => {
            console.error('Notes fetch error:', err.response?.data || err.message);
            return { data: { notes: [] } }; // Return empty array on error
          });
          
        const [sessionsRes, notesRes] = await Promise.all([
          sessionsPromise,
          notesPromise
        ]);
        
        // Safely handle data that might be missing the expected structure
        const sessions = sessionsRes.data?.sessions || [];
        const notes = notesRes.data?.notes || [];
        
        setRecentSessions(sessions.slice(0, 5));
        setRecentNotes(notes.slice(0, 5));
        setError('');
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading dashboard data...</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Sessions</h2>
            <Link to="/sessions" className="text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>
          
          {recentSessions.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recentSessions.map((session) => (
                <li key={session.id} className="py-3">
                  <Link to={`/sessions/${session.id}`} className="block hover:bg-gray-50">
                    <div className="flex justify-between">
                      <p className="font-medium">{session.client_name}</p>
                      <p className="text-gray-500">{new Date(session.session_date).toLocaleDateString()}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No sessions found.</p>
          )}
          
          <div className="mt-4">
            <Link
              to="/sessions/new"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add New Session
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Personal Notes</h2>
            <Link to="/notes" className="text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>
          
          {recentNotes.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recentNotes.map((note) => (
                <li key={note.id} className="py-3">
                  <Link to={`/notes/${note.id}`} className="block hover:bg-gray-50">
                    <div className="flex justify-between">
                      <p className="font-medium">{note.title}</p>
                      <p className="text-gray-500">{new Date(note.created_at).toLocaleDateString()}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No personal notes found.</p>
          )}
          
          <div className="mt-4">
            <Link
              to="/notes/new"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Add New Note
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;