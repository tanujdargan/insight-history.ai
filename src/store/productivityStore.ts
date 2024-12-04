import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Goal, Challenge, Badge, Streak, ProductivitySettings } from '../types/productivity';

interface ProductivityState {
  goals: Goal[];
  challenges: Challenge[];
  badges: Badge[];
  streak: Streak;
  settings: ProductivitySettings;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleNaturalLanguageSearch: () => void;
  updateTimeRestriction: (domain: string, minutes: number) => void;
}

export const useProductivityStore = create<ProductivityState>()(
  persist(
    (set) => ({
      goals: [],
      challenges: [],
      badges: [],
      streak: {
        current: 0,
        best: 0,
        lastUpdated: new Date(),
      },
      settings: {
        naturalLanguageSearch: false,
        timeRestrictions: {},
      },
      addGoal: (goal) =>
        set((state) => ({
          goals: [...state.goals, { ...goal, id: crypto.randomUUID() }],
        })),
      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, ...updates } : goal
          ),
        })),
      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        })),
      toggleNaturalLanguageSearch: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            naturalLanguageSearch: !state.settings.naturalLanguageSearch,
          },
        })),
      updateTimeRestriction: (domain, minutes) =>
        set((state) => ({
          settings: {
            ...state.settings,
            timeRestrictions: {
              ...state.settings.timeRestrictions,
              [domain]: minutes,
            },
          },
        })),
    }),
    {
      name: 'productivity-storage',
    }
  )
);