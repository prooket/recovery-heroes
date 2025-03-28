export type DayStatus = 'clean' | 'slip' | 'relapse';

export interface User {
  id: string;
  name: string;
  cleanDays: number;
  slips: number;
  relapses: number;
  startDate: Date | null;
  currentStreak: number;
  bestStreak: number;
}

export interface CalendarDay {
  date: Date;
  status: DayStatus;
}

export interface JournalEntry {
  date: Date;
  content: string;
  status: DayStatus;
  title: string;
}

export interface Task {
  id: string;
  name: string;
  completed: boolean;
  importance: 1 | 2 | 3;
}