import React, { useState, useRef } from 'react';
import { Camera, X } from 'lucide-react';

interface ProfileImageUploadProps {
  currentImage?: string;
  username: string;
  onImageChange: (image: string) => void;
}

export default function ProfileImageUpload({ currentImage, username, onImageChange }: ProfileImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setPreviewUrl(imageUrl);
        onImageChange(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayImage = previewUrl || currentImage;

  return (
    <div className="relative">
      <div
        className="w-32 h-32 rounded-full overflow-hidden relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt={username}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-3xl font-semibold text-gray-500">
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        <div
          className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          >
            <Camera className="w-5 h-5 text-gray-700" />
          </button>
          {displayImage && (
            <button
              onClick={handleRemoveImage}
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors ml-2"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
}