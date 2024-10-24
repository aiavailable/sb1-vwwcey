import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { cityData } from '../../data/suburbs';

interface SuburbSelectProps {
  state: string;
  city: string;
  value: string;
  onChange: (suburb: string) => void;
}

export default function SuburbSelect({ state, city, value, onChange }: SuburbSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const suburbs = useMemo(() => {
    return city ? cityData[state]?.[city]?.suburbs || [] : [];
  }, [state, city]);

  const displayValue = useMemo(() => {
    return value ? `${city}, ${value}` : '';
  }, [city, value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuburbSelect = (suburb: string) => {
    onChange(suburb);
    setIsOpen(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Suburb <span className="text-red-500">*</span>
      </label>
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <input
            type="text"
            value={displayValue}
            onClick={() => setIsOpen(true)}
            onFocus={() => setIsOpen(true)}
            placeholder={city ? `Search suburbs in ${city}...` : 'Select a city first'}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!city}
            required
            readOnly
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {isOpen && city && suburbs.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {suburbs.map((suburb) => (
              <button
                key={suburb}
                type="button"
                onClick={() => handleSuburbSelect(suburb)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100 ${
                  value === suburb ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                {`${city}, ${suburb}`}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}