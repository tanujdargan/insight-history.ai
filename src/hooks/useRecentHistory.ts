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
    let mounted = true;

    async function fetchRecentHistory() {
      try {
        // Check if we're in extension context
        if (typeof chrome === 'undefined' || !chrome.runtime) {
          throw new Error('Not in extension context');
        }

        const response = await new Promise<RecentHistoryResponse>((resolve, reject) => {
          chrome.runtime.sendMessage({ type: 'GET_RECENT_HISTORY' }, (response) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
              return;
            }
            resolve(response);
          });
        });

        if (!mounted) return;

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
        if (!mounted) return;
        console.error('Error fetching recent history:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchRecentHistory();

    return () => {
      mounted = false;
    };
  }, []);

  return { recentHistory, insights, loading, error };
}