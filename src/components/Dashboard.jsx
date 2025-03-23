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
        console.log('Dashboard verileri yükleniyor...');
        
        const sessionsPromise = axios.get('/sessions.php')
          .then(res => {
            console.log('Seanslar yanıtı:', res.data);
            return res;
          })
          .catch(err => {
            console.error('Seanslar yükleme hatası:', err.response?.data || err.message);
            return { data: { sessions: [] } }; // Hata durumunda boş dizi dön
          });
        
        const notesPromise = axios.get('/personal_notes.php')
          .then(res => {
            console.log('Notlar yanıtı:', res.data);
            return res;
          })
          .catch(err => {
            console.error('Notlar yükleme hatası:', err.response?.data || err.message);
            return { data: { notes: [] } }; // Hata durumunda boş dizi dön
          });
          
        const [sessionsRes, notesRes] = await Promise.all([
          sessionsPromise,
          notesPromise
        ]);
        
        // Veri yapısı eksik olabilecek yanıtları güvenli bir şekilde işle
        const sessions = sessionsRes.data?.sessions || [];
        const notes = notesRes.data?.notes || [];
        
        setRecentSessions(sessions.slice(0, 5));
        setRecentNotes(notes.slice(0, 5));
        setError('');
      } catch (error) {
        console.error('Dashboard verileri yüklenirken hata:', error);
        setError('Panel verileri yüklenemedi. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-gray-600">Veriler yükleniyor...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Ana Sayfa</h1>
      
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Son Seanslar</h2>
            <Link to="/sessions" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
              Tümünü Gör
            </Link>
          </div>
          
          {recentSessions.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recentSessions.map((session) => (
                <li key={session.id} className="py-3">
                  <Link to={`/sessions/${session.id}`} className="block hover:bg-gray-50 rounded-md px-3 py-2 transition-colors">
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-800">{session.client_name}</p>
                      <p className="text-gray-500 text-sm">{new Date(session.session_date).toLocaleDateString('tr-TR')}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="mt-2 text-gray-500">Henüz seans kaydı bulunmuyor</p>
            </div>
          )}
          
          <div className="mt-6">
            <Link
              to="/sessions/new"
              className="inline-flex items-center justify-center w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Yeni Seans Ekle
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Kişisel Notlar</h2>
            <Link to="/notes" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
              Tümünü Gör
            </Link>
          </div>
          
          {recentNotes.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recentNotes.map((note) => (
                <li key={note.id} className="py-3">
                  <Link to={`/notes/${note.id}`} className="block hover:bg-gray-50 rounded-md px-3 py-2 transition-colors">
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-800">{note.title}</p>
                      <p className="text-gray-500 text-sm">{new Date(note.created_at).toLocaleDateString('tr-TR')}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="mt-2 text-gray-500">Henüz not bulunmuyor</p>
            </div>
          )}
          
          <div className="mt-6">
            <Link
              to="/notes/new"
              className="inline-flex items-center justify-center w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Yeni Not Ekle
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;