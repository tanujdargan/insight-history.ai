import { HistoryEntry } from '../types';
import { sendMessageWithTimeout } from './messageService';

export async function searchHistory(
  query: string,
  entries: HistoryEntry[],
  useNaturalLanguage: boolean
): Promise<HistoryEntry[]> {
  if (!query) return [];

  try {
    let searchQuery = query;
    
    if (useNaturalLanguage) {
      const response = await sendMessageWithTimeout<string>({
        type: 'ANALYZE_SEARCH',
        query
      });

      if (response.success && response.data) {
        searchQuery = response.data;
      }
    }

    return filterEntriesByQuery(entries, searchQuery);
  } catch (error) {
    console.error('Search failed:', error);
    return filterEntriesByQuery(entries, query);
  }
}

function filterEntriesByQuery(entries: HistoryEntry[], query: string): HistoryEntry[] {
  const normalizedQuery = query.toLowerCase();
  const keywords = normalizedQuery.split(/\s+/).filter(Boolean);
  
  return entries
    .map(entry => {
      const titleMatches = keywords.filter(keyword => 
        entry.title.toLowerCase().includes(keyword)
      ).length;
      
      const urlMatches = keywords.filter(keyword => 
        entry.url.toLowerCase().includes(keyword)
      ).length;
      
      const score = (titleMatches * 2) + urlMatches;
      
      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.entry.lastVisit.getTime() - a.entry.lastVisit.getTime())
    .map(({ entry }) => entry);
}