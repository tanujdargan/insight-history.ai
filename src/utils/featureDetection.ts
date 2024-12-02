export function isChromeAIAvailable(): boolean {
  try {
    return !!(
      typeof chrome !== 'undefined' &&
      chrome.runtime &&
      // @ts-ignore - Chrome AI API
      typeof chrome.runtime.invoke === 'function'
    );
  } catch {
    return false;
  }
}