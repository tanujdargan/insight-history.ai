import { HistoryEntry } from '../types';
import { Recommendation } from '../hooks/useRecommendations';

export async function mockAnalyzeHistory(historyEntries: HistoryEntry[]): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const domains = new Set(historyEntries.map(entry => new URL(entry.url).hostname));
  const totalVisits = historyEntries.reduce((sum, entry) => sum + entry.visitCount, 0);
  const topDomains = Array.from(domains).slice(0, 3).join(', ');
  
  return `Based on your browsing history, you've visited ${domains.size} unique domains with a total of ${totalVisits} visits. Your most frequently visited sites include ${topDomains}. There appears to be a focus on development-related content, particularly around web technologies.`;
}

export async function mockRoastHistory(historyEntries: HistoryEntry[]): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const domains = new Set(historyEntries.map(entry => new URL(entry.url).hostname));
  const topSites = historyEntries
    .sort((a, b) => b.visitCount - a.visitCount)
    .slice(0, 3);

  const roasts = [
    `I see you've spent quite some quality time on ${topSites[0]?.title || 'various websites'}. 
    Is this what they call "research" these days? 😉`,
    
    `${domains.size} different websites? Someone's got commitment issues! 
    But hey, at least you're consistent with your ${topSites[0]?.visitCount || 'many'} visits to ${topSites[0]?.title || 'your favorite site'}.`,
    
    `Your browser history is like a digital diary of procrastination. 
    I particularly enjoy your ${topSites[0]?.visitCount || 'numerous'} visits to ${topSites[0]?.title || 'that one site'}. 
    No judgment here... well, maybe a little! 😄`,
    
    `Let's talk about those 3 AM visits to ${topSites[0]?.title || 'various sites'}. 
    I won't tell if you won't! Your secret's safe with me... and your browser history. 🤫`
  ];

  return roasts[Math.floor(Math.random() * roasts.length)];
}

export async function mockGetRecommendations(historyEntries: HistoryEntry[]): Promise<Recommendation[]> {
  await new Promise(resolve => setTimeout(resolve, 800));

  // Sort by visit count and recency
  const sortedEntries = historyEntries
    .sort((a, b) => {
      const scoreA = a.visitCount * (1 / ((Date.now() - a.lastVisit.getTime()) / 86400000));
      const scoreB = b.visitCount * (1 / ((Date.now() - b.lastVisit.getTime()) / 86400000));
      return scoreB - scoreA;
    })
    .slice(0, 4);

  return sortedEntries.map(entry => ({
    title: entry.title,
    url: entry.url,
    reason: entry.visitCount > 1 
      ? `You've visited this page ${entry.visitCount} times. Might be worth bookmarking!`
      : `This seems like an important resource based on your recent browsing.`
  }));
}