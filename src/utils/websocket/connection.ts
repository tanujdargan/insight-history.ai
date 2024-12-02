import { WebSocketError, WebSocketErrorCodes } from './errors';
import type { WebSocketConfig, WebSocketMessage } from './types';

const DEFAULT_CONFIG = {
  reconnectAttempts: 3,
  reconnectDelay: 1000,
};

export class WebSocketConnection {
  private ws: WebSocket | null = null;
  private config: Required<WebSocketConfig>;
  private reconnectAttempts = 0;
  private reconnectTimeout?: NodeJS.Timeout;

  constructor(config: WebSocketConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  connect(): void {
    try {
      this.ws = new WebSocket(this.config.url);
      this.setupEventHandlers();
    } catch (error) {
      this.handleError(
        new WebSocketError(
          'Failed to create WebSocket connection',
          WebSocketErrorCodes.CONNECTION_FAILED,
          error instanceof Error ? error : undefined
        )
      );
    }
  }

  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.config.onOpen?.();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WebSocketMessage;
        this.config.onMessage?.(data);
      } catch (error) {
        this.handleError(
          new WebSocketError(
            'Failed to parse WebSocket message',
            WebSocketErrorCodes.MESSAGE_PARSE_ERROR,
            error instanceof Error ? error : undefined
          )
        );
      }
    };

    this.ws.onerror = (error) => {
      this.handleError(
        new WebSocketError(
          'WebSocket error occurred',
          WebSocketErrorCodes.CONNECTION_FAILED,
          error instanceof Error ? error : undefined
        )
      );
    };

    this.ws.onclose = () => {
      this.handleClose();
    };
  }

  private handleError(error: WebSocketError): void {
    console.error('[WebSocket]', error.message, error);
    this.config.onError?.(error);
  }

  private handleClose(): void {
    this.config.onClose?.();
    this.attemptReconnect();
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.config.reconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.config.reconnectDelay * this.reconnectAttempts;
      
      this.reconnectTimeout = setTimeout(() => {
        console.log(`[WebSocket] Reconnect attempt ${this.reconnectAttempts}`);
        this.connect();
      }, delay);
    }
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data: unknown): void {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.warn('[WebSocket] Cannot send message: connection not open');
      return;
    }

    try {
      this.ws.send(JSON.stringify(data));
    } catch (error) {
      this.handleError(
        new WebSocketError(
          'Failed to send WebSocket message',
          WebSocketErrorCodes.SEND_FAILED,
          error instanceof Error ? error : undefined
        )
      );
    }
  }
}