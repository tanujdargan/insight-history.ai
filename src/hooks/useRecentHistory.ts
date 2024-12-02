import { useState, useEffect } from 'react';
import { HistoryEntry } from '../types';

interface RecentHistoryResponse {
  success: boolean;
  data: chrome.history.HistoryItem[];
  insights: string | null;
}

export function useRecentHistory() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentHistory, setRecentHistory] = useState<HistoryEntry[]>([]);
  const [insights, setInsights] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecentHistory() {
      try {
        const response = await chrome.runtime.sendMessage<any, RecentHistoryResponse>({ 
          type: 'GET_RECENT_HISTORY' 
        });

        if (response.success) {
          setRecentHistory(response.data.map(item => ({
            url: item.url || '',
            title: item.title || '',
            visitCount: item.visitCount || 0,
            lastVisit: new Date(item.lastVisitTime || Date.now())
          })));
          setInsights(response.insights);
        } else {
          throw new Error('Failed to fetch recent history');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching recent history:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentHistory();
  }, []);

  return { recentHistory, insights, loading, error };
}