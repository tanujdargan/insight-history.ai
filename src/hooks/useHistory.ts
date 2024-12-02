import { useState, useEffect } from 'react';
import { HistoryEntry } from '../types';
import { fetchBrowserHistory } from '../services/historyService';

export function useHistory() {
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await fetchBrowserHistory();
        setHistoryEntries(history);
      } catch (err) {
        console.error('Error loading history:', err);
        setError(err instanceof Error ? err.message : 'Failed to load history');
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  return { historyEntries, loading, error };
}