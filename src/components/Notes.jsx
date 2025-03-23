import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';

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
      
      console.log('Notlar yanıtı:', response.data);
      
      // Check if the expected structure exists
      if (!response.data || !Array.isArray(response.data.notes)) {
        console.error('Beklenmeyen yanıt formatı:', response.data);
        setError('Sunucudan beklenmeyen veri formatı alındı');
        setNotes([]);
        return;
      }
      
      setNotes(response.data.notes);
      setError('');
    } catch (err) {
      console.error('Notlar yüklenirken hata:', err);
      console.error('Yanıt:', err.response?.data);
      setNotes([]);
      setError('Notlar yüklenemedi. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Bu notu silmek istediğinize emin misiniz?')) {
      try {
        await axios.delete(`/personal_notes.php?id=${id}`);
        fetchNotes();
      } catch (err) {
        console.error('Not silinirken hata:', err);
        setError('Not silinemedi. Lütfen daha sonra tekrar deneyin.');
      }
    }
  };
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('tr-TR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent"></div>
          <span className="ml-3 text-gray-600 font-medium">Notlar yükleniyor...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Kişisel Notlar</h1>
        <Link
          to="/notes/new"
          className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors w-full md:w-auto justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Yeni Not Ekle
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div key={note.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg">
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-gray-800 truncate">{note.title}</div>
                <p className="text-gray-700 text-base h-20 overflow-hidden mb-2">
                  {note.content}
                </p>
                <div className="flex items-center mt-4 text-gray-500 text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatDate(note.created_at)}
                </div>
              </div>
              <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between">
                  <Link
                    to={`/notes/${note.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                    Düzenle
                  </Link>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="text-red-600 hover:text-red-800 font-medium cursor-pointer flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="h-16 w-16 bg-green-50 mx-auto rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Henüz not bulunmuyor</h3>
          <p className="text-gray-500 mb-6">Düşüncelerinizi, fikirlerinizi ve önemli bilgileri kaydetmeye başlayın</p>
          <Link
            to="/notes/new"
            className="inline-flex items-center bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            İlk Notunuzu Oluşturun
          </Link>
        </div>
      )}
    </div>
  );
};

export default Notes;