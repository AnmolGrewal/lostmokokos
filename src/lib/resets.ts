import { useEffect, useState } from 'react';

/** Lost Ark (NA/EU) resets daily at 10:00 UTC; the weekly reset is Wednesday 10:00 UTC. */
const RESET_HOUR_UTC = 10;
const WEEKLY_RESET_DAY = 3; // Wednesday

export function nextDailyReset(now = new Date()): Date {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), RESET_HOUR_UTC));
  if (d.getTime() <= now.getTime()) d.setUTCDate(d.getUTCDate() + 1);
  return d;
}

export function nextWeeklyReset(now = new Date()): Date {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), RESET_HOUR_UTC));
  const daysAhead = (WEEKLY_RESET_DAY - d.getUTCDay() + 7) % 7;
  d.setUTCDate(d.getUTCDate() + daysAhead);
  if (d.getTime() <= now.getTime()) d.setUTCDate(d.getUTCDate() + 7);
  return d;
}

/** The most recent weekly reset at or before `now` — used to wipe weekly checkmarks. */
export function lastWeeklyReset(now = new Date()): Date {
  const next = nextWeeklyReset(now);
  return new Date(next.getTime() - 7 * 24 * 3600 * 1000);
}

export function formatCountdown(ms: number): string {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  return [days ? `${days}d` : null, hours || days ? `${hours}h` : null, `${minutes}m`].filter(Boolean).join(' ');
}

/** Re-renders every 30s; returns null on the server / first render so markup stays hydration-safe. */
export function useNow(intervalMs = 30_000): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
