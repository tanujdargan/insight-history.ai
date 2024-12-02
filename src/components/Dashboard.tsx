import React from 'react';
import { BarChart3, Search, Globe2 } from 'lucide-react';
import TopSites from './TopSites';
import SearchInsights from './SearchInsights';
import AIInsights from './AIInsights';
import RecentInsights from './RecentInsights';
import { HistoryEntry } from '../types';

interface DashboardProps {
  historyEntries: HistoryEntry[];
}

function Dashboard({ historyEntries }: DashboardProps) {
  const uniqueSites = new Set(historyEntries.map(entry => new URL(entry.url).hostname)).size;
  const totalSearches = historyEntries.filter(entry => 
    entry.url.includes('google.com/search') || 
    entry.url.includes('bing.com/search')
  ).length;
  const activeDays = new Set(
    historyEntries.map(entry => entry.lastVisit.toISOString().split('T')[0])
  ).size;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">History Analytics</h1>
        <p className="text-gray-600 mt-2">Discover AI-powered insights from your browsing history</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          icon={<Globe2 className="w-6 h-6" />}
          title="Unique Sites"
          value={uniqueSites.toString()}
        />
        <StatsCard
          icon={<Search className="w-6 h-6" />}
          title="Total Searches"
          value={totalSearches.toString()}
        />
        <StatsCard
          icon={<BarChart3 className="w-6 h-6" />}
          title="Active Days"
          value={activeDays.toString()}
        />
      </div>

      <RecentInsights />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
        <TopSites historyEntries={historyEntries} />
        <SearchInsights historyEntries={historyEntries} />
      </div>

      <AIInsights historyEntries={historyEntries} />
    </div>
  );
}

function StatsCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-2xl font-bold text-blue-600">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;