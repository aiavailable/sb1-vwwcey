import React, { useState, useMemo } from 'react';
import { Users, Heart, Coffee, Users2, Bike, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAdStore } from '../store/adStore';

const categoryConfig = [
  { id: 'all', name: 'All Categories', icon: Users },
  {
    id: 'casual',
    name: 'Casual Dating',
    icon: Coffee,
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
    icon: Heart,
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
    icon: Users2,
    subcategories: [
      { id: 'platonic', name: 'Platonic Friends' },
      { id: 'activity', name: 'Activity Partners' },
      { id: 'networking', name: 'Professional Networking' }
    ]
  },
  {
    id: 'activities',
    name: 'Activities',
    icon: Bike,
    subcategories: [
      { id: 'sports', name: 'Sports & Fitness' },
      { id: 'outdoor', name: 'Outdoor Adventures' },
      { id: 'dining', name: 'Dining & Nightlife' },
      { id: 'arts', name: 'Arts & Culture' }
    ]
  }
];

export default function CategoryFilter() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { selectedCategory, setSelectedCategory } = useApp();
  const { ads } = useAdStore();

  // Calculate counts for categories and subcategories
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    
    // Initialize counts
    categoryConfig.forEach(category => {
      counts.set(category.id, 0);
      category.subcategories?.forEach(sub => {
        counts.set(`${category.id}/${sub.id}`, 0);
      });
    });

    // Count ads
    ads.forEach(ad => {
      const [mainCat, subCat] = ad.category.split('/');
      
      // Increment main category count
      counts.set(mainCat, (counts.get(mainCat) || 0) + 1);
      
      // Increment subcategory count
      if (subCat) {
        const fullPath = `${mainCat}/${subCat}`;
        counts.set(fullPath, (counts.get(fullPath) || 0) + 1);
      }
    });

    return counts;
  }, [ads]);

  const handleCategoryClick = (categoryId: string, subCategoryId?: string) => {
    const newCategory = subCategoryId ? `${categoryId}/${subCategoryId}` : categoryId;
    setSelectedCategory(newCategory);
    
    if (!subCategoryId && categoryConfig.find(c => c.id === categoryId)?.subcategories) {
      setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
      <div className="space-y-1">
        {categoryConfig.map((category) => (
          <div key={category.id}>
            <button
              onClick={() => handleCategoryClick(category.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 rounded-md ${
                selectedCategory === category.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <category.icon className="w-4 h-4 mr-3 text-gray-500" />
                <span>{category.name}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 text-xs mr-2">
                  {categoryCounts.get(category.id) || 0}
                </span>
                {category.subcategories && (
                  expandedCategory === category.id ? 
                    <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </div>
            </button>
            
            {category.subcategories && expandedCategory === category.id && (
              <div className="ml-6 mt-1 space-y-1">
                {category.subcategories.map((sub) => {
                  const fullPath = `${category.id}/${sub.id}`;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleCategoryClick(category.id, sub.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 rounded-md ${
                        selectedCategory === fullPath ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      <span>{sub.name}</span>
                      <span className="text-gray-500 text-xs">
                        {categoryCounts.get(fullPath) || 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}