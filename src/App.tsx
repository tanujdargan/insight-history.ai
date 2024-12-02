import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import PopupView from './components/PopupView';
import { HistoryEntry } from './types';
import { fetchBrowserHistory } from './services/historyService';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import ThemeToggle from './components/ThemeToggle';
import SearchBar from './components/SearchBar';
import DetailedHistory from './components/DetailedHistory';
import RoastMeButton from './components/RoastMeButton';
import AIInsights from './components/AIInsights';
import BrowsingAnalytics from './components/BrowsingAnalytics';
import { cn } from './utils/cn';

function App() {
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPopup, setIsPopup] = useState(false);
  const [showDetailedHistory, setShowDetailedHistory] = useState(false);

  React.useEffect(() => {
    setIsPopup(window.innerWidth < 800);

    async function loadHistory() {
      try {
        const history = await fetchBrowserHistory();
        setHistoryEntries(history);
        setFilteredEntries(history);
      } catch (error) {
        console.error('Error loading history:', error);
        setError(error instanceof Error ? error.message : 'Failed to load history');
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredEntries(historyEntries);
      return;
    }
    const filtered = historyEntries.filter(entry => 
      entry.title.toLowerCase().includes(query.toLowerCase()) ||
      entry.url.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEntries(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">Error Loading History</h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen bg-gray-50 dark:bg-gray-900",
      "transition-colors duration-200"
    )}>
      <ErrorBoundary>
        <ThemeToggle />
        
        {isPopup ? (
          <PopupView historyEntries={filteredEntries} />
        ) : (
          <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  History Analytics
                </h1>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDetailedHistory(!showDetailedHistory)}
                  className={cn(
                    "px-4 py-2 rounded-lg",
                    "bg-blue-600 hover:bg-blue-700",
                    "text-white font-medium",
                    "transition-colors duration-200"
                  )}
                >
                  {showDetailedHistory ? 'View Analytics' : 'View Detailed History'}
                </motion.button>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Discover insights from your browsing history
              </p>
            </header>

            <SearchBar onSearch={handleSearch} results={filteredEntries} />

            <AnimatePresence mode="wait">
              {showDetailedHistory ? (
                <motion.div
                  key="detailed"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <DetailedHistory entries={historyEntries} />
                </motion.div>
              ) : (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Dashboard historyEntries={historyEntries} />
                  <div className="mt-8 space-y-8">
                    <AIInsights />
                    <BrowsingAnalytics historyEntries={historyEntries} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <RoastMeButton />
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
}

export default App;