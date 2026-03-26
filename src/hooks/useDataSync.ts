import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStore, applyAccentColor } from '@/store/useStore';
import {
  loadProfileFromCloud,
  loadCheckIns,
  loadJournalEntries,
  loadBadges,
  loadChatMessages,
  syncProfileToCloud,
  syncCheckIn,
  syncJournalEntry,
  syncBadge,
  syncChatMessage,
  syncSOSEvent,
} from '@/lib/sync';

const DEFAULT_STATE = {
  checkIns: [],
  journalEntries: [],
  badges: [],
  chatMessages: [],
  sosEvents: [],
  xp: 0,
  level: 1,
  streak: 0,
  lastCheckInDate: '',
  dailyChallenge: null,
  profile: {
    name: 'Explorer',
    role: 'student' as const,
    avatarStyle: 1 as const,
    accentColor: 'teal' as const,
  },
};

export function useDataSync() {
  const { user } = useAuth();
  const store = useStore();
  const loadedForUser = useRef<string | null>(null);
  const prevCheckInsLen = useRef(0);
  const prevJournalLen = useRef(0);
  const prevBadgesLen = useRef(0);
  const prevChatLen = useRef(0);
  const prevSOSLen = useRef(0);

  // When user changes (login/logout), reset local state and load from cloud
  useEffect(() => {
    if (!user) {
      // User logged out — reset to defaults so next user doesn't see stale data
      if (loadedForUser.current) {
        useStore.setState({ ...DEFAULT_STATE });
        applyAccentColor('teal');
        loadedForUser.current = null;
        prevCheckInsLen.current = 0;
        prevJournalLen.current = 0;
        prevBadgesLen.current = 0;
        prevChatLen.current = 0;
        prevSOSLen.current = 0;
      }
      return;
    }

    // Already loaded for this user
    if (loadedForUser.current === user.id) return;
    loadedForUser.current = user.id;

    // Clear local state first, then load this user's cloud data
    useStore.setState({ ...DEFAULT_STATE });

    (async () => {
      const [profileData, checkIns, journal, badges, chat] = await Promise.all([
        loadProfileFromCloud(user.id),
        loadCheckIns(user.id),
        loadJournalEntries(user.id),
        loadBadges(user.id),
        loadChatMessages(user.id),
      ]);

      if (profileData) {
        useStore.setState({
          profile: profileData.profile,
          xp: profileData.xp,
          level: profileData.level,
          streak: profileData.streak,
          lastCheckInDate: profileData.lastCheckInDate,
        });
        applyAccentColor(profileData.profile.accentColor);
      }

      useStore.setState({ checkIns });
      prevCheckInsLen.current = checkIns.length;

      useStore.setState({ journalEntries: journal });
      prevJournalLen.current = journal.length;

      useStore.setState({ badges });
      prevBadgesLen.current = badges.length;

      useStore.setState({ chatMessages: chat });
      prevChatLen.current = chat.length;
    })();
  }, [user?.id]);

  // Sync new data to cloud (only when logged in)
  useEffect(() => {
    if (!user || loadedForUser.current !== user.id) return;

    if (store.checkIns.length > prevCheckInsLen.current) {
      const newOnes = store.checkIns.slice(prevCheckInsLen.current);
      newOnes.forEach(c => syncCheckIn(user.id, c));
      prevCheckInsLen.current = store.checkIns.length;
      syncProfileToCloud(user.id, store.profile, store.xp, store.level, store.streak, store.lastCheckInDate);
    }

    if (store.journalEntries.length > prevJournalLen.current) {
      const newOnes = store.journalEntries.slice(prevJournalLen.current);
      newOnes.forEach(j => syncJournalEntry(user.id, j));
      prevJournalLen.current = store.journalEntries.length;
      syncProfileToCloud(user.id, store.profile, store.xp, store.level, store.streak, store.lastCheckInDate);
    }

    if (store.badges.length > prevBadgesLen.current) {
      const newOnes = store.badges.slice(prevBadgesLen.current);
      newOnes.forEach(b => syncBadge(user.id, b));
      prevBadgesLen.current = store.badges.length;
    }

    if (store.chatMessages.length > prevChatLen.current) {
      const newOnes = store.chatMessages.slice(prevChatLen.current);
      newOnes.forEach(m => syncChatMessage(user.id, m));
      prevChatLen.current = store.chatMessages.length;
    }

    if (store.sosEvents.length > prevSOSLen.current) {
      const newOnes = store.sosEvents.slice(prevSOSLen.current);
      newOnes.forEach(s => syncSOSEvent(user.id, s.date));
      prevSOSLen.current = store.sosEvents.length;
    }
  }, [user, store.checkIns.length, store.journalEntries.length, store.badges.length, store.chatMessages.length, store.sosEvents.length]);

  // Sync profile changes (debounced)
  useEffect(() => {
    if (!user || loadedForUser.current !== user.id) return;
    const timeout = setTimeout(() => {
      syncProfileToCloud(user.id, store.profile, store.xp, store.level, store.streak, store.lastCheckInDate);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [user, store.profile, store.xp, store.level, store.streak]);
}
