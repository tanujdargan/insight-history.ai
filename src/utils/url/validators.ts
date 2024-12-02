import { VALID_PROTOCOLS, PROTOCOL_PREFIXES, DEFAULT_PROTOCOL } from './constants';

export function isValidUrl(urlString: string): boolean {
  if (!urlString?.trim()) return false;
  
  try {
    const url = new URL(urlString);
    return Object.values(VALID_PROTOCOLS).includes(url.protocol as any);
  } catch {
    return false;
  }
}

export function ensureProtocol(urlString: string, defaultProtocol = DEFAULT_PROTOCOL): string {
  if (!urlString?.trim()) return '';
  
  const hasProtocol = Object.values(PROTOCOL_PREFIXES)
    .some(prefix => urlString.toLowerCase().startsWith(prefix));
  
  return hasProtocol ? urlString : `${defaultProtocol}${urlString}`;
}

export function isValidWebSocketUrl(urlString: string): boolean {
  if (!urlString?.trim()) return false;
  
  try {
    const url = new URL(urlString);
    return url.protocol === VALID_PROTOCOLS.WS || url.protocol === VALID_PROTOCOLS.WSS;
  } catch {
    return false;
  }
}