// services/searchService.ts

import { HistoryEntry } from '../types';
import { extractKeywords } from './historyService';
import { parseDate } from 'chrono-node';

interface ParsedQuery {
  keywords: string[];
  startDate?: Date;
  endDate?: Date;
  contentType?: string;
}

export async function parseUserQuery(query: string): Promise<ParsedQuery> {
  if (chrome.ml && chrome.ml.generateText) {
    try {
      const prompt = `Extract the following information from the user's query:

Query: "${query}"

Extracted Information:
- Keywords: A list of important keywords.
- Start Date: The start date if specified (e.g., "last week").
- End Date: The end date if specified.
- Content Type: The type of content if specified (e.g., "videos", "articles").

Provide the extracted information in JSON format like this:
{
  "keywords": ["keyword1", "keyword2"],
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "contentType": "content_type"
}

If a piece of information is not specified in the query, omit it from the JSON.

`;

      // @ts-ignore
      const response = await chrome.ml.generateText({
        prompt,
        temperature: 0.2,
        maxOutputTokens: 150,
      });

      const jsonText = response.text.trim();

      // Handle cases where the AI might return extra text before the JSON
      const jsonStartIndex = jsonText.indexOf('{');
      const jsonEndIndex = jsonText.lastIndexOf('}') + 1;
      const jsonSubstring = jsonText.substring(jsonStartIndex, jsonEndIndex);

      const parsed = JSON.parse(jsonSubstring);

      const parsedQuery: ParsedQuery = {
        keywords: parsed.keywords || [],
        contentType: parsed.contentType,
      };

      if (parsed.startDate) {
        const date = parseDate(parsed.startDate);
        parsedQuery.startDate = date || new Date(parsed.startDate);
      }
      if (parsed.endDate) {
        const date = parseDate(parsed.endDate);
        parsedQuery.endDate = date || new Date(parsed.endDate);
      }

      return parsedQuery;
    } catch (error) {
      console.error('Error parsing user query:', error);
    }
  }

  // Fallback to simple keyword extraction
  return {
    keywords: extractKeywords(query),
  };
}

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
        return (
          url.includes('youtube.com/watch') ||
          url.includes('vimeo.com') ||
          url.includes('dailymotion.com') ||
          url.includes('video')
        );
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

export async function rankSearchResults(query: string, results: HistoryEntry[]): Promise<HistoryEntry[]> {
  if (chrome.ml && chrome.ml.generateText) {
    try {
      const prompt = `Given the search query "${query}", rank the following entries based on their relevance.

Entries:
${results
  .map(
    (entry, index) => `${index + 1}. Title: ${entry.title}\nURL: ${entry.url}\nLast Visit: ${entry.lastVisit}`
  )
  .join('\n\n')}

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
        const rankedResults = rankingIndices
          .map((index) => results[index])
          .filter((entry): entry is HistoryEntry => entry !== undefined);

        return rankedResults;
      }
    } catch (error) {
      console.error('Error ranking results:', error);
    }
  }
  return results;
}

export async function searchAndRankHistory(query: string, allEntries: HistoryEntry[]): Promise<HistoryEntry[]> {
  const parsedQuery = await parseUserQuery(query);
  const filteredEntries = searchHistoryEntries(parsedQuery, allEntries);
  const rankedResults = await rankSearchResults(query, filteredEntries);
  return rankedResults;
}

export async function searchHistory(
  query: string,
  historyEntries: HistoryEntry[],
  analyze: boolean
): Promise<HistoryEntry[]> {
  const parsedQuery = await parseUserQuery(query);
  let results = searchHistoryEntries(parsedQuery, historyEntries);

  // Sort results by visit count and last visit time
  results.sort((a, b) => {
    if (a.visitCount !== b.visitCount) {
      return b.visitCount - a.visitCount;
    }
    if (a.lastVisit && b.lastVisit) {
      return b.lastVisit.getTime() - a.lastVisit.getTime();
    }
    return 0;
  });

  return results;
}