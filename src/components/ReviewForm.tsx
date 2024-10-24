import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  onSubmit: (review: {
    rating: number;
    details: string;
    recommend: boolean;
  }) => void;
  onCancel: () => void;
}

export default function ReviewForm({ onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [details, setDetails] = useState('');
  const [recommend, setRecommend] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ rating, details, recommend });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`w-6 h-6 ${
                  (hoverRating || rating) >= value
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Review
        </label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Share your experience..."
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="recommend"
          checked={recommend}
          onChange={(e) => setRecommend(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="recommend" className="ml-2 block text-sm text-gray-900">
          I recommend this person
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!rating || !details}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Review
        </button>
      </div>
    </form>
  );
}