import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Trophy } from 'lucide-react';
import { useProductivityStore } from '../store/productivityStore';
import { cn } from '../utils/cn';

export default function AchievementsPage() {
  const { badges } = useProductivityStore();

  if (badges.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Achievements
        </h1>
        
        <div className="flex flex-col items-center justify-center py-16">
          <Trophy className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No Achievements Yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
            Complete goals and challenges to earn achievements. Keep browsing and stay productive!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        Achievements
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-6 rounded-lg",
              "bg-white dark:bg-gray-800",
              "border border-gray-200 dark:border-gray-700",
              !badge.earnedDate && "opacity-50"
            )}
          >
            <div className="flex items-center space-x-4">
              <div className={cn(
                "p-3 rounded-full",
                badge.earnedDate ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-600",
                "dark:bg-opacity-20"
              )}>
                {badge.earnedDate ? <Award className="w-6 h-6" /> : <Star className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {badge.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {badge.description}
                </p>
                {badge.earnedDate && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Earned on {badge.earnedDate.toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            {!badge.earnedDate && (
              <div className="mt-4">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: `${badge.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {badge.progress}% complete
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}