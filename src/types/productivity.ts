export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  type: 'time' | 'visits';
  domain: string;
  deadline?: Date;
  completed: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  completed: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate?: Date;
  progress: number;
}

export interface Streak {
  current: number;
  best: number;
  lastUpdated: Date;
}

export interface ProductivitySettings {
  naturalLanguageSearch: boolean;
  timeRestrictions: {
    [domain: string]: number; // minutes per day
  };
}