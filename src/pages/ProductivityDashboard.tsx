import React from 'react';
import { motion } from 'framer-motion';
import { Target, Award, Zap } from 'lucide-react';
import { useProductivityStore } from '../store/productivityStore';
import { cn } from '../utils/cn';
import GoalsList from '../components/productivity/GoalsList';

export default function ProductivityDashboard() {
  const { streak, challenges, badges } = useProductivityStore();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        Productivity Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 rounded-lg",
            "bg-white dark:bg-gray-800",
            "border border-gray-200 dark:border-gray-700"
          )}
        >
          <div className="flex items-center space-x-3">
            <Zap className="w-6 h-6 text-yellow-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Current Streak
              </h2>
              <p className="text-3xl font-bold text-yellow-500">
                {streak.current} days
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "p-6 rounded-lg",
            "bg-white dark:bg-gray-800",
            "border border-gray-200 dark:border-gray-700"
          )}
        >
          <div className="flex items-center space-x-3">
            <Target className="w-6 h-6 text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Active Challenges
              </h2>
              <p className="text-3xl font-bold text-blue-500">
                {challenges.filter(c => !c.completed).length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "p-6 rounded-lg",
            "bg-white dark:bg-gray-800",
            "border border-gray-200 dark:border-gray-700"
          )}
        >
          <div className="flex items-center space-x-3">
            <Award className="w-6 h-6 text-purple-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Badges Earned
              </h2>
              <p className="text-3xl font-bold text-purple-500">
                {badges.filter(b => b.earnedDate).length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-8">
        <GoalsList />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Active Challenges
        </h2>
        <div className="grid gap-4">
          {challenges.filter(c => !c.completed).map((challenge) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-4 rounded-lg",
                "bg-white dark:bg-gray-800",
                "border border-gray-200 dark:border-gray-700"
              )}
            >
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {challenge.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {challenge.description}
              </p>
              <div className="mt-2">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${challenge.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {challenge.progress}% complete
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}