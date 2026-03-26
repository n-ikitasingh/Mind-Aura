import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Mood = 'amazing' | 'good' | 'okay' | 'low' | 'awful';
export type AccentColor = 'teal' | 'lavender' | 'amber' | 'rose' | 'mint';
export type AvatarStyle = 1 | 2 | 3 | 4 | 5 | 6;

export interface ActivityDetail {
  type: 'sleep' | 'water' | 'exercise' | 'social' | 'meditation';
  sleepHours?: number;
  waterGlasses?: number;
  exerciseType?: string;
  exerciseDuration?: number;
  socialWith?: string;
  socialRating?: number;
  meditationDuration?: number;
  meditationGuided?: string;
}

export interface CheckIn {
  id: string;
  date: string;
  mood: Mood;
  activities: ActivityDetail[];
  wellnessScore: number;
  timestamp: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  timestamp: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: number;
}

export interface DailyChallenge {
  id: string;
  text: string;
  xp: number;
  completed: boolean;
  date: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}

interface UserProfile {
  name: string;
  role: 'student' | 'faculty' | 'professional';
  avatarStyle: AvatarStyle;
  accentColor: AccentColor;
  weight?: number;
  age?: number;
}

interface AppState {
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Profile
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;

  // Check-ins
  checkIns: CheckIn[];
  addCheckIn: (checkIn: CheckIn) => void;

  // Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: JournalEntry) => void;

  // Gamification
  xp: number;
  level: number;
  streak: number;
  lastCheckInDate: string;
  badges: Badge[];
  addXP: (amount: number) => void;
  earnBadge: (badge: Badge) => void;

  // Daily Challenge
  dailyChallenge: DailyChallenge | null;
  setDailyChallenge: (challenge: DailyChallenge) => void;
  completeChallenge: () => void;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;

  // SOS
  sosEvents: { date: string; timestamp: number }[];
  addSOSEvent: () => void;
}

const ACCENT_MAP: Record<AccentColor, { h: number; s: string; l: string }> = {
  teal: { h: 170, s: '48%', l: '33%' },
  lavender: { h: 258, s: '30%', l: '65%' },
  amber: { h: 28, s: '89%', l: '67%' },
  rose: { h: 350, s: '65%', l: '55%' },
  mint: { h: 160, s: '50%', l: '50%' },
};

function applyAccentColor(color: AccentColor) {
  const { h, s, l } = ACCENT_MAP[color];
  document.documentElement.style.setProperty('--accent-h', String(h));
  document.documentElement.style.setProperty('--accent-s', s);
  document.documentElement.style.setProperty('--accent-l', l);
}

function applyDarkMode(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark);
}

function calculateLevel(xp: number): number {
  if (xp >= 5000) return 10;
  return Math.floor(xp / 500) + 1;
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      darkMode: false,
      toggleDarkMode: () => {
        const next = !get().darkMode;
        applyDarkMode(next);
        set({ darkMode: next });
      },

      profile: {
        name: 'Explorer',
        role: 'student',
        avatarStyle: 1 as AvatarStyle,
        accentColor: 'teal',
      },
      updateProfile: (updates) => {
        const newProfile = { ...get().profile, ...updates };
        if (updates.accentColor) applyAccentColor(updates.accentColor);
        set({ profile: newProfile });
      },

      checkIns: [],
      addCheckIn: (checkIn) => {
        const state = get();
        const today = getToday();
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const newStreak = state.lastCheckInDate === yesterday ? state.streak + 1 : state.lastCheckInDate === today ? state.streak : 1;
        
        set({
          checkIns: [...state.checkIns, checkIn],
          lastCheckInDate: today,
          streak: newStreak,
        });
      },

      journalEntries: [],
      addJournalEntry: (entry) => set({ journalEntries: [...get().journalEntries, entry] }),

      xp: 0,
      level: 1,
      streak: 0,
      lastCheckInDate: '',
      badges: [],
      addXP: (amount) => {
        const newXP = get().xp + amount;
        set({ xp: newXP, level: calculateLevel(newXP) });
      },
      earnBadge: (badge) => {
        const existing = get().badges;
        if (!existing.find(b => b.id === badge.id)) {
          set({ badges: [...existing, { ...badge, earnedAt: Date.now() }] });
        }
      },

      dailyChallenge: null,
      setDailyChallenge: (challenge) => set({ dailyChallenge: challenge }),
      completeChallenge: () => {
        const c = get().dailyChallenge;
        if (c && !c.completed) {
          set({ dailyChallenge: { ...c, completed: true } });
          get().addXP(c.xp);
        }
      },

      chatMessages: [],
      addChatMessage: (msg) => set({ chatMessages: [...get().chatMessages, msg] }),

      sosEvents: [],
      addSOSEvent: () => set({ sosEvents: [...get().sosEvents, { date: getToday(), timestamp: Date.now() }] }),
    }),
    {
      name: 'mindaura-storage',
    }
  )
);

// Apply theme on load
const initTheme = () => {
  const state = useStore.getState();
  applyDarkMode(state.darkMode);
  applyAccentColor(state.profile.accentColor);
};
initTheme();

export { applyAccentColor, applyDarkMode, ACCENT_MAP };
