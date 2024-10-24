import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, MessageCircle, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { user, logout, searchQuery, setSearchQuery } = useApp();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="bg-white shadow-sm">
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

          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/favorites" className="p-2 hover:bg-gray-100 rounded-md">
                  <Heart className="h-5 w-5 text-gray-600" />
                </Link>
                <Link to="/messages" className="p-2 hover:bg-gray-100 rounded-md">
                  <MessageCircle className="h-5 w-5 text-gray-600" />
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md"
                  >
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="hidden sm:inline text-sm font-medium text-gray-700">
                      {user.username}
                    </span>
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={logout}
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
        </div>
      </div>
    </header>
  );
}