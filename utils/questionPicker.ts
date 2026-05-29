import { QUESTIONS, Question, GoalTag } from '../data/questions';

export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

// Mulberry32 seeded random — fast and deterministic
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getDateSeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Map onboarding goal answers to question goalTags
export function goalsToTags(goals: string[]): GoalTag[] {
  const map: Record<string, GoalTag[]> = {
    a: ['wealth', 'investing'],   // "Build long-term wealth"
    b: ['investing', 'trading'],  // "Start investing"
    c: ['personal', 'wealth'],    // "Better money decisions"
    d: ['career'],                // "Career or education goals"
    e: ['fun', 'crypto'],         // "It's fun & interesting"
  };
  const tags = new Set<GoalTag>();
  goals.forEach(g => map[g]?.forEach(t => tags.add(t)));
  if (tags.size === 0) tags.add('investing'); // fallback
  return Array.from(tags);
}

export function getDailyQuestions(
  level: UserLevel,
  goals: string[],
  count = 5
): Question[] {
  const seed = getDateSeed();
  const rand = seededRandom(seed);
  const userTags = goalsToTags(goals);

  // Difficulty weights per level
  const diffWeights: Record<UserLevel, number[]> = {
    beginner: [1, 1, 1, 1, 1, 1, 1, 2, 2, 2],           // 70% diff1, 30% diff2
    intermediate: [1, 2, 2, 2, 2, 2, 2, 3, 3, 3],        // 10% diff1, 50% diff2, 40% diff3 (approx)
    advanced: [2, 2, 3, 3, 3, 3, 3, 3, 3, 3],            // 20% diff2, 80% diff3
  };

  // Step 1: Score and rank all questions for this user
  const scored = QUESTIONS.map(q => {
    let score = 0;

    // Goal tag match (primary personalization driver)
    const matches = q.goalTags.filter(t => userTags.includes(t)).length;
    score += matches * 10;

    // Difficulty weight — pick from the weights array for this level
    const weights = diffWeights[level];
    if (weights.includes(q.difficulty)) score += 5;
    else score -= 3;

    // Add deterministic jitter so same-scored questions vary day to day
    score += rand() * 4;

    return { q, score };
  });

  // Step 2: Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Step 3: Take top 30, then shuffle with today's seed for variety
  const topPool = scored.slice(0, 40).map(s => s.q);
  const shuffled = shuffle(topPool, seededRandom(seed + 1));

  // Step 4: Ensure difficulty balance — pick `count` with variety
  const result: Question[] = [];
  const usedIds = new Set<string>();

  for (const q of shuffled) {
    if (result.length >= count) break;
    if (!usedIds.has(q.id)) {
      result.push(q);
      usedIds.add(q.id);
    }
  }

  return result;
}

// Daily challenge: SAME 5 questions for ALL users (date-seeded), but RANDOM ORDER per session
export function getDailyChallenge(count = 5): Question[] {
  const dateSeed = getDateSeed();
  const dateRand = seededRandom(dateSeed);

  // Pick questions using date seed — same for everyone today
  const shuffledAll = shuffle([...QUESTIONS], dateRand);
  const dailySet = shuffledAll.slice(0, count);

  // Randomize ORDER per session so it feels fresh
  const sessionRand = seededRandom(Date.now() % 1000000);
  return shuffle(dailySet, sessionRand);
}

export function levelFromScore(correct: number, total: number): UserLevel {
  const pct = correct / total;
  if (pct >= 0.8) return 'advanced';
  if (pct >= 0.4) return 'intermediate';
  return 'beginner';
}
