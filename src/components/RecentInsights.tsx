import React from 'react';
import { Clock, Bookmark } from 'lucide-react';
import { useRecentHistory } from '../hooks/useRecentHistory';
import LoadingSpinner from './LoadingSpinner';
import ErrorBoundary from './ErrorBoundary';

function RecentInsights() {
  const { insights, loading, error } = useRecentHistory();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity Insights
        </h2>
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-600">
          <Clock className="w-5 h-5" />
          Error Loading Insights
        </h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Recent Activity Insights
      </h2>
      <div className="prose prose-blue">
        <div className="flex items-start gap-2">
          <Bookmark className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
          <p className="text-gray-700">{insights}</p>
        </div>
      </div>
    </div>
  );
}

export default function RecentInsightsWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <RecentInsights />
    </ErrorBoundary>
  );
}