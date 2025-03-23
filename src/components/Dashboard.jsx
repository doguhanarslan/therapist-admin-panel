import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [recentSessions, setRecentSessions] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  
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
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          <span className="ml-3 text-gray-600 font-medium">Veriler yükleniyor...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-8">
        
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Hoş Geldiniz, {user?.username || 'Terapist'}</h1>
          <p className="text-gray-500">Bugün {new Date().toLocaleDateString('tr-TR', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</p>
        </div>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-500 text-white px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Son Seanslar</h2>
            <Link to="/sessions" className="bg-white text-blue-500 text-md font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors">
              Tümünü Gör
            </Link>
          </div>
          
          {recentSessions.length > 0 ? (
            <div className="p-4">
              <ul className="divide-y divide-gray-200">
                {recentSessions.map((session) => (
                  <li key={session.id} className="py-3 first:pt-0 last:pb-0">
                    <Link to={`/sessions/${session.id}`} className="block hover:bg-gray-50 rounded-md px-3 py-2 transition-colors">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{session.client_name}</p>
                          <p className="text-xs text-gray-500 mt-1">Seans notları: {session.notes ? `${session.notes.substring(0, 30)}...` : 'Not yok'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-blue-600">{formatDate(session.session_date)}</p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-8 px-4">
              <div className="bg-blue-50 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500">Henüz seans kaydı bulunmuyor</p>
            </div>
          )}
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
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
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-500 text-white px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Kişisel Notlar</h2>
            <Link to="/notes" className="bg-white text-green-500 text-md font-medium px-2 py-1 rounded hover:bg-green-50 transition-colors">
              Tümünü Gör
            </Link>
          </div>
          
          {recentNotes.length > 0 ? (
            <div className="p-4">
              <ul className="divide-y divide-gray-200">
                {recentNotes.map((note) => (
                  <li key={note.id} className="py-3 first:pt-0 last:pb-0">
                    <Link to={`/notes/${note.id}`} className="block hover:bg-gray-50 rounded-md px-3 py-2 transition-colors">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{note.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{note.content ? `${note.content.substring(0, 30)}...` : 'İçerik yok'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-green-600">{formatDate(note.created_at)}</p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-8 px-4">
              <div className="bg-green-50 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <p className="text-gray-500">Henüz not bulunmuyor</p>
            </div>
          )}
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
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
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Hızlı İstatistikler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-xs text-gray-500">Toplam Seans</p>
                <p className="text-lg font-semibold">{recentSessions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-full">
                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-xs text-gray-500">Toplam Not</p>
                <p className="text-lg font-semibold">{recentNotes.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 rounded-full">
                <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-xs text-gray-500">Danışanlar</p>
                <p className="text-lg font-semibold">
                  {new Set(recentSessions.map(s => s.client_name)).size}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-amber-100 p-2 rounded-full">
                <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-xs text-gray-500">Bu Hafta</p>
                <p className="text-lg font-semibold">
                  {recentSessions.filter(s => {
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    return new Date(s.session_date) >= oneWeekAgo;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;