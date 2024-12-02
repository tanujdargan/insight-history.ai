import { useState, useEffect, useCallback, useRef } from 'react';
import { WebSocketConnection } from '../utils/websocket/connection';
import { WebSocketError } from '../utils/websocket/errors';
import type { WebSocketStatus, WebSocketMessage } from '../utils/websocket/types';
import { isValidWebSocketUrl } from '../utils/url/validators';

interface UseWebSocketOptions {
  onMessage?: (data: unknown) => void;
  onError?: (error: WebSocketError) => void;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}

export function useWebSocket(url: string, options: UseWebSocketOptions = {}) {
  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const wsRef = useRef<WebSocketConnection | null>(null);

  useEffect(() => {
    if (!isValidWebSocketUrl(url)) {
      console.error('[useWebSocket] Invalid WebSocket URL:', url);
      return;
    }

    wsRef.current = new WebSocketConnection({
      url,
      onOpen: () => setStatus('connected'),
      onClose: () => setStatus('disconnected'),
      onError: (error) => {
        setStatus('error');
        options.onError?.(error);
      },
      onMessage: options.onMessage,
      reconnectAttempts: options.reconnectAttempts,
      reconnectDelay: options.reconnectDelay,
    });

    wsRef.current.connect();
    setStatus('connecting');

    return () => {
      wsRef.current?.disconnect();
      wsRef.current = null;
    };
  }, [url, options.onMessage, options.onError, options.reconnectAttempts, options.reconnectDelay]);

  const send = useCallback((data: unknown) => {
    wsRef.current?.send(data);
  }, []);

  return {
    status,
    send,
    isConnected: status === 'connected',
  };
}