import { createClient } from '@supabase/supabase-js';
import { UserLevel } from './questionPicker';

// ─── FÜLLE DIESE ZWEI WERTE EIN ──────────────────────────────────────────────
// 1. Gehe zu supabase.com → dein Projekt → Settings → API
// 2. Kopiere "Project URL" und "anon public" key
const SUPABASE_URL  = 'https://DEIN-PROJEKT.supabase.co';
const SUPABASE_ANON = 'DEIN-ANON-KEY';
// ─────────────────────────────────────────────────────────────────────────────

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: { persistSession: false },
});

export interface Profile {
  id: string;
  username: string;
  streak: number;
  xp: number;
  total_questions: number;
  user_level: UserLevel;
  user_goals: string[];
  last_played_date: string | null;
  completed_lessons: string[];
  quiz_done_today: boolean;
  updated_at: string;
}

export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function upsertProfile(userId: string, profile: Omit<Profile, 'id' | 'updated_at'>) {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...profile, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data as Profile;
}
