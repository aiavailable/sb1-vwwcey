import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Settings, Bell, Shield, CreditCard, Edit, Trash2, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAdStore } from '../store/adStore';
import { useUserStore } from '../store/userStore';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfileImageUpload from '../components/ProfileImageUpload';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useApp();
  const { ads, loading, deleteAd } = useAdStore();
  const { updateProfile } = useUserStore();
  const [activeTab, setActiveTab] = useState('my-ads');
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;
  
  // Get ads for the current user
  const myAds = ads ? ads.filter(ad => ad.userId === user.id) : [];

  const handleEditAd = (adId: string) => {
    navigate(`/edit-ad/${adId}`);
  };

  const handleViewAd = (adId: string) => {
    navigate(`/ad/${adId}`);
  };

  const handleDeleteAd = async (adId: string) => {
    try {
      await deleteAd(adId);
      setShowConfirmDelete(null);
    } catch (error) {
      console.error('Failed to delete ad:', error);
    }
  };

  const handleProfileImageChange = async (imageUrl: string) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateProfile(user.id, { avatar: imageUrl });
      updateUser({ avatar: imageUrl });
    } catch (error) {
      console.error('Failed to update profile image:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || isSaving) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="p-6 sm:p-8 bg-blue-600">
          <div className="flex items-center">
            <ProfileImageUpload
              currentImage={user.avatar}
              username={user.username}
              onImageChange={handleProfileImageChange}
            />
            <div className="ml-6">
              <h1 className="text-2xl font-semibold text-white">{user.username}</h1>
              <p className="text-blue-100">Member since March 2024</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
          {/* Sidebar Navigation */}
          <nav className="p-4">
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('my-ads')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'my-ads'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                My Ads
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'settings'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-4 h-4 mr-3" />
                Account Settings
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'notifications'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Bell className="w-4 h-4 mr-3" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'privacy'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Shield className="w-4 h-4 mr-3" />
                Privacy & Safety
              </button>
              <button
                onClick={() => setActiveTab('billing')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'billing'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CreditCard className="w-4 h-4 mr-3" />
                Billing
              </button>
            </div>
          </nav>

          {/* Main Content Area */}
          <div className="col-span-2 p-4 sm:p-6">
            {activeTab === 'my-ads' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">My Ads</h2>
                    <p className="text-sm text-gray-500">
                      {myAds.length} {myAds.length === 1 ? 'ad' : 'ads'} posted
                    </p>
                  </div>
                  <Link
                    to="/create-ad"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Post New Ad
                  </Link>
                </div>

                {myAds.length > 0 ? (
                  <div className="space-y-4">
                    {myAds.map((ad) => (
                      <div
                        key={ad.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          {ad.images[0] && (
                            <img
                              src={ad.images[0]}
                              alt={ad.title}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          )}
                          <div>
                            <h3 className="font-medium text-gray-900">{ad.title}</h3>
                            <p className="text-sm text-gray-500">
                              Posted on {new Date(ad.createdAt).toLocaleDateString()}
                            </p>
                            <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                              {ad.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewAd(ad.id)}
                            className="p-2 text-gray-600 hover:bg-gray-200 rounded-md"
                            title="View ad"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEditAd(ad.id)}
                            className="p-2 text-gray-600 hover:bg-gray-200 rounded-md"
                            title="Edit ad"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setShowConfirmDelete(ad.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                            title="Delete ad"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>

                          {/* Delete Confirmation Dialog */}
                          {showConfirmDelete === ad.id && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                              <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                  Delete Ad
                                </h3>
                                <p className="text-gray-500 mb-6">
                                  Are you sure you want to delete this ad? This action cannot be undone.
                                </p>
                                <div className="flex justify-end space-x-3">
                                  <button
                                    onClick={() => setShowConfirmDelete(null)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAd(ad.id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">You haven't posted any ads yet.</p>
                    <Link
                      to="/create-ad"
                      className="mt-4 inline-block px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      Create your first ad
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Display Name</label>
                    <input
                      type="text"
                      defaultValue={user.username}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                      rows={4}
                      defaultValue="Adventure seeker and coffee enthusiast."
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}