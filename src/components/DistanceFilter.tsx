import React from 'react';
import { MapPin } from 'lucide-react';

interface DistanceFilterProps {
  value: number;
  onChange: (value: number) => void;
}

export default function DistanceFilter({ value, onChange }: DistanceFilterProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="appearance-none w-full px-4 py-2 pl-10 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value={5}>Within 5 miles</option>
        <option value={10}>Within 10 miles</option>
        <option value={25}>Within 25 miles</option>
        <option value={50}>Within 50 miles</option>
        <option value={100}>Within 100 miles</option>
      </select>
      <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>
  );
}