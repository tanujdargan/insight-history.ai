import React from 'react';
import { BarChart3, Search, Globe2 } from 'lucide-react';
import { HistoryEntry } from '../types';
import { getDomainFromUrl } from '../utils/url';

interface PopupViewProps {
  historyEntries: HistoryEntry[];
}

function PopupView({ historyEntries }: PopupViewProps) {
  const uniqueSites = new Set(
    historyEntries
      .map(entry => getDomainFromUrl(entry.url))
      .filter(domain => domain !== 'unknown')
  ).size;

  const totalSearches = historyEntries.filter(entry => 
    entry.url.includes('google.com/search') || 
    entry.url.includes('bing.com/search')
  ).length;

  const activeDays = new Set(
    historyEntries.map(entry => entry.lastVisit.toISOString().split('T')[0])
  ).size;

  return (
    <div className="w-96 p-4 bg-white">
      <h1 className="text-xl font-bold mb-4">History Analytics</h1>
      
      <div className="grid grid-cols-1 gap-4">
        <StatsCard
          icon={<Globe2 className="w-5 h-5" />}
          title="Unique Sites"
          value={uniqueSites.toString()}
        />
        <StatsCard
          icon={<Search className="w-5 h-5" />}
          title="Total Searches"
          value={totalSearches.toString()}
        />
        <StatsCard
          icon={<BarChart3 className="w-5 h-5" />}
          title="Active Days"
          value={activeDays.toString()}
        />
      </div>

      <button 
        onClick={() => chrome.tabs.create({ url: 'chrome://history' })}
        className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        View Full History
      </button>
    </div>
  );
}

function StatsCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          {icon}
        </div>
        <span className="font-medium text-gray-900">{title}</span>
      </div>
      <span className="text-lg font-bold text-blue-600">{value}</span>
    </div>
  );
}

export default PopupView;