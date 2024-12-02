import { useState, useEffect } from 'react';
import { analyzeHistory, categorizeSearches } from '../services/aiService';
import { HistoryEntry } from '../types';
import { mockAnalyzeHistory, mockCategorizeSearches } from '../services/mockAiService';

export function useAIInsights(historyEntries: HistoryEntry[]) {
  const [insights, setInsights] = useState<string | null>(null);
  const [searchPatterns, setSearchPatterns] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInsights() {
      if (!historyEntries.length) return;
      
      setLoading(true);
      try {
        // Use mock services for development/demo
        const [historyInsights, searchInsights] = await Promise.all([
          mockAnalyzeHistory(historyEntries),
          mockCategorizeSearches(
            historyEntries
              .filter(entry => entry.url.includes('google.com/search'))
              .map(entry => new URL(entry.url).searchParams.get('q'))
              .filter(Boolean) as string[]
          )
        ]);

        setInsights(historyInsights);
        setSearchPatterns(searchInsights);
      } catch (err) {
        console.error('Error analyzing history:', err);
        setError(err instanceof Error ? err.message : 'Failed to analyze history');
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, [historyEntries]);

  return { insights, searchPatterns, loading, error };
}