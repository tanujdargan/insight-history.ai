import { HistoryEntry } from '../types';

export async function chromeAnalyzeSearch(query: string): Promise<string> {
  try {
    // Use chrome.runtime.sendMessage instead of invoke
    const response = await new Promise<string>((resolve, reject) => {
      chrome.runtime.sendMessage({
        type: 'ANALYZE_SEARCH',
        query: query
      }, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        resolve(response.result);
      });
    });

    return response;
  } catch (error) {
    console.error('Chrome AI API error:', error);
    return query;
  }
}

export async function chromeAnalyzeHistory(historyEntries: HistoryEntry[]): Promise<string> {
  try {
    const response = await new Promise<string>((resolve, reject) => {
      chrome.runtime.sendMessage({
        type: 'ANALYZE_HISTORY',
        entries: historyEntries
      }, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        resolve(response.result);
      });
    });

    return response;
  } catch (error) {
    console.error('Chrome AI API error:', error);
    throw error;
  }
}