import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useLocation} from 'react-router-dom';
import { Link } from 'react-router-dom';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  useEffect(() => {
    fetchNotes();
  }, [location.state?.refresh]);
  
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/personal_notes.php');
      
      console.log('Notes response raw:', response);
      console.log('Notes response data:', response.data);
      
      // Check if the expected structure exists
      if (!response.data || !Array.isArray(response.data.notes)) {
        console.error('Unexpected response format:', response.data);
        setError('Received unexpected data format from server');
        setNotes([]);
        return;
      }
      
      setNotes(response.data.notes);
      setError('');
    } catch (err) {
      console.error('Error fetching notes:', err);
      console.error('Response:', err.response?.data);
      setNotes([]);
      setError('Failed to load notes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await axios.delete(`/personal_notes.php?id=${id}`);
        fetchNotes();
      } catch (err) {
        console.error('Error deleting note:', err);
        setError('Failed to delete note. Please try again later.');
      }
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading notes...</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Personal Notes</h1>
        <Link
          to="/notes/new"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add New Note
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div key={note.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 truncate">{note.title}</div>
                <p className="text-gray-700 text-base line-clamp-3">
                  {note.content}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {new Date(note.created_at).toLocaleString()}
                </p>
              </div>
              <div className="px-6 pt-2 pb-4 border-t">
                <Link
                  to={`/notes/${note.id}`}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">No personal notes found.</p>
          <Link
            to="/notes/new"
            className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Add Your First Note
          </Link>
        </div>
      )}
    </div>
  );
};

export default Notes;