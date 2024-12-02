export const VALID_PROTOCOLS = {
  HTTP: 'http:',
  HTTPS: 'https:',
  WS: 'ws:',
  WSS: 'wss:'
} as const;

export const PROTOCOL_PREFIXES = {
  HTTP: 'http://',
  HTTPS: 'https://',
  WS: 'ws://',
  WSS: 'wss://'
} as const;

export const DEFAULT_PROTOCOL = PROTOCOL_PREFIXES.HTTPS;