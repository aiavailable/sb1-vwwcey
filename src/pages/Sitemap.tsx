import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ChevronRight } from 'lucide-react';

const routes = [
  { path: '/', name: 'Home', description: 'Main landing page with listings' },
  { path: '/login', name: 'Login', description: 'User authentication page' },
  { path: '/create', name: 'Create Ad', description: 'Post new listing form' },
  { path: '/profile', name: 'Profile', description: 'User profile and settings' },
  { path: '/messages', name: 'Messages', description: 'Chat and messaging system' },
  { path: '/ad/1', name: 'Ad Details', description: 'Individual listing page with reviews' },
  { path: '/favorites', name: 'Favorites', description: 'Saved listings' }
];

export default function Sitemap() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Development Sitemap</h1>
          <p className="mt-1 text-sm text-gray-500">Overview of all available pages and routes</p>
        </div>

        <div className="space-y-4">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="block p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{route.name}</h3>
                    <p className="text-sm text-gray-500">{route.description}</p>
                    <code className="text-xs text-gray-400 mt-1">{route.path}</code>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}