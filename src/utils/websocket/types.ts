import { WebSocketError } from './errors';

export interface WebSocketConfig {
  url: string;
  onOpen?: () => void;
  onMessage?: (data: unknown) => void;
  onError?: (error: WebSocketError) => void;
  onClose?: () => void;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}

export interface WebSocketMessage<T = unknown> {
  type: string;
  payload: T;
}

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';