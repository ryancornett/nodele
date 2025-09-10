// streak.ts
import { ymdNY, isNextDay } from "./timeNY";

export type StreakState = {
  count: number;
  lastWinYmd: string | null; // NY date string "YYYY-MM-DD"
  best: number;
  wins: number; // total daily wins
  version: 1;
};

const KEY = "dnn.streak.v1";

export function loadStreak(): StreakState {
  const raw = localStorage.getItem(KEY);
  if (!raw) return { count: 0, lastWinYmd: null, best: 0, wins: 0, version: 1 };
  try {
    const s = JSON.parse(raw) as StreakState;
    if (s.version !== 1) throw 0;
    return s;
  } catch {
    return { count: 0, lastWinYmd: null, best: 0, wins: 0, version: 1 };
  }
}

export function resetStreak() {
  localStorage.removeItem(KEY);
}

export function recordDailyWin(todayYmd = ymdNY()): StreakState {
  const s = loadStreak();
  // Ignore duplicates: only one win per NY day increases the streak
  if (s.lastWinYmd === todayYmd) {
    return s; // already counted today
  }
  let nextCount = 1;
  if (s.lastWinYmd && isNextDay(s.lastWinYmd, todayYmd)) {
    nextCount = s.count + 1;
  }
  const next: StreakState = {
    version: 1,
    wins: s.wins + 1,
    lastWinYmd: todayYmd,
    count: nextCount,
    best: Math.max(s.best, nextCount),
  };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
