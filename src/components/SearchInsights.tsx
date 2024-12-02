import React, { useMemo } from 'react';
import { Search } from 'lucide-react';
import { HistoryEntry } from '../types';
import { extractSearchQuery } from '../utils/url/parsers';

interface SearchInsightsProps {
  historyEntries: HistoryEntry[];
}

export default function SearchInsights({ historyEntries }: SearchInsightsProps) {
  const topSearches = useMemo(() => {
    const searches = historyEntries
      .map(entry => extractSearchQuery(entry.url))
      .filter((query): query is string => query !== null);

    const searchCounts = searches.reduce((acc, query) => {
      acc[query] = (acc[query] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(searchCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([query, frequency]) => ({
        query,
        frequency,
        lastSearched: new Date()
      }));
  }, [historyEntries]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Search className="w-5 h-5" />
        Top Searches
      </h2>
      <div className="space-y-4">
        {topSearches.map((search, index) => (
          <div key={search.query} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
              <span className="font-medium text-gray-900">{search.query}</span>
            </div>
            <span className="text-sm text-gray-600">{search.frequency} times</span>
          </div>
        ))}
      </div>
    </div>
  );
}