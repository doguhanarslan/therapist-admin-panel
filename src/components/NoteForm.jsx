import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const NoteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    if (isEditMode) {
      fetchNote();
    }
  }, [id, isEditMode]);
  
  const fetchNote = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log(`ID: ${id} olan not yükleniyor`);
      const response = await axios.get(`/personal_notes.php?id=${id}`);
      
      console.log('Not yanıtı:', response.data);
      
      // Validate the response structure
      if (!response.data || !response.data.note) {
        console.error('Geçersiz yanıt formatı:', response.data);
        setError('Sunucudan geçersiz veri formatı alındı');
        return;
      }
      
      const note = response.data.note;
      
      // Use default empty strings if properties are missing
      setFormData({
        title: note.title || '',
        content: note.content || ''
      });
      
    } catch (err) {
      console.error('Not yüklenirken hata:', err);
      setError(`Not verileri yüklenemedi: ${err.message}`);
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
    
    if (!formData.title) {
      setError('Başlık alanı gereklidir.');
      return;
    }
    
    try {
      setLoading(true);
      
      if (isEditMode) {
        await axios.put(`/personal_notes.php?id=${id}`, formData);
        setSuccess('Not başarıyla güncellendi.');
      } else {
        await axios.post('/personal_notes.php', formData);
        setSuccess('Not başarıyla oluşturuldu.');
        // Clear form after successful creation
        setFormData({
          title: '',
          content: ''
        });
      }
      
      // Redirect after short delay
      setTimeout(() => {
        // Add a timestamp to force the notes page to refetch data
        navigate('/notes', { state: { refresh: Date.now() } });
      }, 1500);
      
    } catch (err) {
      console.error('Not kaydedilirken hata:', err);
      setError('Not kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && isEditMode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mr-2"></div>
          <span className="text-gray-600">Not verileri yükleniyor...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        {isEditMode ? 'Notu Düzenle' : 'Yeni Not'}
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
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">
            Başlık
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={loading}
            required
            placeholder="Not başlığını girin"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="content">
            İçerik
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="15"
            className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={loading}
            placeholder="Not içeriğini girin..."
          ></textarea>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/notes')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors"
            disabled={loading}
          >
            İptal
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors disabled:opacity-70"
            disabled={loading}
          >
            {loading ? 'Kaydediliyor...' : isEditMode ? 'Notu Güncelle' : 'Not Oluştur'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;