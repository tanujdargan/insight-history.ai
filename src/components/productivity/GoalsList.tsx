import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { useProductivityStore } from '../../store/productivityStore';
import { cn } from '../../utils/cn';
import GoalForm from './GoalForm';

export default function GoalsList() {
  const { goals, deleteGoal, updateGoal } = useProductivityStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showForm, setShowForm] = useState(false);

  const startEditing = (goal: { id: string; title: string }) => {
    setEditingId(goal.id);
    setEditValue(goal.title);
  };

  const saveEdit = (id: string) => {
    if (editValue.trim()) {
      updateGoal(id, { title: editValue.trim() });
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Your Goals
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className={cn(
            "px-4 py-2 rounded-lg",
            "bg-blue-600 text-white",
            "hover:bg-blue-700",
            "flex items-center space-x-2"
          )}
        >
          <Plus className="w-4 h-4" />
          <span>Add Goal</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <GoalForm onClose={() => setShowForm(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {goals.map((goal) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-4 rounded-lg",
              "bg-white dark:bg-gray-800",
              "border border-gray-200 dark:border-gray-700"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-blue-500" />
                <div>
                  {editingId === goal.id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(goal.id)}
                      className={cn(
                        "px-2 py-1 rounded border",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500",
                        "dark:bg-gray-700 dark:border-gray-600"
                      )}
                      autoFocus
                    />
                  ) : (
                    <>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {goal.title}
                      </h3>
                      {goal.domain && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {goal.domain}
                        </p>
                      )}
                    </>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {goal.current} / {goal.target} {goal.type === 'time' ? 'minutes' : 'visits'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {editingId === goal.id ? (
                  <button
                    onClick={() => saveEdit(goal.id)}
                    className="text-green-500 hover:text-green-600"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => startEditing(goal)}
                    className="text-gray-500 hover:text-gray-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}