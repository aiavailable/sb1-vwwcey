import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Clock, Star, MessageCircle, Flag, Share2, Heart, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAdStore } from '../store/adStore';
import { useUserStore } from '../store/userStore';
import ReviewSection from '../components/ReviewSection';

export default function AdDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useApp();
  const { getAdById } = useAdStore();
  const { getProfile } = useUserStore();
  const ad = getAdById(id || '');

  if (!ad) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Ad not found</h2>
          <p className="mt-2 text-gray-600">The advertisement you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const adUserProfile = getProfile(ad.userId);

  // Check if current user is the ad owner
  const isAdOwner = user?.id === ad.userId;

  const handleMessage = () => {
    if (!user) {
      navigate('/login', { state: { from: `/ad/${id}` } });
      return;
    }
    navigate('/messages', { state: { recipientId: ad.userId } });
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {ad.images && ad.images.length > 0 ? (
              <img
                src={ad.images[0]}
                alt={ad.title}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-semibold text-gray-900">{ad.title}</h1>
              {ad.isPremium && (
                <div className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Premium
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{ad.location.city}, {ad.location.neighborhood}</span>
              <span className="mx-2">•</span>
              <Clock className="w-4 h-4 mr-1" />
              <span>{new Date(ad.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 whitespace-pre-line">{ad.description}</p>
            </div>

            <div className="mt-6 flex items-center space-x-4">
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <Flag className="w-5 h-5 mr-1" />
                Report
              </button>
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <Share2 className="w-5 h-5 mr-1" />
                Share
              </button>
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <Heart className="w-5 h-5 mr-1" />
                Save
              </button>
            </div>
          </div>

          {/* Reviews */}
          {!isAdOwner && <ReviewSection adId={ad.id} />}
        </div>

        {/* Contact Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Link 
              to={`/user/${ad.userId}`}
              className="flex items-center space-x-4 mb-6 hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                {adUserProfile.avatar ? (
                  <img 
                    src={adUserProfile.avatar}
                    alt={adUserProfile.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 font-medium">
                    {adUserProfile.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  {adUserProfile.username}
                  {adUserProfile.isVerified && (
                    <Shield className="w-4 h-4 ml-1 text-blue-500" />
                  )}
                </h3>
                <p className="text-sm text-gray-500">
                  Member since {new Date(adUserProfile.joinDate).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </Link>

            {!isAdOwner && (
              <button
                onClick={handleMessage}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Send Message
              </button>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-medium text-gray-900 mb-4">Safety Tips</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Meet in public places</li>
              <li>• Don't send money to strangers</li>
              <li>• Trust your instincts</li>
              <li>• Report suspicious behavior</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}