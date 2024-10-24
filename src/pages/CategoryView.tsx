import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAdStore } from '../store/adStore';
import AdCard from '../components/AdCard';
import CategoryFilter from '../components/CategoryFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import { Filter } from 'lucide-react';

export default function CategoryView() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { selectedCategory, setSelectedCategory } = useApp();
  const { ads, loading } = useAdStore();

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category, setSelectedCategory]);

  // Filter ads based on selected category
  const filteredAds = React.useMemo(() => {
    if (!selectedCategory || selectedCategory === 'all') return ads;

    return ads.filter(ad => {
      const [mainCat, subCat] = selectedCategory.split('/');
      const [adMainCat, adSubCat] = ad.category.split('/');

      if (subCat) {
        // If a subcategory is specified, match both main category and subcategory
        return adMainCat === mainCat && adSubCat === subCat;
      }
      // If only main category, match just the main category
      return adMainCat === mainCat;
    });
  }, [selectedCategory, ads]);

  const getCategoryTitle = () => {
    if (!selectedCategory || selectedCategory === 'all') return 'All Categories';
    
    const [mainCat, subCat] = selectedCategory.split('/');
    
    // Find the category configuration to get proper names
    const categories = [
      {
        id: 'casual',
        name: 'Casual Dating',
        subcategories: [
          { id: 'w4m', name: 'Women Looking for Men' },
          { id: 'w4w', name: 'Women Looking for Women' },
          { id: 'm4w', name: 'Men Looking for Women' },
          { id: 'fetish', name: 'Fetish Encounters' },
          { id: 'm4m', name: 'Men Looking for Men' },
          { id: 't4x', name: 'Transgender Adventures' },
          { id: 'virtual', name: 'Virtual Adventures' },
          { id: 'c4w', name: 'Couples Seeking Women' },
          { id: 'c4m', name: 'Couples Seeking Men' },
          { id: 'c4c', name: 'Couples Seeking Couples' }
        ]
      },
      {
        id: 'long-term',
        name: 'Long-term',
        subcategories: [
          { id: 'w4m', name: 'Women Looking for Men' },
          { id: 'w4w', name: 'Women Looking for Women' },
          { id: 'm4w', name: 'Men Looking for Women' },
          { id: 'm4m', name: 'Men Looking for Men' },
          { id: 't4x', name: 'Transgender Dating' }
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
          { id: 'arts', name: 'Arts & Culture' },
          { id: 'gaming', name: 'Gaming & Tech' }
        ]
      },
      {
        id: 'services',
        name: 'Services',
        subcategories: [
          { id: 'escorts', name: 'Escorts' },
          { id: 'm4m', name: 'M4M' },
          { id: 'm4w', name: 'M4W' },
          { id: 'massage', name: 'Massages' },
          { id: 't4m', name: 'T4M' },
          { id: 'dancers', name: 'Exotic Dancers' },
          { id: 'fan', name: 'Fan Pages' },
          { id: 'jobs', name: 'Jobs' },
          { id: 'cam', name: 'Phone & Cam' },
          { id: 'other', name: 'Other Services' }
        ]
      }
    ];

    const mainCategory = categories.find(c => c.id === mainCat);
    if (!mainCategory) return mainCat;

    if (subCat) {
      const subcategory = mainCategory.subcategories.find(s => s.id === subCat);
      return subcategory ? `${mainCategory.name} - ${subcategory.name}` : subCat;
    }

    return mainCategory.name;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <div className="flex justify-between items-center py-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {getCategoryTitle()}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {filteredAds.length} {filteredAds.length === 1 ? 'listing' : 'listings'} available
          </p>
        </div>
      </div>

      <div className="flex gap-6 flex-col md:flex-row">
        <aside className="md:w-64 flex-shrink-0">
          <CategoryFilter />
        </aside>

        <section className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <label className="block text-gray-700 mb-1">Sort by</label>
                <select className="w-full border rounded-md px-2 py-1.5">
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="distance">Distance</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Distance</label>
                <select className="w-full border rounded-md px-2 py-1.5">
                  <option value="5">Within 5 miles</option>
                  <option value="10">Within 10 miles</option>
                  <option value="25">Within 25 miles</option>
                  <option value="50">Within 50 miles</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Show</label>
                <select className="w-full border rounded-md px-2 py-1.5">
                  <option value="all">All ads</option>
                  <option value="premium">Premium only</option>
                  <option value="photos">With photos</option>
                  <option value="verified">Verified users</option>
                </select>
              </div>
            </div>

            <button className="mt-4 flex items-center text-sm text-gray-600 hover:text-gray-900">
              <Filter className="w-4 h-4 mr-2" />
              More filters
            </button>
          </div>

          {filteredAds.length > 0 ? (
            <div className="space-y-4">
              {filteredAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">No listings found in this category.</p>
              <button
                onClick={() => navigate('/create-ad')}
                className="mt-4 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                Create the first listing
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}