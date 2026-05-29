import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserLevel } from './questionPicker';

const K = {
  USER_NAME:         'mm_userName',
  USER_LEVEL:        'mm_userLevel',
  USER_GOALS:        'mm_userGoals',
  STREAK:            'mm_streak',
  XP:                'mm_xp',
  TOTAL_QUESTIONS:   'mm_totalQuestions',
  LAST_PLAYED_DATE:  'mm_lastPlayedDate',
  COMPLETED_LESSONS: 'mm_completedLessons',
  QUIZ_DONE_TODAY:   'mm_quizDoneToday',
  ONBOARDING_DONE:   'mm_onboardingDone',
};

export interface SavedState {
  userName: string;
  userLevel: UserLevel;
  userGoals: string[];
  streak: number;
  xp: number;
  totalQuestions: number;
  lastPlayedDate: string | null;
  completedLessons: string[];
  quizDoneToday: boolean;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

export async function loadState(): Promise<SavedState | null> {
  const pairs = await AsyncStorage.multiGet(Object.values(K));
  const m = Object.fromEntries(pairs.map(([k, v]) => [k, v]));

  if (m[K.ONBOARDING_DONE] !== 'true') return null;

  const lastPlayedRaw = m[K.LAST_PLAYED_DATE] || null;
  let quizDoneToday = m[K.QUIZ_DONE_TODAY] === 'true';

  // Reset quizDoneToday if it's a new day
  if (lastPlayedRaw) {
    const lastDate = new Date(lastPlayedRaw);
    if (!isSameDay(lastDate, new Date())) {
      quizDoneToday = false;
    }
  }

  return {
    userName:         m[K.USER_NAME]   ?? '',
    userLevel:        (m[K.USER_LEVEL] as UserLevel) ?? 'beginner',
    userGoals:        JSON.parse(m[K.USER_GOALS]        ?? '[]'),
    streak:           parseInt(m[K.STREAK]              ?? '1', 10),
    xp:               parseInt(m[K.XP]                  ?? '0', 10),
    totalQuestions:   parseInt(m[K.TOTAL_QUESTIONS]      ?? '0', 10),
    lastPlayedDate:   lastPlayedRaw,
    completedLessons: JSON.parse(m[K.COMPLETED_LESSONS] ?? '[]'),
    quizDoneToday,
  };
}

export async function saveState(s: Partial<SavedState> & { onboardingDone?: boolean }): Promise<void> {
  const pairs: [string, string][] = [];
  if (s.userName         !== undefined) pairs.push([K.USER_NAME,         s.userName]);
  if (s.userLevel        !== undefined) pairs.push([K.USER_LEVEL,        s.userLevel]);
  if (s.userGoals        !== undefined) pairs.push([K.USER_GOALS,        JSON.stringify(s.userGoals)]);
  if (s.streak           !== undefined) pairs.push([K.STREAK,            String(s.streak)]);
  if (s.xp               !== undefined) pairs.push([K.XP,               String(s.xp)]);
  if (s.totalQuestions   !== undefined) pairs.push([K.TOTAL_QUESTIONS,   String(s.totalQuestions)]);
  if (s.lastPlayedDate   !== undefined) pairs.push([K.LAST_PLAYED_DATE,  s.lastPlayedDate ?? '']);
  if (s.completedLessons !== undefined) pairs.push([K.COMPLETED_LESSONS, JSON.stringify(s.completedLessons)]);
  if (s.quizDoneToday    !== undefined) pairs.push([K.QUIZ_DONE_TODAY,   String(s.quizDoneToday)]);
  if (s.onboardingDone   !== undefined) pairs.push([K.ONBOARDING_DONE,   String(s.onboardingDone)]);
  if (pairs.length > 0) await AsyncStorage.multiSet(pairs);
}

export async function clearState(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(K));
}
