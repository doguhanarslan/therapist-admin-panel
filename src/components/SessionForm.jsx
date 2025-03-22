import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SessionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    client_name: '',
    session_date: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    if (isEditMode) {
      fetchSession();
    }
  }, [id, isEditMode]);
  
  const fetchSession = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/sessions.php?id=${id}`);
      const session = response.data.session;
      
      // Format date to YYYY-MM-DD for input[type="date"]
      const formattedDate = new Date(session.session_date).toISOString().split('T')[0];
      
      setFormData({
        client_name: session.client_name,
        session_date: formattedDate,
        notes: session.notes
      });
    } catch (err) {
      console.error('Error fetching session:', err);
      setError('Failed to load session data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.client_name || !formData.session_date) {
      setError('Client name and session date are required.');
      return;
    }
    
    try {
      setLoading(true);
      
      if (isEditMode) {
        await axios.put(`/sessions.php?id=${id}`, formData);
        setSuccess('Session updated successfully.');
      } else {
        await axios.post('/sessions.php', formData);
        setSuccess('Session created successfully.');
        // Clear form after successful creation
        setFormData({
          client_name: '',
          session_date: '',
          notes: ''
        });
      }
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/sessions');
      }, 1500);
      
    } catch (err) {
      console.error('Error saving session:', err);
      setError('Failed to save session. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && isEditMode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading session data...</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? 'Edit Session' : 'New Session'}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="client_name">
            Client Name
          </label>
          <input
            type="text"
            id="client_name"
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={loading}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="session_date">
            Session Date
          </label>
          <input
            type="date"
            id="session_date"
            name="session_date"
            value={formData.session_date}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={loading}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
            Session Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="10"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={loading}
          ></textarea>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/sessions')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Session' : 'Create Session'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SessionForm;