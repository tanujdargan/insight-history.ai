// background.ts

import { HistoryEntry } from './types';

chrome.runtime.onInstalled.addListener(() => {
  console.log('AI History Search Extension installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const handleAsyncResponse = async () => {
    try {
      switch (request.type) {
        case 'GET_HISTORY': {
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

          const historyItems = await new Promise<chrome.history.HistoryItem[]>((resolve) => {
            chrome.history.search(
              {
                text: '',
                startTime: oneMonthAgo.getTime(),
                maxResults: 10000,
              },
              resolve
            );
          });

          const historyEntries: HistoryEntry[] = historyItems.map((item) => ({
            url: item.url || '',
            title: item.title || '',
            visitCount: item.visitCount || 0,
            lastVisit: item.lastVisitTime ? new Date(item.lastVisitTime) : new Date(),
          }));

          return { success: true, data: historyEntries };
        }

        case 'ANALYZE_SEARCH': {
          if (chrome.ml && chrome.ml.generateText) {
            try {
              const result = await chrome.ml.generateText({
                prompt: `Optimize the following search query to better match your browsing history:\n\n"${request.query}"\n\nFocus on extracting relevant keywords and phrases.`,
                temperature: 0.5,
                maxOutputTokens: 20,
              });
              const optimizedQuery = result.text.trim();
              return { success: true, data: optimizedQuery };
            } catch (error) {
              console.error('AI analysis failed:', error);
              return { success: true, data: request.query };
            }
          }
          return { success: true, data: request.query };
        }

        default:
          return { success: false, error: 'Unknown message type' };
      }
    } catch (error) {
      console.error('Error handling message:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  handleAsyncResponse().then(sendResponse);
  return true;
});