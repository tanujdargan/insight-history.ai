// services/rankingService.ts

import { HistoryEntry } from '../types';

export async function rankSearchResults(query: string, results: HistoryEntry[]): Promise<HistoryEntry[]> {
  if (chrome.ml && chrome.ml.generateText) {
    try {
      const prompt = `Given the search query "${query}", rank the following URLs based on their relevance.

Entries:
${results
  .map(
    (entry, index) => `${index + 1}. Title: ${entry.title}\nURL: ${entry.url}\nLast Visit: ${entry.lastVisit}`
  )
  .join('\n')}

Provide the rankings as a list of entry numbers in descending order of relevance, like "3, 1, 2".

If you can't determine a ranking, just list the entries in any order.

`;

      // @ts-ignore
      const response = await chrome.ml.generateText({
        prompt,
        temperature: 0.3,
        maxOutputTokens: 50,
      });

      const rankingIndices = response.text.match(/\d+/g)?.map(Number).map((i) => i - 1);
      if (rankingIndices) {
        return rankingIndices.map((index) => results[index]).filter(Boolean);
      }
    } catch (error) {
      console.error('Error ranking results:', error);
    }
  }
  return results;
}