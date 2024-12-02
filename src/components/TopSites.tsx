import React, { useMemo } from 'react';
import { Globe } from 'lucide-react';
import { HistoryEntry } from '../types';
import { extractDomain } from '../utils/url/parsers';

interface TopSitesProps {
  historyEntries: HistoryEntry[];
}

export default function TopSites({ historyEntries }: TopSitesProps) {
  const topSites = useMemo(() => {
    const sites = historyEntries.reduce((acc, entry) => {
      const domain = extractDomain(entry.url);
      if (domain !== 'unknown') {
        acc[domain] = (acc[domain] || 0) + entry.visitCount;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sites)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([domain, visits]) => ({ domain, visits }));
  }, [historyEntries]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Globe className="w-5 h-5" />
        Most Visited Sites
      </h2>
      <div className="space-y-4">
        {topSites.map((site, index) => (
          <div key={site.domain} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
              <span className="font-medium text-gray-900">{site.domain}</span>
            </div>
            <span className="text-sm text-gray-600">{site.visits} visits</span>
          </div>
        ))}
      </div>
    </div>
  );
}