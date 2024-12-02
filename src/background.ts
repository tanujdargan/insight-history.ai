// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('History Analytics Extension installed');
});

// Handle messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_HISTORY') {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    chrome.history.search({
      text: '',
      startTime: oneWeekAgo.getTime(),
      maxResults: 1000
    }, (historyItems) => {
      sendResponse({
        success: true,
        data: historyItems
      });
    });
    return true; // Required for async response
  }

  if (request.type === 'GET_RECENT_HISTORY') {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    chrome.history.search({
      text: '',
      startTime: oneHourAgo.getTime(),
      maxResults: 100
    }, async (historyItems) => {
      try {
        // @ts-ignore - Chrome AI API
        const result = await chrome.runtime.invoke('generateText', {
          model: 'models/text-bison-001',
          prompt: `Analyze these recent browsing activities and suggest which ones might be important to revisit or bookmark: ${JSON.stringify(historyItems.map(item => ({ title: item.title, url: item.url })))}`,
          temperature: 0.7,
          candidateCount: 1,
        });

        sendResponse({
          success: true,
          data: historyItems,
          insights: result?.candidates?.[0]?.output || null
        });
      } catch (error) {
        sendResponse({
          success: true,
          data: historyItems,
          insights: null
        });
      }
    });
    return true;
  }
});