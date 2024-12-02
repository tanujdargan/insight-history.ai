import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import PopupView from './components/PopupView';
import { HistoryEntry } from './types';
import { fetchBrowserHistory } from './services/historyService';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPopup, setIsPopup] = useState(false);

  useEffect(() => {
    setIsPopup(window.innerWidth < 800);

    async function loadHistory() {
      try {
        const history = await fetchBrowserHistory();
        setHistoryEntries(history);
      } catch (error) {
        console.error('Error loading history:', error);
        setError(error instanceof Error ? error.message : 'Failed to load history');
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

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
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading History</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary>
        {isPopup ? (
          <PopupView historyEntries={historyEntries} />
        ) : (
          <Dashboard historyEntries={historyEntries} />
        )}
      </ErrorBoundary>
    </div>
  );
}

export default App;