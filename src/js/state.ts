// Type Definitions
export interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  category: string;
  created: Date;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Done';
}

export interface Snippet {
  id: number;
  title: string;
  language: string;
  code: string;
  tags: string[];
}

export interface Resource {
  id: number;
  title: string;
  url: string;
  category: string;
  tags: string[];
  description: string;
}

export interface ScheduleItem {
  id: number;
  day: string;
  time: string;
  subject: string;
  description: string;
  location: string;
  completed: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  goal: string;
  skills: string[];
  avatarIcon: string;
}

export interface FocusSession {
  date: string;
  minutes: number;
  type: string;
}

export interface FocusMode {
  streak: number;
  minutesToday: number;
  weeklyHours: number;
  totalSessions: number;
  lastSessionDate: string | null;
  sessions: FocusSession[];
}

export interface ProductivityEntry {
  date: string;
  completed: number;
}

export interface Productivity {
  dailyGoal: number;
  weeklyGoal: number;
  completedToday: number;
  completedThisWeek: number;
  history: ProductivityEntry[];
}

export interface Settings {
  autoSave: boolean;
  notifications: boolean;
  soundEffects: boolean;
  compactMode: boolean;
  showCompleted: boolean;
}

export interface AppData {
  notes: Note[];
  tasks: Task[];
  snippets: Snippet[];
  schedule: ScheduleItem[];
  resources: Resource[];
  currentView: string;
  theme: 'light' | 'dark';
  userProfile: UserProfile;
  focusMode: FocusMode;
  productivity: Productivity;
  settings: Settings;
  searchHistory: string[];
  bookmarks: string[];
  techNews: TechNews[];
  techEvents: TechEvent[];
}

export interface Quote {
  text: string;
  author: string;
}

export interface TechNews {
  id: number;
  title: string;
  category: string;
  description: string;
  link?: string;
}

export interface TechEvent {
  id: number;
  title: string;
  date: string;
  type: string;
  location: string;
}

export const appData: AppData = {
  notes: [],
  tasks: [],
  snippets: [],
  schedule: [],
  resources: [],
  currentView: 'dashboard',
  theme: 'light',
  userProfile: {
    name: '',
    email: '',
    bio: '',
    goal: '',
    skills: [],
    avatarIcon: 'fa-user'
  },
  focusMode: {
    streak: 0,
    minutesToday: 0,
    weeklyHours: 0,
    totalSessions: 0,
    lastSessionDate: null,
    sessions: []
  },
  productivity: {
    dailyGoal: 8,
    weeklyGoal: 40,
    completedToday: 0,
    completedThisWeek: 0,
    history: []
  },
  settings: {
    autoSave: true,
    notifications: true,
    soundEffects: true,
    compactMode: false,
    showCompleted: true
  },
  searchHistory: [],
  bookmarks: [],
  techNews: [],
  techEvents: []
};

export const quotes: Quote[] = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" }
];

export const DATA_EXPORT_VERSION: string = '1.0';
export const STORAGE_COLLECTIONS: string[] = ['notes', 'tasks', 'snippets', 'schedule'];
