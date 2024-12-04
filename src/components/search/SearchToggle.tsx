import React from 'react';
import { Toggle } from 'lucide-react';
import { useProductivityStore } from '../../store/productivityStore';
import { cn } from '../../utils/cn';

export default function SearchToggle() {
  const { settings, toggleNaturalLanguageSearch } = useProductivityStore();

  return (
    <div className="flex items-center justify-end space-x-2 mb-4">
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Natural Language Search
      </span>
      <button
        onClick={toggleNaturalLanguageSearch}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full",
          settings.naturalLanguageSearch
            ? "bg-blue-600"
            : "bg-gray-200 dark:bg-gray-700"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition",
            settings.naturalLanguageSearch ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}