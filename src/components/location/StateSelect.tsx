import React from 'react';
import { MapPin } from 'lucide-react';
import { cityData } from '../../data/suburbs';

interface StateSelectProps {
  value: string;
  onChange: (state: string) => void;
}

export default function StateSelect({ value, onChange }: StateSelectProps) {
  const states = Object.keys(cityData);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        State <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select a state</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
}