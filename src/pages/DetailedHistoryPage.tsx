import React from 'react';
import DetailedHistory from '../components/DetailedHistory';
import { useHistory } from '../hooks/useHistory';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DetailedHistoryPage() {
  const { historyEntries, loading, error } = useHistory();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 dark:text-red-400 py-8">
        Error loading history: {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        Detailed History
      </h1>
      <DetailedHistory entries={historyEntries} />
    </div>
  );
}