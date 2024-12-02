import React, { useState } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import { cn } from '../utils/cn';
import { HistoryEntry } from '../types';
import { formatDistanceToNow } from '../utils/date';

interface SearchBarProps {
  onSearch: (query: string) => void;
  results: HistoryEntry[];
}

export default function SearchBar({ onSearch, results }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (newQuery) {
      onSearch(newQuery);
      setShowResults(true);
    } else {
      onSearch(''); // Reset search when query is empty
      setShowResults(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search your history..."
          className={cn(
            "w-full px-4 py-3 pl-12 rounded-lg",
            "bg-white dark:bg-gray-800",
            "border border-gray-200 dark:border-gray-700",
            "focus:outline-none focus:ring-2 focus:ring-blue-500",
            "text-gray-900 dark:text-gray-100"
          )}
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>

      {showResults && query && (
        <div className={cn(
          "absolute w-full mt-2 rounded-lg",
          "bg-white dark:bg-gray-800",
          "border border-gray-200 dark:border-gray-700",
          "shadow-lg",
          "z-50"
        )}>
          {results.slice(0, 5).map((result, index) => (
            <a
              key={`${result.url}-${index}`}
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-start justify-between p-4",
                "hover:bg-gray-50 dark:hover:bg-gray-700/50",
                "group",
                index !== results.length - 1 && "border-b border-gray-200 dark:border-gray-700"
              )}
            >
              <div className="flex-grow pr-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600">
                  {result.title}
                </h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(result.lastVisit)} ago
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
            </a>
          ))}
          {results.length === 0 && (
            <div className="p-4 text-gray-500 dark:text-gray-400 text-center">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}