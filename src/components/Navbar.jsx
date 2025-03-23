import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 
      "text-blue-600 font-medium border-b-2 border-blue-500" : 
      "text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-400";
  };
  
  return (
    <nav className="bg-white shadow-md fixed w-full z-10">
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
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                  <span className="ml-2 text-sm text-gray-700">{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white text-red-600 border border-red-600 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
            >
              <svg
                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white shadow-lg`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            to="/" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Ana Sayfa
          </Link>
          <Link 
            to="/sessions" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname.includes('/sessions') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Seanslar
          </Link>
          <Link 
            to="/notes" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname.includes('/notes') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Kişisel Notlar
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-5">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                {user?.username.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">{user?.username}</div>
            </div>
          </div>
          <div className="mt-3 px-2">
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-100"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;