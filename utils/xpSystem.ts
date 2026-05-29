export interface XPLevel {
  level: number;
  title: string;
  emoji: string;
  minXP: number;
  color: string;
}

export const XP_LEVELS: XPLevel[] = [
  { level: 1, title: 'Rookie',    emoji: '🌱', minXP: 0,    color: '#6B7280' },
  { level: 2, title: 'Student',   emoji: '📚', minXP: 50,   color: '#60A5FA' },
  { level: 3, title: 'Analyst',   emoji: '📊', minXP: 150,  color: '#10B981' },
  { level: 4, title: 'Investor',  emoji: '💰', minXP: 350,  color: '#10B981' },
  { level: 5, title: 'Trader',    emoji: '📈', minXP: 700,  color: '#F59E0B' },
  { level: 6, title: 'Expert',    emoji: '🏅', minXP: 1200, color: '#F59E0B' },
  { level: 7, title: 'Master',    emoji: '🏆', minXP: 2000, color: '#EF4444' },
  { level: 8, title: 'Legend',    emoji: '👑', minXP: 3500, color: '#E879F9' },
];

export function getLevelInfo(xp: number): XPLevel {
  return [...XP_LEVELS].reverse().find(l => xp >= l.minXP) ?? XP_LEVELS[0];
}

export function getNextLevel(xp: number): XPLevel | null {
  const current = getLevelInfo(xp);
  return XP_LEVELS.find(l => l.level === current.level + 1) ?? null;
}

export function getProgressToNext(xp: number): number {
  const current = getLevelInfo(xp);
  const next = getNextLevel(xp);
  if (!next) return 1;
  return (xp - current.minXP) / (next.minXP - current.minXP);
}

export function getXPForAction(action: 'correct' | 'perfect' | 'lesson' | 'daily' | 'streak7'): number {
  const rewards: Record<string, number> = {
    correct: 5,
    perfect: 15,
    lesson: 20,
    daily: 10,
    streak7: 25,
  };
  return rewards[action] ?? 0;
}
