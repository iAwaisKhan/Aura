export interface FocusSession {
  id: string;
  startTime: number;
  endTime: number;
  duration: number; // in seconds
  targetId?: string; // ID of note or task
  targetType?: 'note' | 'task';
  date: string; // YYYY-MM-DD
  hour: number; // 0-23
}

export interface FocusStats {
  totalTime: number;
  dailyStreak: number;
  weeklyScore: number;
  topFocusHours: string; // e.g. "9–11 AM"
}
