import React from 'react';
import { Sparkles } from 'lucide-react';
import { useAIInsights } from '../hooks/useAIInsights';
import { HistoryEntry } from '../types';

interface AIInsightsProps {
  historyEntries: HistoryEntry[];
}

export default function AIInsights({ historyEntries }: AIInsightsProps) {
  const { insights, searchPatterns, loading, error } = useAIInsights(historyEntries);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          AI Insights
        </h2>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-600">
          <Sparkles className="w-5 h-5" />
          AI Analysis Error
        </h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5" />
        AI Insights
      </h2>
      
      {insights && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Browsing Patterns</h3>
          <p className="text-gray-700">{insights}</p>
        </div>
      )}
      
      {searchPatterns && (
        <div>
          <h3 className="text-lg font-medium mb-2">Search Patterns</h3>
          <p className="text-gray-700">{searchPatterns}</p>
        </div>
      )}
    </div>
  );
}