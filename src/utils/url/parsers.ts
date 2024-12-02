import { isValidUrl, ensureProtocol } from './validators';

export function parseUrl(urlString: string): URL | null {
  if (!urlString) return null;
  
  try {
    // Handle chrome:// URLs
    if (urlString.startsWith('chrome://')) {
      return new URL(urlString);
    }

    const urlWithProtocol = ensureProtocol(urlString);
    if (!isValidUrl(urlWithProtocol)) return null;
    return new URL(urlWithProtocol);
  } catch {
    return null;
  }
}

export function extractDomain(urlString: string): string {
  try {
    const url = parseUrl(urlString);
    if (!url) return 'unknown';
    
    // Handle chrome:// URLs
    if (url.protocol === 'chrome:') {
      return `${url.protocol}//${url.hostname}`;
    }
    
    return url.hostname || 'unknown';
  } catch {
    return 'unknown';
  }
}

export function extractSearchQuery(urlString: string): string | null {
  try {
    const url = parseUrl(urlString);
    if (!url) return null;

    const searchEngines = {
      'google.com': 'q',
      'bing.com': 'q',
      'duckduckgo.com': 'q',
      'yahoo.com': 'p'
    };

    for (const [domain, param] of Object.entries(searchEngines)) {
      if (url.hostname.includes(domain)) {
        const query = url.searchParams.get(param);
        return query ? decodeURIComponent(query) : null;
      }
    }

    return null;
  } catch {
    return null;
  }
}