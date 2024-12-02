import { useState, useEffect } from 'react';
import { getRecentRecommendations } from '../services/aiService';
import { useHistory } from './useHistory';

export interface Recommendation {
  title: string;
  url: string;
  reason: string;
}

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { historyEntries } = useHistory();

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true);
        const recentRecs = await getRecentRecommendations(historyEntries);
        setRecommendations(recentRecs);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError(err instanceof Error ? err.message : 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [historyEntries]);

  return { recommendations, loading, error };
}