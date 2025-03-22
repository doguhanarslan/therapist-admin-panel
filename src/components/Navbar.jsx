import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-xl font-bold">Therapist Admin</Link>
            </div>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Dashboard</Link>
              <Link to="/sessions" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Sessions</Link>
              <Link to="/notes" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Personal Notes</Link>
            </div>
          </div>
          <div className="flex items-center">
            {user && (
              <span className="text-sm mr-4">Welcome, {user.username}</span>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;