import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Target, Trophy, Search, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import ThemeToggle from '../ThemeToggle';

export default function NavBar() {
  const location = useLocation();

  const links = [
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/productivity', label: 'Productivity', icon: Target },
    { to: '/achievements', label: 'Achievements', icon: Trophy },
    { to: '/ai-search', label: 'AI Search', icon: Search },
    { to: '/detailed-history', label: 'History', icon: History },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "relative flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium",
                  "transition-colors duration-200",
                  location.pathname === to
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {location.pathname === to && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-md -z-10"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}