import React from 'react';
import { BarChart3, Search, Globe2, Clock } from 'lucide-react';
import TopSites from './TopSites';
import SearchInsights from './SearchInsights';
import AIInsights from './AIInsights';
import BrowsingAnalytics from './BrowsingAnalytics';
import RoastMeButton from './RoastMeButton';
import { HistoryEntry } from '../types';
import { calculateTotalBrowsingHours } from '../utils/analytics';

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
  const totalHours = calculateTotalBrowsingHours(historyEntries);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">History Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Discover insights from your browsing history</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
        <StatsCard
          icon={<Clock className="w-6 h-6" />}
          title="Total Hours"
          value={`${totalHours.toFixed(1)}h`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <AIInsights />
        <BrowsingAnalytics historyEntries={historyEntries} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
        <TopSites historyEntries={historyEntries} />
        <SearchInsights historyEntries={historyEntries} />
      </div>

      <RoastMeButton />
    </div>
  );
}

function StatsCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;