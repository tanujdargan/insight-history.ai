import { HistoryEntry } from '../types';

export async function mockAnalyzeHistory(historyEntries: HistoryEntry[]): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const domains = new Set(historyEntries.map(entry => new URL(entry.url).hostname));
  const totalVisits = historyEntries.reduce((sum, entry) => sum + entry.visitCount, 0);
  const topDomains = Array.from(domains).slice(0, 3).join(', ');
  
  return `Based on your browsing history, you've visited ${domains.size} unique domains with a total of ${totalVisits} visits. Your most frequently visited sites include ${topDomains}. There appears to be a focus on development-related content, particularly around web technologies.`;
}

export async function mockCategorizeSearches(searches: string[]): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const searchCount = searches.length;
  const uniqueSearches = new Set(searches).size;
  
  return `You've performed ${searchCount} searches, with ${uniqueSearches} unique queries. Your search patterns indicate interests in web development, particularly around modern JavaScript frameworks and tools. Consider bookmarking frequently visited documentation pages for easier access.`;
}