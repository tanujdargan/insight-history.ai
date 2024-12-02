import React from 'react';
import { BarChart3 } from 'lucide-react';
import { cn } from '../utils/cn';
import { HistoryEntry } from '../types';
import { analyzeBrowsingPatterns, analyzeSearchPatterns } from '../utils/analytics';

interface BrowsingAnalyticsProps {
  historyEntries: HistoryEntry[];
}

export default function BrowsingAnalytics({ historyEntries }: BrowsingAnalyticsProps) {
  const browsingPatterns = analyzeBrowsingPatterns(historyEntries);
  const searchPatterns = analyzeSearchPatterns(historyEntries);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <BarChart3 className="w-5 h-5" />
        Browsing Analytics
      </h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            Browsing Patterns
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            {browsingPatterns}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            Search Patterns
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            {searchPatterns}
          </p>
        </div>
      </div>
    </div>
  );
}