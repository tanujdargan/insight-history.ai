export interface HistoryEntry {
  url: string;
  title: string;
  visitCount: number;
  lastVisit: Date;
}

export interface TopSite {
  domain: string;
  visits: number;
}

export interface SearchAnalytics {
  query: string;
  frequency: number;
  lastSearched: Date;
}