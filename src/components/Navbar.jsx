import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LogoutButton from './LogoutButton'; // Yeni bileşeni içe aktarıyoruz

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Sayfa kaydırıldığında navbar görünümünü değiştir
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Sayfa değiştiğinde mobil menüyü kapat
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    return location.pathname === path ? 
      "text-blue-600 font-medium border-b-2 border-blue-500" : 
      "text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-400";
  };
  
  return (
    <nav className={`fixed w-full z-20 top-0 transition-all duration-200 ${scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
                  <path d="M10 4a1 1 0 100 2 1 1 0 000-2zM9 8a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm1 3a1 1 0 100 2 1 1 0 000-2z" />
                </svg>
                <span className="text-xl font-semibold text-gray-800">TerapiWon</span>
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex space-x-6">
                <Link to="/" className={`px-3 py-2 text-sm ${isActive('/')}`}>
                  Ana Sayfa
                </Link>
                <Link to="/sessions" className={`px-3 py-2 text-sm ${isActive('/sessions')}`}>
                  Seanslar
                </Link>
                <Link to="/notes" className={`px-3 py-2 text-sm ${isActive('/notes')}`}>
                  Kişisel Notlar
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center">
            {user && (
              <div className="flex items-center space-x-4">
                <div className="relative flex items-center">
                  <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                  <span className="ml-2 text-sm text-gray-700">{user?.username || 'Kullanıcı'}</span>
                </div>
                {/* Ayrı bir bileşen olarak düzeltilmiş çıkış butonu */}
                <div className="w-28">
                  <LogoutButton />
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">{mobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}</span>
              <svg
                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div 
        className={`${mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} transform transition-all duration-200 ease-in-out md:hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-40`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div 
          className={`${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} transform transition-all duration-300 ease-in-out h-full w-64 bg-white shadow-xl fixed right-0 top-0 z-50`}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center">
              <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
              <span className="ml-2 text-sm font-medium text-gray-800">{user?.username || 'Kullanıcı'}</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="py-4">
            <Link 
              to="/" 
              className={`block px-4 py-3 text-base font-medium ${location.pathname === '/' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`}
            >
              Ana Sayfa
            </Link>
            <Link 
              to="/sessions" 
              className={`block px-4 py-3 text-base font-medium ${location.pathname.includes('/sessions') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`}
            >
              Seanslar
            </Link>
            <Link 
              to="/notes" 
              className={`block px-4 py-3 text-base font-medium ${location.pathname.includes('/notes') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`}
            >
              Kişisel Notlar
            </Link>
          </div>
          <div className="absolute bottom-0 left-0 right-0 border-t p-4">
            {/* Mobil görünümde LogoutButton bileşenini kullanıyoruz */}
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;