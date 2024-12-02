export class WebSocketError extends Error {
  constructor(
    message: string,
    public readonly code: number,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'WebSocketError';
  }
}

export const WebSocketErrorCodes = {
  INVALID_URL: 1000,
  CONNECTION_FAILED: 1001,
  MESSAGE_PARSE_ERROR: 1002,
  SEND_FAILED: 1003,
} as const;