import { useSyncExternalStore } from 'react';

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

// One shared 30s clock for every component that needs "now".
const TICK_MS = 30_000;
let nowMs = 0;
let timer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (!timer) {
    nowMs = Date.now();
    timer = setInterval(() => {
      nowMs = Date.now();
      listeners.forEach((l) => l());
    }, TICK_MS);
  }
  return () => {
    listeners.delete(onChange);
    if (!listeners.size && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}
const getSnapshot = () => nowMs || (nowMs = Date.now());
const getServerSnapshot = () => 0;

/** Re-renders every 30s; returns null on the server / while hydrating so markup stays hydration-safe. */
export function useNow(): Date | null {
  const ms = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return ms ? new Date(ms) : null;
}
