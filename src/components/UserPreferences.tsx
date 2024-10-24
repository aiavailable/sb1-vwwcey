import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Eye, Lock, Globe } from 'lucide-react';

export default function UserPreferences() {
  const { user } = useApp();
  const [preferences, setPreferences] = useState({
    notifications: {
      messages: true,
      matches: true,
      likes: true,
      newsletter: false
    },
    privacy: {
      profileVisibility: 'public',
      showOnlineStatus: true,
      showLastSeen: true,
      allowMessages: 'verified'
    },
    location: {
      shareLocation: true,
      maxDistance: 25
    }
  });

  const handleNotificationChange = (key: string) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key as keyof typeof prev.notifications]
      }
    }));
  };

  const handlePrivacyChange = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const handleLocationChange = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [key]: value
      }
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Preferences</h2>

      <div className="space-y-6">
        {/* Notifications */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 flex items-center">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </h3>
          <div className="mt-4 space-y-4">
            {Object.entries(preferences.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label htmlFor={key} className="text-sm text-gray-700">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <div className="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    id={key}
                    checked={value}
                    onChange={() => handleNotificationChange(key)}
                    className="sr-only"
                  />
                  <div className={`w-11 h-6 rounded-full transition ${
                    value ? 'bg-blue-600' : 'bg-gray-200'
                  }`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow transform transition ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 flex items-center">
            <Lock className="w-4 h-4 mr-2" />
            Privacy
          </h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Profile Visibility
              </label>
              <select
                value={preferences.privacy.profileVisibility}
                onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Who can message you
              </label>
              <select
                value={preferences.privacy.allowMessages}
                onChange={(e) => handlePrivacyChange('allowMessages', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Everyone</option>
                <option value="verified">Verified Users Only</option>
                <option value="matches">Matches Only</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Show Online Status</span>
              <div className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.privacy.showOnlineStatus}
                  onChange={(e) => handlePrivacyChange('showOnlineStatus', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition ${
                  preferences.privacy.showOnlineStatus ? 'bg-blue-600' : 'bg-gray-200'
                }`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow transform transition ${
                    preferences.privacy.showOnlineStatus ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            Location
          </h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Share Location</span>
              <div className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.location.shareLocation}
                  onChange={(e) => handleLocationChange('shareLocation', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition ${
                  preferences.location.shareLocation ? 'bg-blue-600' : 'bg-gray-200'
                }`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow transform transition ${
                    preferences.location.shareLocation ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Maximum Distance
              </label>
              <select
                value={preferences.location.maxDistance}
                onChange={(e) => handleLocationChange('maxDistance', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 miles</option>
                <option value={10}>10 miles</option>
                <option value={25}>25 miles</option>
                <option value={50}>50 miles</option>
                <option value={100}>100 miles</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}