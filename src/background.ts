import { HistoryEntry } from './types';

let messagePort: chrome.runtime.Port | null = null;

chrome.runtime.onInstalled.addListener(() => {
  console.log('History Analytics Extension installed');
});

chrome.runtime.onConnect.addListener((port) => {
  messagePort = port;
  port.onDisconnect.addListener(() => {
    messagePort = null;
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const handleAsyncResponse = async () => {
    try {
      switch (request.type) {
        case 'GET_HISTORY': {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

          const historyItems = await new Promise<chrome.history.HistoryItem[]>((resolve) => {
            chrome.history.search({
              text: '',
              startTime: oneWeekAgo.getTime(),
              maxResults: 1000
            }, resolve);
          });

          return { success: true, data: historyItems };
        }

        case 'ANALYZE_SEARCH': {
          // @ts-ignore - Chrome AI API
          if (chrome.ml && chrome.ml.generateText) {
            try {
              // @ts-ignore
              const result = await chrome.ml.generateText({
                prompt: `Convert this natural language query into a search-optimized string: "${request.query}"`,
                temperature: 0.3,
              });
              return { success: true, data: result.text };
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
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  handleAsyncResponse().then(sendResponse);
  return true;
});