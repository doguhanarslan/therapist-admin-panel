import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleLogout = async (e) => {
    e.preventDefault(); // Sayfa yenilenmesini önlemek için
    try {
      console.log('Çıkış işlemi başlatılıyor...');
      await logout();
      console.log('Çıkış işlemi başarılı, yönlendiriliyor...');
      navigate('/login');
    } catch (error) {
      console.error('Çıkış işleminde hata:', error);
    }
  };
  
  return (
    <button
      onClick={handleLogout}
      type="button" // Açıkça düğme türünü belirtmek için
      className="w-full inline-flex items-center justify-center bg-red-50 text-red-600 py-2 px-4 rounded-md font-medium hover:bg-red-100 transition-colors active:bg-red-200"
    >
      <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      <span>Çıkış Yap</span>
    </button>
  );
};

export default LogoutButton;