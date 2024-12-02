import { WebSocketConnection } from '../utils/websocket';
import { isValidWebSocketUrl } from '../utils/url/validators';

export class WebSocketService {
  private static instance: WebSocketService;
  private connection: WebSocketConnection | null = null;

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  connect(url: string): void {
    if (!isValidWebSocketUrl(url)) {
      console.error('Invalid WebSocket URL:', url);
      return;
    }

    this.connection = new WebSocketConnection({
      url,
      onOpen: () => console.log('WebSocket connected'),
      onError: (error) => console.error('WebSocket error:', error),
      onClose: () => console.log('WebSocket closed'),
      onMessage: (data) => console.log('WebSocket message:', data)
    });

    this.connection.connect();
  }

  disconnect(): void {
    this.connection?.disconnect();
    this.connection = null;
  }

  send(data: any): void {
    this.connection?.send(data);
  }
}