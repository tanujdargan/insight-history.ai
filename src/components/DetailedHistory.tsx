import { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { HistoryEntry } from '../types';
import { format } from 'date-fns';

interface DetailedHistoryProps {
  entries: HistoryEntry[];
}

export default function DetailedHistory({ entries }: DetailedHistoryProps) {
  // 1. Initialize local state for entries
  const [filteredEntries, setFilteredEntries] = useState<HistoryEntry[]>(entries);

  const [currentDate, setCurrentDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );

  // 2. Use filteredEntries instead of entries
  const groupedEntries = filteredEntries.reduce((acc, entry) => {
    const date = format(entry.lastVisit, 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, HistoryEntry[]>);

  const sortedDates = Object.keys(groupedEntries).sort((a, b) => b.localeCompare(a));
  const currentDateIndex = sortedDates.indexOf(currentDate);

  const goToPreviousDay = () => {
    const nextIndex = currentDateIndex + 1;
    if (nextIndex < sortedDates.length) {
      setCurrentDate(sortedDates[nextIndex]);
    }
  };

  const goToNextDay = () => {
    const nextIndex = currentDateIndex - 1;
    if (nextIndex >= 0) {
      setCurrentDate(sortedDates[nextIndex]);
    }
  };

  const currentDateEntries = (groupedEntries[currentDate] || [])
    .sort((a, b) => b.lastVisit.getTime() - a.lastVisit.getTime());

  // 3. Update handleDeleteEntry to remove entry from state
  const handleDeleteEntry = (url: string) => {
    // Remove the entry from the filteredEntries state
    setFilteredEntries((prevEntries) =>
      prevEntries.filter((entry) => entry.url !== url)
    );

    // Optional: Delete from browser history if applicable
    /*
    if (window.chrome && chrome.history && chrome.history.deleteUrl) {
      chrome.history.deleteUrl({ url }, () => {
        console.log(`Deleted from browser history: ${url}`);
      });
    }
    */
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToPreviousDay}
          disabled={currentDateIndex === sortedDates.length - 1}
          className={cn(
            "p-2 rounded-lg",
            "hover:bg-gray-100 dark:hover:bg-gray-700",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "text-gray-700 dark:text-gray-300"
          )}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {format(new Date(currentDate), 'EEEE, MMMM d, yyyy')}
        </h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToNextDay}
          disabled={currentDateIndex === 0}
          className={cn(
            "p-2 rounded-lg",
            "hover:bg-gray-100 dark:hover:bg-gray-700",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "text-gray-700 dark:text-gray-300"
          )}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentDate}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentDateEntries.length > 0 ? (
            <div className="space-y-2">
              {currentDateEntries.map((entry, index) => (
                <motion.div
                  key={`${entry.url}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.05 },
                  }}
                  onClick={() => window.open(entry.url, '_blank')}
                  className={cn(
                    'block p-4 rounded-lg',
                    'bg-white dark:bg-gray-800',
                    'hover:bg-gray-50 dark:hover:bg-gray-700/50',
                    'group',
                    'relative',
                    'cursor-pointer' // Add cursor pointer for hover effect
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {format(entry.lastVisit, 'HH:mm')}
                        </span>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600">
                          {entry.title}
                        </h4>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 break-all">
                        {entry.url}
                      </p>
                    </div>
                    <motion.div
                      whileHover={{ rotate: -45 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
                    </motion.div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEntry(entry.url);
                      }}
                      className="text-red-500 hover:text-red-700 relative z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              No history entries found for this date
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}