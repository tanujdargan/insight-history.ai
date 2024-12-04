// services/historyService.ts

import { HistoryEntry } from '../types';
import { ParsedQuery } from './searchService';
import natural from 'natural';

export function searchHistoryEntries(parsedQuery: ParsedQuery, allEntries: HistoryEntry[]): HistoryEntry[] {
  let results = allEntries;

  // Date Filtering
  if (parsedQuery.startDate || parsedQuery.endDate) {
    results = results.filter(entry => {
      const visitTime = entry.lastVisit.getTime();
      const startTime = parsedQuery.startDate ? parsedQuery.startDate.getTime() : -Infinity;
      const endTime = parsedQuery.endDate ? parsedQuery.endDate.getTime() : Infinity;
      return visitTime >= startTime && visitTime <= endTime;
    });
  }

  // Content Type Filtering
  if (parsedQuery.contentType) {
    const contentType = parsedQuery.contentType.toLowerCase();
    if (contentType === 'videos') {
      results = results.filter(entry => {
        const url = entry.url.toLowerCase();
        return url.includes('youtube.com/watch') || url.includes('vimeo.com') || url.includes('dailymotion.com');
      });
    }
    // Add more content types as needed
  }

  // Keyword Filtering
  if (parsedQuery.keywords && parsedQuery.keywords.length > 0) {
    const keywords = parsedQuery.keywords.map(k => k.toLowerCase());
    results = results.filter(entry => {
      const text = (entry.title + ' ' + entry.url).toLowerCase();
      return keywords.every(keyword => text.includes(keyword));
    });
  }

  return results;
}
export function extractKeywords(query: string): string[] {
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(query);
  // Implement additional NLP processing as needed
  return tokens;
}