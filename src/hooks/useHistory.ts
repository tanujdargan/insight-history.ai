// hooks/useHistory.ts
import { useEffect, useState } from 'react';
import { HistoryEntry } from '../types'; // Use the correct path to your index.ts

export function useHistory() {
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'GET_HISTORY' }, (response) => {
      if (response?.success) {
        setHistoryEntries(response.data);
      } else {
        console.error('Failed to fetch history:', response?.error);
        setError(response?.error || 'Unknown error');
      }
      setLoading(false);
    });
  }, []);

  return { historyEntries, loading, error };
}