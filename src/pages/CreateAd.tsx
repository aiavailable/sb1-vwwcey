import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAdStore } from '../store/adStore';
import { useUserStore } from '../store/userStore';
import LocationPicker from '../components/LocationPicker';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = [
  {
    id: 'casual',
    name: 'Casual Dating',
    subcategories: [
      { id: 'w4m', name: 'Women Looking for Men' },
      { id: 'w4w', name: 'Women Looking for Women' },
      { id: 'm4w', name: 'Men Looking for Women' },
      { id: 'm4m', name: 'Men Looking for Men' },
      { id: 't4x', name: 'Transgender Adventures' },
      { id: 'virtual', name: 'Virtual Adventures' }
    ]
  },
  {
    id: 'long-term',
    name: 'Long-term',
    subcategories: [
      { id: 'w4m', name: 'Women Looking for Men' },
      { id: 'w4w', name: 'Women Looking for Women' },
      { id: 'm4w', name: 'Men Looking for Women' },
      { id: 'm4m', name: 'Men Looking for Men' }
    ]
  },
  {
    id: 'friendship',
    name: 'Friendship',
    subcategories: [
      { id: 'platonic', name: 'Platonic Friends' },
      { id: 'activity', name: 'Activity Partners' },
      { id: 'networking', name: 'Professional Networking' }
    ]
  },
  {
    id: 'activities',
    name: 'Activities',
    subcategories: [
      { id: 'sports', name: 'Sports & Fitness' },
      { id: 'outdoor', name: 'Outdoor Adventures' },
      { id: 'dining', name: 'Dining & Nightlife' },
      { id: 'arts', name: 'Arts & Culture' }
    ]
  },
  {
    id: 'services',
    name: 'Services',
    subcategories: [
      { id: 'massage', name: 'Massages' },
      { id: 'jobs', name: 'Jobs' },
      { id: 'other', name: 'Other Services' }
    ]
  }
];

export default function CreateAd() {
  const navigate = useNavigate();
  const { user } = useApp();
  const { createAd, loading } = useAdStore();
  const { addProfile, getProfile } = useUserStore();
  const [title, setTitle] = useState('');
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState({
    city: 'Portland',
    neighborhood: '',
    coordinates: { lat: 45.5155, lng: -122.6789 }
  });
  const [isNSFW, setIsNSFW] = useState(false);
  const [error, setError] = useState('');

  // Get subcategories for selected main category
  const selectedCategorySubcategories = categories.find(
    cat => cat.id === mainCategory
  )?.subcategories || [];

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/create-ad');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !mainCategory || !subCategory || !description || !location.neighborhood) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      // Ensure user profile exists
      const userProfile = getProfile(user.id);
      if (userProfile.username === `User ${user.id.split('_')[1] || user.id}`) {
        // If using default profile, create a proper one
        addProfile(user.id, {
          username: user.username,
          joinDate: new Date().toISOString(),
          isVerified: user.isVerified,
          avatar: user.avatar
        });
      }

      const newAd = await createAd({
        title,
        category: `${mainCategory}/${subCategory}`,
        description,
        location,
        images,
        isPremium: false,
        isNSFW,
        userId: user.id
      });

      if (newAd) {
        navigate(`/ad/${newAd.id}`);
      }
    } catch (err) {
      setError('Failed to create ad. Please try again.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New Ad</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center p-4 text-red-700 bg-red-50 rounded-md">
              <AlertCircle className="w-5 h-5 mr-3" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Give your ad a catchy title"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={mainCategory}
                onChange={(e) => {
                  setMainCategory(e.target.value);
                  setSubCategory(''); // Reset subcategory when main category changes
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory <span className="text-red-500">*</span>
              </label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!mainCategory}
              >
                <option value="">Select a subcategory</option>
                {selectedCategorySubcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <LocationPicker value={location} onChange={setLocation} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe what you're looking for..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="nsfw"
              checked={isNSFW}
              onChange={(e) => setIsNSFW(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="nsfw" className="ml-2 block text-sm text-gray-900">
              This ad contains adult content (NSFW)
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Ad...' : 'Post Ad'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}