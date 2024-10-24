import React, { useState } from 'react';
import { Star, ThumbsUp, Calendar, MapPin, TrendingUp } from 'lucide-react';
import ReviewForm from './ReviewForm';
import { useApp } from '../context/AppContext';

interface Review {
  id: string;
  rating: number;
  date: string;
  location: string;
  recommend: boolean;
  details: string;
  helpful: number;
  reviewer: {
    name: string;
    avatar: string;
    verified: boolean;
  };
}

interface ReviewSectionProps {
  adUserId: string; // Add prop for ad owner's ID
}

export default function ReviewSection({ adUserId }: ReviewSectionProps) {
  const { user } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'helpful'>('recent');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Check if current user is the ad owner
  const isAdOwner = user?.id === adUserId;

  const handleSubmitReview = (reviewData: {
    rating: number;
    details: string;
    recommend: boolean;
  }) => {
    const newReview: Review = {
      id: `review-${Date.now()}`,
      rating: reviewData.rating,
      date: new Date().toISOString(),
      location: 'Portland',
      recommend: reviewData.recommend,
      details: reviewData.details,
      helpful: 0,
      reviewer: {
        name: user?.username || 'Anonymous',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
        verified: user?.isVerified || false
      }
    };
    setReviews([newReview, ...reviews]);
    setShowForm(false);
  };

  const handleHelpful = (reviewId: string) => {
    setReviews(reviews.map(review =>
      review.id === reviewId
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };

  // Filter and sort reviews
  const sortedAndFilteredReviews = [...reviews]
    .filter(review => filterRating === null || review.rating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Reviews</h2>
          <p className="text-sm text-gray-500 mt-1">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </p>
        </div>
        {!showForm && user && !isAdOwner && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Write Review
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-8 border-b border-gray-200 pb-6">
          <ReviewForm
            onSubmit={handleSubmitReview}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Rest of the review section remains the same */}
    </div>
  );
}