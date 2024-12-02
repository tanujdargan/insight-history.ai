import React from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';
import { cn } from '../utils/cn';
import { useRecommendations } from '../hooks/useRecommendations';
import LoadingSpinner from './LoadingSpinner';
import { motion } from 'framer-motion';

export default function AIInsights() {
  const { recommendations, loading, error } = useRecommendations();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Sparkles className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          AI Insights
        </h2>
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-600 dark:text-red-400">
          <Sparkles className="w-5 h-5" />
          Error Loading Insights
        </h2>
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <Sparkles className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        AI Insights
      </h2>
      
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
          Looking for this?
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-4 rounded-lg",
                "bg-gray-50 dark:bg-gray-700/50",
                "transition-colors duration-200"
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {rec.title}
                  </h4>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={rec.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "px-3 py-1 rounded",
                      "bg-blue-100 dark:bg-blue-900/30",
                      "text-blue-600 dark:text-blue-400",
                      "text-sm font-medium",
                      "hover:bg-blue-200 dark:hover:bg-blue-900/50",
                      "transition-colors"
                    )}
                  >
                    Visit Site
                  </motion.a>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 break-all">
                  {new URL(rec.url).hostname}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {rec.reason}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}