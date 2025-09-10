// Daily helpers — America/New_York canonical time

const TZ = 'America/New_York';

// Set this ONCE to “day one” (today if you want today to be #1).
// Example: 2025-09-10 (YYYY, MM, DD)
export const EPOCH_NY = { y: 2025, m: 9, d: 10 };

function nyParts(d = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const parts = fmt.formatToParts(d).reduce<Record<string,string>>((acc, p) => {
    if (p.type === 'year' || p.type === 'month' || p.type === 'day') acc[p.type] = p.value;
    return acc;
  }, {});
  return { y: +parts.year!, m: +parts.month!, d: +parts.day! };
}

function toUTCDate(y: number, m: number, d: number) {
  // Represent an NY calendar day as a UTC midnight of that calendar day.
  // Using Date.UTC avoids DST games because we compare whole days.
  return Date.UTC(y, m - 1, d);
}

// Daily number where EPOCH_NY is #1
export function dailyNumberNY(today = new Date()) {
  const { y, m, d } = nyParts(today);
  const nowUTC = toUTCDate(y, m, d);
  const epochUTC = toUTCDate(EPOCH_NY.y, EPOCH_NY.m, EPOCH_NY.d);
  const days = Math.floor((nowUTC - epochUTC) / 86_400_000);
  return days + 1;
}

// Deterministic seed from NY date (YYYYMMDD)
export function dailySeedNY(today = new Date()) {
  const { y, m, d } = nyParts(today);
  return y * 10_000 + m * 100 + d;
}
