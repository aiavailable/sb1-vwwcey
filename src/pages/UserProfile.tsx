import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Calendar, Users, Shield, Phone, Clock, 
  Instagram, Facebook, Twitter, Globe, MessageCircle,
  Mail, Heart
} from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useAdStore } from '../store/adStore';
import { useApp } from '../context/AppContext';
import AdCard from '../components/AdCard';

export default function UserProfile() {
  const { userId } = useParams();
  const { user } = useApp();
  const { getProfile, followUser, unfollowUser, isFollowing } = useUserStore();
  const { getAdsByUser } = useAdStore();
  const [activeTab, setActiveTab] = useState<'listings' | 'about'>('listings');

  if (!userId) return null;

  const profile = getProfile(userId);
  const userAds = getAdsByUser(userId);
  const isOwnProfile = user?.id === userId;
  const following = user ? isFollowing(user.id, userId) : false;

  const handleFollow = () => {
    if (!user) return;
    if (following) {
      unfollowUser(user.id, userId);
    } else {
      followUser(user.id, userId);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400">
          <div className="absolute inset-0 bg-black/5 backdrop-blur-sm"></div>
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white text-blue-600 flex items-center justify-center text-4xl font-bold mb-4 sm:mb-0 sm:mr-6 border-4 border-white shadow-lg">
              {profile.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={profile.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                profile.username.charAt(0).toUpperCase()
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2 flex items-center justify-center sm:justify-start">
                    {profile.username}
                    {profile.isVerified && (
                      <Shield className="w-5 h-5 ml-2 text-blue-200" />
                    )}
                  </h1>
                  <div className="flex items-center justify-center sm:justify-start space-x-4 text-blue-50 text-sm">
                    {profile.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {profile.location.city}, {profile.location.state}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Joined {new Date(profile.joinDate).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                {!isOwnProfile && user && (
                  <div className="flex mt-4 sm:mt-0 space-x-3">
                    <Link
                      to={`/messages?user=${userId}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 bg-opacity-25 hover:bg-opacity-35 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Link>
                    <button
                      onClick={handleFollow}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                        following
                          ? 'text-blue-600 bg-white hover:bg-blue-50'
                          : 'text-white bg-blue-500 bg-opacity-25 hover:bg-opacity-35'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      {following ? 'Following' : 'Follow'}
                    </button>
                  </div>
                )}
              </div>

              {profile.bio && (
                <p className="text-blue-50 mt-4">{profile.bio}</p>
              )}

              <div className="flex flex-wrap justify-center sm:justify-start mt-6 space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{profile.followers.length}</div>
                  <div className="text-blue-100 text-sm">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{profile.following.length}</div>
                  <div className="text-blue-100 text-sm">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{userAds.length}</div>
                  <div className="text-blue-100 text-sm">Listings</div>
                </div>
              </div>
            </div>
          </div>

          {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
            <div className="relative flex items-center justify-center sm:justify-start mt-6 pt-6 border-t border-blue-400/30 space-x-4">
              {profile.socialLinks.instagram && (
                <a
                  href={`https://instagram.com/${profile.socialLinks.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-50 hover:text-white transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {profile.socialLinks.facebook && (
                <a
                  href={profile.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-50 hover:text-white transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {profile.socialLinks.twitter && (
                <a
                  href={`https://twitter.com/${profile.socialLinks.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-50 hover:text-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {profile.socialLinks.website && (
                <a
                  href={profile.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-50 hover:text-white transition-colors"
                >
                  <Globe className="w-5 h-5" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('listings')}
              className={`flex-1 sm:flex-none px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'listings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Listings
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`flex-1 sm:flex-none px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'about'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              About
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'listings' ? (
            <div className="space-y-4">
              {userAds.length > 0 ? (
                userAds.map(ad => (
                  <AdCard key={ad.id} ad={ad} />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No listings yet</h3>
                  <p className="text-gray-500">When {isOwnProfile ? 'you post' : 'they post'} listings, they will appear here.</p>
                  {isOwnProfile && (
                    <Link
                      to="/create-ad"
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Create your first listing
                    </Link>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="space-y-6">
                {profile.bio && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">About</h3>
                    <p className="text-gray-600">{profile.bio}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {profile.location && (
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">Location</h4>
                        <p className="text-sm text-gray-500">{profile.location.city}, {profile.location.state}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">Member since</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(profile.joinDate).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">Response rate</h4>
                      <p className="text-sm text-gray-500">Usually responds within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">Last active</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(profile.lastActive || profile.joinDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {profile.isVerified && (
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <div className="flex">
                      <Shield className="w-6 h-6 text-blue-600" />
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-blue-900">Verified member</h4>
                        <p className="mt-1 text-sm text-blue-600">
                          This member has verified their identity and contact information.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}