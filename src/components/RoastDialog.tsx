import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import { cn } from '../utils/cn';
import { analyzeHistoryForRoast } from '../services/aiService';
import { useHistory } from '../hooks/useHistory';
import LoadingSpinner from './LoadingSpinner';

interface RoastDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RoastDialog({ isOpen, onClose }: RoastDialogProps) {
  const [step, setStep] = useState(0);
  const [roast, setRoast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { historyEntries } = useHistory();

  useEffect(() => {
    if (isOpen && step === 1 && !roast) {
      setLoading(true);
      setError(null);
      analyzeHistoryForRoast(historyEntries)
        .then(setRoast)
        .catch(err => {
          console.error('Roast generation failed:', err);
          setError('Failed to generate roast. Please try again later.');
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, step, historyEntries]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={cn(
              "bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4",
              "transform transition-all duration-200",
              "shadow-xl"
            )}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {step === 0 ? "Ready to be roasted?" : "Your Roast"}
              </h2>
              <motion.button
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {step === 0 ? (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="space-y-6"
              >
                <p className="text-gray-600 dark:text-gray-300">
                  Our AI is about to analyze your browsing history and serve you some 
                  spicy observations. Are you ready to face the truth?
                </p>
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(1)}
                    className={cn(
                      "px-6 py-3 rounded-lg",
                      "bg-gradient-to-r from-orange-500 to-red-500",
                      "text-white font-semibold",
                      "hover:from-orange-600 hover:to-red-600",
                      "transition-all duration-200"
                    )}
                  >
                    Bring it on!
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="space-y-6"
              >
                {loading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : error ? (
                  <div className="text-red-500 dark:text-red-400 text-center py-8">
                    {error}
                  </div>
                ) : (
                  <div className="prose dark:prose-invert max-w-none text-gray-900 dark:text-gray-100">
                    <Typewriter
                      options={{
                        delay: 30,
                        cursor: '▋',
                        wrapperClassName: "whitespace-pre-line"
                      }}
                      onInit={(typewriter) => {
                        if (roast) {
                          const lines = roast.split('\n').map(line => line.trim()).filter(Boolean);
                          lines.forEach((line, index) => {
                            typewriter
                              .typeString(line)
                              .pauseFor(500)
                              .typeString(index < lines.length - 1 ? '\n\n' : '')
                              .start();
                          });
                        }
                      }}
                    />
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}