import { HistoryEntry } from '../types';
import { extractDomain } from '../utils/url/parsers';

export async function fetchBrowserHistory(): Promise<HistoryEntry[]> {
  try {
    // Get history directly from Chrome API
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return new Promise((resolve, reject) => {
      if (!chrome.history) {
        reject(new Error('Chrome history API not available'));
        return;
      }

      chrome.history.search({
        text: '',
        startTime: oneWeekAgo.getTime(),
        maxResults: 1000
      }, (items) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        const entries = items
          .filter((item): item is Required<chrome.history.HistoryItem> => 
            Boolean(item.url && item.lastVisitTime))
          .map(item => ({
            url: item.url,
            title: item.title || extractDomain(item.url),
            visitCount: item.visitCount || 1,
            lastVisit: new Date(item.lastVisitTime)
          }));

        resolve(entries);
      });
    });
  } catch (error) {
    console.error('Error fetching browser history:', error);
    throw error;
  }
}