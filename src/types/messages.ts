export interface MessageResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SearchMessage {
  type: 'ANALYZE_SEARCH';
  query: string;
}

export interface HistoryMessage {
  type: 'GET_HISTORY';
}

export type Message = SearchMessage | HistoryMessage;