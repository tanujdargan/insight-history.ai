import { HistoryEntry } from '../types';
import { extractDomain } from '../utils/url/parsers';

const MOCK_HISTORY: chrome.history.HistoryItem[] = [
  {
    id: '1',
    url: 'https://www.google.com/search?q=react+hooks',
    title: 'React Hooks - Google Search',
    lastVisitTime: Date.now() - 1000 * 60 * 5,
    visitCount: 3
  },
  {
    id: '2',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    title: 'JavaScript | MDN',
    lastVisitTime: Date.now() - 1000 * 60 * 10,
    visitCount: 5
  },
  {
    id: '3',
    url: 'https://github.com/facebook/react',
    title: 'facebook/react: A JavaScript library for building user interfaces',
    lastVisitTime: Date.now() - 1000 * 60 * 15,
    visitCount: 2
  }
];

export async function fetchBrowserHistory(): Promise<HistoryEntry[]> {
  try {
    // Check if we're running in a Chrome extension context
    const isExtension = typeof chrome !== 'undefined' && chrome.history;
    
    if (!isExtension) {
      console.log('Running in development mode with mock data');
      return MOCK_HISTORY.map(item => ({
        url: item.url!,
        title: item.title || extractDomain(item.url!),
        visitCount: item.visitCount || 1,
        lastVisit: new Date(item.lastVisitTime!)
      }));
    }

    const response = await new Promise<chrome.history.HistoryItem[]>((resolve, reject) => {
      chrome.runtime.sendMessage({ type: 'GET_HISTORY' }, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        if (!response?.success) {
          reject(new Error('Failed to fetch history'));
          return;
        }
        resolve(response.data);
      });
    });

    return response
      .filter((item): item is Required<chrome.history.HistoryItem> => 
        Boolean(item.url && item.lastVisitTime))
      .map(item => ({
        url: item.url,
        title: item.title || extractDomain(item.url),
        visitCount: item.visitCount || 1,
        lastVisit: new Date(item.lastVisitTime)
      }));
  } catch (error) {
    console.error('Error fetching browser history:', error);
    // Return mock data in development mode
    return MOCK_HISTORY.map(item => ({
      url: item.url!,
      title: item.title || extractDomain(item.url!),
      visitCount: item.visitCount || 1,
      lastVisit: new Date(item.lastVisitTime!)
    }));
  }
}