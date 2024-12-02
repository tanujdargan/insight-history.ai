export function tryParseUrl(urlString: string): URL | null {
  try {
    return new URL(urlString);
  } catch {
    return null;
  }
}

export function getDomainFromUrl(urlString: string): string {
  const url = tryParseUrl(urlString);
  return url?.hostname || 'unknown';
}

export function extractSearchQuery(urlString: string): string | null {
  const url = tryParseUrl(urlString);
  if (!url) return null;
  
  if (url.hostname.includes('google.com')) {
    return url.searchParams.get('q');
  }
  if (url.hostname.includes('bing.com')) {
    return url.searchParams.get('q');
  }
  return null;
}