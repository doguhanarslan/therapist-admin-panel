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
      console.error('Seans yüklenirken hata:', err);
      setError('Seans verileri yüklenemedi. Lütfen daha sonra tekrar deneyin.');
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
      setError('Danışan adı ve seans tarihi gereklidir.');
      return;
    }
    
    try {
      setLoading(true);
      
      if (isEditMode) {
        await axios.put(`/sessions.php?id=${id}`, formData);
        setSuccess('Seans başarıyla güncellendi.');
      } else {
        await axios.post('/sessions.php', formData);
        setSuccess('Seans başarıyla oluşturuldu.');
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
      console.error('Seans kaydedilirken hata:', err);
      setError('Seans kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && isEditMode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-gray-600">Seans verileri yükleniyor...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        {isEditMode ? 'Seansı Düzenle' : 'Yeni Seans'}
      </h1>
      
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
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{success}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="client_name">
            Danışan Adı
          </label>
          <input
            type="text"
            id="client_name"
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
            className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="session_date">
            Seans Tarihi
          </label>
          <input
            type="date"
            id="session_date"
            name="session_date"
            value={formData.session_date}
            onChange={handleChange}
            className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="notes">
            Seans Notları
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="10"
            className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
            placeholder="Bu alana seans notlarını girebilirsiniz..."
          ></textarea>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/sessions')}
            className="bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors"
            disabled={loading}
          >
            İptal
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:opacity-70"
            disabled={loading}
          >
            {loading ? 'Kaydediliyor...' : isEditMode ? 'Seansı Güncelle' : 'Seans Oluştur'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SessionForm;