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
          if (chrome.ml && chrome.ml.generateText) {
            try {
              const sanitizedQuery = request.query.trim();
              const result = await chrome.ml.generateText({
                prompt: `You are an AI assistant that transforms natural language queries into optimized search terms for browsing history lookup.

                Examples:
                1. User Query: "Find the article about climate change I read last week."
                  Optimized Search: "climate change article last week"

                2. User Query: "Show me the recipes I looked up yesterday."
                  Optimized Search: "recipes from yesterday"

                Now, convert the following user query:

                User Query: "${sanitizedQuery}"
                Optimized Search:`,
                                temperature: 0.2,
                                maxTokens: 100,
                              });

              const optimizedQuery = result.text.trim();

              if (optimizedQuery) {
                return { success: true, data: optimizedQuery };
              } else {
                return { success: true, data: sanitizedQuery };
              }
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