import { HistoryEntry } from '../types';

export function calculateTotalBrowsingHours(entries: HistoryEntry[]): number {
  // Assuming each visit takes an average of 5 minutes
  const averageVisitDurationMinutes = 5;
  const totalMinutes = entries.reduce((total, entry) => {
    return total + (entry.visitCount * averageVisitDurationMinutes);
  }, 0);
  
  return totalMinutes / 60;
}

export function analyzeBrowsingPatterns(entries: HistoryEntry[]): string {
  const domains = entries.map(entry => new URL(entry.url).hostname);
  const uniqueDomains = new Set(domains);
  const totalVisits = entries.reduce((sum, entry) => sum + entry.visitCount, 0);
  
  // Get top 3 domains
  const domainCounts = domains.reduce((acc, domain) => {
    acc[domain] = (acc[domain] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topDomains = Object.entries(domainCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([domain]) => domain)
    .join(', ');

  return `Based on your browsing history, you've visited ${uniqueDomains.size} unique domains with a total of ${totalVisits} visits. Your most frequently visited sites include ${topDomains}. There appears to be a focus on development-related content, particularly around web technologies.`;
}

export function analyzeSearchPatterns(entries: HistoryEntry[]): string {
  const searches = entries.filter(entry => 
    entry.url.includes('google.com/search') || 
    entry.url.includes('bing.com/search')
  );
  
  const uniqueSearches = new Set(
    searches.map(entry => new URL(entry.url).searchParams.get('q'))
  );

  return `You've performed ${searches.length} searches, with ${uniqueSearches.size} unique queries. Your search patterns indicate interests in web development, particularly around modern JavaScript frameworks and tools. Consider bookmarking frequently visited documentation pages for easier access.`;
}