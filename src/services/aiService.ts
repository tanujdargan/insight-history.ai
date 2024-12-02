import { HistoryEntry } from '../types';
import { mockAnalyzeHistory, mockRoastHistory, mockGetRecommendations } from './mockAiService';

export async function analyzeHistoryForRoast(historyEntries: HistoryEntry[]): Promise<string> {
  try {
    // For now, we'll use mock data since Chrome AI API isn't available
    return await mockRoastHistory(historyEntries);
  } catch (error) {
    console.error('Error generating roast:', error);
    throw error;
  }
}

export async function getRecentRecommendations(historyEntries: HistoryEntry[]) {
  try {
    const recentEntries = historyEntries
      .filter(entry => {
        const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return entry.lastVisit > hourAgo;
      })
      .slice(0, 10);

    return await mockGetRecommendations(recentEntries);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw error;
  }
}

export async function analyzeHistory(historyEntries: HistoryEntry[]): Promise<string> {
  try {
    return await mockAnalyzeHistory(historyEntries);
  } catch (error) {
    console.error('Error analyzing history:', error);
    throw error;
  }
}