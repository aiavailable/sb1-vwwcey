import React from 'react';
import { Shield } from 'lucide-react';

export default function VerifiedBadge() {
  return (
    <div className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
      <Shield className="w-3 h-3 mr-1" />
      Verified
    </div>
  );
}