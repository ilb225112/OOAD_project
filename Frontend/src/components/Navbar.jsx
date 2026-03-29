import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-white text-2xl font-bold hover:text-blue-100 transition">
            🔨 Auction System
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-white hover:text-blue-100 transition font-medium"
            >
              Home
            </Link>
            <Link 
              to="/bidderAuctions" 
              className="text-white hover:text-blue-100 transition font-medium"
            >
              My Auctions
            </Link>
            <Link 
              to={`/profile/${user.userId}`} 
              className="text-white hover:text-blue-100 transition font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {user.name}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-medium shadow-md"
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
