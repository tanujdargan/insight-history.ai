import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { HistoryEntry } from '../types';
import { searchHistory } from '../services/searchService';
import { useHistory } from '../hooks/useHistory';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  results?: HistoryEntry[];
}

export default function AISearchPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { historyEntries } = useHistory();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const results = await searchHistory(input, historyEntries, true);
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: results.length > 0 
          ? "Here are the most relevant results from your history:"
          : "I couldn't find any matching results in your history.",
        results: results.slice(0, 3)
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: 'Sorry, I encountered an error while searching. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          AI History Search
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Ask natural questions about your browsing history
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col" style={{ height: '70vh' }}>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  "flex items-start gap-3",
                  message.type === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "flex items-start gap-3 max-w-[80%]",
                  message.type === 'user' ? "flex-row-reverse" : "flex-row"
                )}>
                  <div className={cn(
                    "p-2 rounded-full flex-shrink-0",
                    message.type === 'user' 
                      ? "bg-blue-100 dark:bg-blue-900" 
                      : "bg-gray-100 dark:bg-gray-700"
                  )}>
                    {message.type === 'user' 
                      ? <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      : <Bot className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    }
                  </div>
                  <div className={cn(
                    "rounded-lg p-4 break-words",
                    message.type === 'user'
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  )}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.results && (
                      <div className="mt-4 space-y-2">
                        {message.results.map((result, index) => (
                          <a
                            key={index}
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "block p-3 rounded",
                              "bg-white dark:bg-gray-800",
                              "hover:bg-gray-50 dark:hover:bg-gray-600",
                              "transition-colors"
                            )}
                          >
                            <h4 className="font-medium break-words">{result.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 break-all">
                              {result.url}
                            </p>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your history... (e.g., 'Find videos about React I watched last week')"
              className={cn(
                "flex-1 px-4 py-2 rounded-lg",
                "bg-gray-100 dark:bg-gray-700",
                "text-gray-900 dark:text-gray-100",
                "placeholder-gray-500 dark:placeholder-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-blue-500"
              )}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={cn(
                "p-2 rounded-lg",
                "bg-blue-500 text-white",
                "hover:bg-blue-600",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-colors"
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}