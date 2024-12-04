// App.tsx

import React from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import NavBar from './components/navigation/NavBar';
import Dashboard from './components/Dashboard';
import ProductivityDashboard from './pages/ProductivityDashboard';
import AchievementsPage from './pages/AchievementsPage';
import AISearchPage from './pages/AISearchPage';
import DetailedHistoryPage from './pages/DetailedHistoryPage';
import ErrorBoundary from './components/ErrorBoundary';
import { useTheme } from './hooks/useTheme';
import { useHistory } from './hooks/useHistory';
import { cn } from './utils/cn';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  useTheme();
  const { historyEntries, loading, error } = useHistory();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <Router>
      <div
        className={cn(
          'min-h-screen bg-gray-50 dark:bg-gray-900',
          'transition-colors duration-200'
        )}
      >
        <ErrorBoundary>
          <NavBar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Navigate to="/analytics" replace />} />
              <Route
                path="/analytics"
                element={
                  <PageWrapper>
                    <Dashboard historyEntries={historyEntries} />
                  </PageWrapper>
                }
              />
              <Route
                path="/productivity"
                element={
                  <PageWrapper>
                    <ProductivityDashboard />
                  </PageWrapper>
                }
              />
              <Route
                path="/achievements"
                element={
                  <PageWrapper>
                    <AchievementsPage />
                  </PageWrapper>
                }
              />
              <Route
                path="/ai-search"
                element={
                  <PageWrapper>
                    <AISearchPage />
                  </PageWrapper>
                }
              />
              <Route
                path="/detailed-history"
                element={
                  <PageWrapper>
                    <DetailedHistoryPage />
                  </PageWrapper>
                }
              />
              <Route path="*" element={<Navigate to="/analytics" replace />} />
            </Routes>
          </main>
        </ErrorBoundary>
      </div>
    </Router>
  );
}