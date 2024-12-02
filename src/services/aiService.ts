import { HistoryEntry } from '../types';
import { isChromeAIAvailable } from '../utils/featureDetection';
import { mockAnalyzeHistory, mockCategorizeSearches } from './mockAiService';
import { chromeAnalyzeHistory, chromeCategorizeSearches } from './chromeAiService';

export async function analyzeHistory(historyEntries: HistoryEntry[]): Promise<string | null> {
  try {
    const isAIAvailable = isChromeAIAvailable();
    console.log(`Using ${isAIAvailable ? 'Chrome AI API' : 'Mock AI Service'} for history analysis`);
    
    if (isAIAvailable) {
      return await chromeAnalyzeHistory(historyEntries);
    }
    return await mockAnalyzeHistory(historyEntries);
  } catch (error) {
    console.error('Error analyzing history:', error);
    return null;
  }
}

export async function categorizeSearches(searches: string[]): Promise<string | null> {
  try {
    const isAIAvailable = isChromeAIAvailable();
    console.log(`Using ${isAIAvailable ? 'Chrome AI API' : 'Mock AI Service'} for search categorization`);
    
    if (isAIAvailable) {
      return await chromeCategorizeSearches(searches);
    }
    return await mockCategorizeSearches(searches);
  } catch (error) {
    console.error('Error categorizing searches:', error);
    return null;
  }
}