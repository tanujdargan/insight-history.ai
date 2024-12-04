import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Globe, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useProductivityStore } from '../../store/productivityStore';
import { isValidUrl } from '../../utils/url/validators';

interface GoalFormProps {
  onClose: () => void;
}

export default function GoalForm({ onClose }: GoalFormProps) {
  const { addGoal } = useProductivityStore();
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('60');
  const [type, setType] = useState<'time' | 'visits'>('time');
  const [domain, setDomain] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !target.trim()) return;

    const targetValue = parseInt(target, 10);
    if (isNaN(targetValue) || targetValue <= 0) return;

    if (domain && !isValidUrl(domain)) return;

    addGoal({
      title: title.trim(),
      target: targetValue,
      current: 0,
      type,
      domain: domain.trim(),
      completed: false,
    });

    onClose();
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
      onSubmit={handleSubmit}
    >
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Goal Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={cn(
            "mt-1 block w-full rounded-md",
            "border border-gray-300 dark:border-gray-600",
            "bg-white dark:bg-gray-700",
            "text-gray-900 dark:text-gray-100",
            "shadow-sm",
            "focus:border-blue-500 focus:ring-blue-500"
          )}
          required
        />
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Website URL (optional)
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 text-gray-500 dark:text-gray-400">
            <Globe className="h-4 w-4" />
          </span>
          <input
            type="url"
            id="website"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="https://example.com"
            className={cn(
              "block w-full rounded-r-md",
              "border border-gray-300 dark:border-gray-600",
              "bg-white dark:bg-gray-700",
              "text-gray-900 dark:text-gray-100",
              "focus:border-blue-500 focus:ring-blue-500"
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="target" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Target
          </label>
          <input
            type="number"
            id="target"
            min="1"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className={cn(
              "mt-1 block w-full rounded-md",
              "border border-gray-300 dark:border-gray-600",
              "bg-white dark:bg-gray-700",
              "text-gray-900 dark:text-gray-100",
              "shadow-sm",
              "focus:border-blue-500 focus:ring-blue-500"
            )}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Type
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setType('time')}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium rounded-l-md",
                "border border-gray-300 dark:border-gray-600",
                "focus:outline-none focus:ring-2 focus:ring-blue-500",
                type === 'time' ? 
                  "bg-blue-500 text-white border-blue-500" : 
                  "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              )}
            >
              <Clock className="w-4 h-4 mx-auto" />
            </button>
            <button
              type="button"
              onClick={() => setType('visits')}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium rounded-r-md",
                "border border-l-0 border-gray-300 dark:border-gray-600",
                "focus:outline-none focus:ring-2 focus:ring-blue-500",
                type === 'visits' ? 
                  "bg-blue-500 text-white border-blue-500" : 
                  "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              )}
            >
              <Target className="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "px-4 py-2 rounded-md",
            "text-gray-700 dark:text-gray-300",
            "bg-gray-100 dark:bg-gray-800",
            "hover:bg-gray-200 dark:hover:bg-gray-700"
          )}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={cn(
            "px-4 py-2 rounded-md",
            "bg-blue-500 text-white",
            "hover:bg-blue-600"
          )}
        >
          Create Goal
        </button>
      </div>
    </motion.form>
  );
}