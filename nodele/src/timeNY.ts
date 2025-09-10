// timeNY.ts
const NY_TZ = "America/New_York";

export function nowNY(): Date {
  // Always construct from ISO w/ NY formatting to avoid DST edge weirdness
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: NY_TZ, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
  });
  // "YYYY-MM-DD, HH:MM:SS"
  const parts = fmt.formatToParts(new Date());
  const get = (t: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === t)?.value;
  const iso = `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`;
  return new Date(iso + "-04:00"); // Offset doesn't matter; we only compare Y-M-D
}

export function ymdNY(d = nowNY()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isNextDay(prevYmd: string, currYmd: string): boolean {
  const toUTC = (ymd: string) => new Date(ymd + "T00:00:00Z").getTime();
  const diffDays = Math.round((toUTC(currYmd) - toUTC(prevYmd)) / 86_400_000);
  return diffDays === 1;
}
