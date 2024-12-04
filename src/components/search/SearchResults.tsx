import React from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '../../utils/cn';
import { HistoryEntry } from '../../types';
import { formatDistanceToNow } from '../../utils/date';

interface SearchResultsProps {
  results: HistoryEntry[];
  isVisible: boolean;
}

export default function SearchResults({ results, isVisible }: SearchResultsProps) {
  if (!isVisible) return null;

  return (
    <div className={cn(
      "absolute w-full mt-2 rounded-lg",
      "bg-white dark:bg-gray-800",
      "border border-gray-200 dark:border-gray-700",
      "shadow-lg",
      "z-50"
    )}>
      {results.length > 0 ? (
        results.slice(0, 3).map((result, index) => (
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
        ))
      ) : (
        <div className="p-4 text-gray-500 dark:text-gray-400 text-center">
          No results found
        </div>
      )}
    </div>
  );
}