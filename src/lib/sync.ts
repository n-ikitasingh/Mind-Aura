import { supabase } from '@/integrations/supabase/client';
import type { CheckIn, JournalEntry, Badge, ChatMessage } from '@/store/useStore';

export async function syncProfileToCloud(userId: string, profile: any, xp: number, level: number, streak: number, lastCheckInDate: string) {
  const { error } = await supabase.from('profiles').update({
    name: profile.name,
    role: profile.role,
    avatar_style: profile.avatarStyle,
    accent_color: profile.accentColor,
    weight: profile.weight || null,
    age: profile.age || null,
    xp,
    level,
    streak,
    last_check_in_date: lastCheckInDate,
  }).eq('user_id', userId);
  if (error) console.error('Profile sync error:', error);
}

export async function loadProfileFromCloud(userId: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
  if (error || !data) return null;
  return {
    profile: {
      name: data.name,
      role: data.role as any,
      avatarStyle: data.avatar_style as any,
      accentColor: data.accent_color as any,
      weight: data.weight ? Number(data.weight) : undefined,
      age: data.age || undefined,
    },
    xp: data.xp,
    level: data.level,
    streak: data.streak,
    lastCheckInDate: data.last_check_in_date || '',
  };
}

export async function syncCheckIn(userId: string, checkIn: CheckIn) {
  const { error } = await supabase.from('check_ins').insert({
    id: checkIn.id,
    user_id: userId,
    date: checkIn.date,
    mood: checkIn.mood,
    activities: checkIn.activities as any,
    wellness_score: checkIn.wellnessScore,
  });
  if (error) console.error('Check-in sync error:', error);
}

export async function loadCheckIns(userId: string): Promise<CheckIn[]> {
  const { data, error } = await supabase.from('check_ins').select('*').eq('user_id', userId).order('created_at', { ascending: true });
  if (error || !data) return [];
  return data.map(d => ({
    id: d.id,
    date: d.date,
    mood: d.mood as any,
    activities: (d.activities as any) || [],
    wellnessScore: d.wellness_score,
    timestamp: new Date(d.created_at).getTime(),
  }));
}

export async function syncJournalEntry(userId: string, entry: JournalEntry) {
  const { error } = await supabase.from('journal_entries').insert({
    id: entry.id,
    user_id: userId,
    date: entry.date,
    content: entry.content,
    sentiment: entry.sentiment,
  });
  if (error) console.error('Journal sync error:', error);
}

export async function loadJournalEntries(userId: string): Promise<JournalEntry[]> {
  const { data, error } = await supabase.from('journal_entries').select('*').eq('user_id', userId).order('created_at', { ascending: true });
  if (error || !data) return [];
  return data.map(d => ({
    id: d.id,
    date: d.date,
    content: d.content,
    sentiment: d.sentiment as any,
    timestamp: new Date(d.created_at).getTime(),
  }));
}

export async function syncBadge(userId: string, badge: Badge) {
  const { error } = await supabase.from('badges').insert({
    user_id: userId,
    badge_id: badge.id,
    name: badge.name,
    description: badge.description || null,
    icon: badge.icon || null,
  });
  if (error && !error.message.includes('duplicate')) console.error('Badge sync error:', error);
}

export async function loadBadges(userId: string): Promise<Badge[]> {
  const { data, error } = await supabase.from('badges').select('*').eq('user_id', userId);
  if (error || !data) return [];
  return data.map(d => ({
    id: d.badge_id,
    name: d.name,
    description: d.description || '',
    icon: d.icon || '',
    earnedAt: new Date(d.earned_at).getTime(),
  }));
}

export async function syncChatMessage(userId: string, msg: ChatMessage) {
  const { error } = await supabase.from('chat_messages').insert({
    id: msg.id,
    user_id: userId,
    role: msg.role,
    content: msg.content,
  });
  if (error) console.error('Chat sync error:', error);
}

export async function loadChatMessages(userId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase.from('chat_messages').select('*').eq('user_id', userId).order('created_at', { ascending: true });
  if (error || !data) return [];
  return data.map(d => ({
    id: d.id,
    role: d.role as any,
    content: d.content,
    timestamp: new Date(d.created_at).getTime(),
  }));
}

export async function syncSOSEvent(userId: string, date: string) {
  const { error } = await supabase.from('sos_events').insert({
    user_id: userId,
    date,
  });
  if (error) console.error('SOS sync error:', error);
}
