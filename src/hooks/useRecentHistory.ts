import { useState, useEffect } from 'react';
import { HistoryEntry } from '../types';
import { fetchBrowserHistory } from '../services/historyService';

export function useRecentHistory() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentHistory, setRecentHistory] = useState<HistoryEntry[]>([]);
  const [insights, setInsights] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchRecent() {
      try {
        const history = await fetchBrowserHistory();
        
        if (!mounted) return;

        // Get only recent entries (last 24 hours)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentEntries = history.filter(entry => entry.lastVisit > oneDayAgo);
        
        setRecentHistory(recentEntries);
        
        // Generate simple insights
        const domains = new Set(recentEntries.map(entry => new URL(entry.url).hostname));
        setInsights(`You've visited ${domains.size} different websites in the last 24 hours.`);
      } catch (err) {
        if (!mounted) return;
        console.error('Error fetching recent history:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchRecent();

    return () => {
      mounted = false;
    };
  }, []);

  return { recentHistory, insights, loading, error };
}