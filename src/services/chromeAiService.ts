import { HistoryEntry } from '../types';

export async function chromeAnalyzeHistory(historyEntries: HistoryEntry[]): Promise<string> {
  const prompt = `Analyze these browsing history entries and provide insights: ${JSON.stringify(historyEntries)}`;
  
  // @ts-ignore - Chrome AI API is only available in Canary
  const result = await chrome.runtime.invoke('generateText', {
    model: 'models/text-bison-001',
    prompt: prompt,
    temperature: 0.7,
    candidateCount: 1,
  });

  return result.candidates[0].output;
}

export async function chromeCategorizeSearches(searches: string[]): Promise<string> {
  const prompt = `Categorize and find patterns in these searches: ${JSON.stringify(searches)}`;
  
  // @ts-ignore - Chrome AI API is only available in Canary
  const result = await chrome.runtime.invoke('generateText', {
    model: 'models/text-bison-001',
    prompt: prompt,
    temperature: 0.5,
    candidateCount: 1,
  });

  return result.candidates[0].output;
}