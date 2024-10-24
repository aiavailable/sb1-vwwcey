import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Star, MessageCircle, Heart, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useUserStore } from '../store/userStore';
import type { Ad } from '../types';

interface AdCardProps {
  ad: Ad;
}

export default function AdCard({ ad }: AdCardProps) {
  const { user, toggleFavorite, isFavorite } = useApp();
  const { getProfile } = useUserStore();
  const navigate = useNavigate();
  const favorite = isFavorite(ad.id);
  const adUserProfile = getProfile(ad.userId);

  const handleUserClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the parent Link from navigating
    e.stopPropagation(); // Stop event bubbling
    navigate(`/user/${ad.userId}`);
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the parent Link from navigating
    e.stopPropagation(); // Stop event bubbling
    navigate('/messages', { state: { recipientId: ad.userId } });
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the parent Link from navigating
    e.stopPropagation(); // Stop event bubbling
    toggleFavorite(ad.id);
  };

  return (
    <Link to={`/ad/${ad.id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-48 h-48 flex-shrink-0 relative">
            <img
              src={ad.images[0] || 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop'}
              alt={ad.title}
              className="w-full h-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
            />
            {user && (
              <button
                onClick={handleFavoriteClick}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100"
              >
                <Heart 
                  className={`w-5 h-5 ${
                    favorite ? 'text-red-500 fill-current' : 'text-gray-400'
                  }`} 
                />
              </button>
            )}
          </div>
          
          <div className="p-4 flex-1">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-gray-900">{ad.title}</h3>
                {adUserProfile.isVerified && (
                  <Shield className="w-4 h-4 ml-2 text-blue-500" />
                )}
              </div>
              {ad.isPremium && (
                <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  Premium
                </div>
              )}
            </div>
            
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{ad.location.city}, {ad.location.neighborhood}</span>
              <span className="mx-2">•</span>
              <Clock className="w-4 h-4 mr-1" />
              <span>{new Date(ad.createdAt).toLocaleDateString()}</span>
            </div>
            
            <p className="mt-3 text-sm text-gray-600 line-clamp-2">{ad.description}</p>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                  {ad.category}
                </span>
                <button
                  onClick={handleUserClick}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                >
                  <span className="mr-1">by</span>
                  {adUserProfile.username}
                  {adUserProfile.isVerified && (
                    <Shield className="w-3 h-3 ml-1 text-blue-500" />
                  )}
                </button>
              </div>
              <button 
                onClick={handleContactClick}
                className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}