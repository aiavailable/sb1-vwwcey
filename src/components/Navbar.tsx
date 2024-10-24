import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, MessageCircle, User, Menu, PlusCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, searchQuery, setSearchQuery } = useApp();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handlePostAd = () => {
    if (!user) {
      navigate('/login?redirect=/create-ad');
      return;
    }
    navigate('/create-ad');
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            connect
          </Link>

          <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            <button 
              onClick={handlePostAd}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Post Ad
            </button>

            {user ? (
              <>
                <Link to="/favorites" className="p-2 hover:bg-gray-100 rounded-md">
                  <Heart className="h-5 w-5 text-gray-600" />
                </Link>
                <Link to="/messages" className="p-2 hover:bg-gray-100 rounded-md">
                  <MessageCircle className="h-5 w-5 text-gray-600" />
                </Link>
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md"
                  >
                    <User className="h-5 w-5 text-gray-600" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={handlePostAd}
              className="block w-full px-3 py-2 text-base font-medium text-white bg-blue-600 rounded-md"
            >
              Post Ad
            </button>
            {user ? (
              <>
                <Link
                  to="/favorites"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Favorites
                </Link>
                <Link
                  to="/messages"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Messages
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}