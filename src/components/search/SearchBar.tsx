import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../utils/cn';
import { HistoryEntry } from '../../types';
import { useProductivityStore } from '../../store/productivityStore';
import { searchHistory } from '../../services/searchService';
import SearchResults from './SearchResults';
import LoadingSpinner from '../LoadingSpinner';

interface SearchBarProps {
  onSearch: (query: string) => void;
  results: HistoryEntry[];
}

export default function SearchBar({ onSearch, results }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<HistoryEntry[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { settings } = useProductivityStore();

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    if (settings.naturalLanguageSearch) {
      setIsSearching(true);
      try {
        const aiResults = await searchHistory(query, results, true);
        setSearchResults(aiResults);
        setShowResults(true);
      } catch (error) {
        console.error('AI search failed:', error);
      } finally {
        setIsSearching(false);
      }
    } else {
      const standardResults = await searchHistory(query, results, false);
      setSearchResults(standardResults);
      setShowResults(true);
    }
    
    onSearch(query);
  }, [query, results, settings.naturalLanguageSearch, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    if (!settings.naturalLanguageSearch) {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 relative">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={settings.naturalLanguageSearch ? 
            "Ask anything about your history..." : 
            "Search your history..."
          }
          className={cn(
            "w-full px-4 py-3 pl-12 rounded-lg",
            "bg-white dark:bg-gray-800",
            "border border-gray-200 dark:border-gray-700",
            "focus:outline-none focus:ring-2 focus:ring-blue-500",
            "text-gray-900 dark:text-gray-100"
          )}
        />
        {isSearching ? (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <LoadingSpinner size="sm" />
          </div>
        ) : (
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        )}
      </form>

      <SearchResults 
        results={searchResults}
        isVisible={showResults && !!query}
      />
    </div>
  );
}