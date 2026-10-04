import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';

/*
 * localStorage-backed state shared by every component (and kept in sync across tabs).
 * Reads go through useSyncExternalStore, so the server and the hydration pass render `initial`
 * and the stored value takes over right after — no hydration mismatches, no effects.
 * If storage is blocked or full, values still work in memory for the session.
 */
const memory = new Map<string, string | null>();
const listeners = new Map<string, Set<() => void>>();

function read(key: string): string | null {
  if (memory.has(key)) return memory.get(key) ?? null;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    raw = null;
  }
  memory.set(key, raw);
  return raw;
}

function write(key: string, raw: string) {
  memory.set(key, raw);
  try {
    window.localStorage.setItem(key, raw);
  } catch {
    // storage full or blocked — keep working in memory
  }
  listeners.get(key)?.forEach((l) => l());
}

function onStorage(e: StorageEvent) {
  if (!e.key || !listeners.has(e.key)) return;
  memory.set(e.key, e.newValue);
  listeners.get(e.key)?.forEach((l) => l());
}

function subscribe(key: string, onChange: () => void) {
  if (!listeners.size) window.addEventListener('storage', onStorage);
  const set = listeners.get(key) ?? new Set();
  set.add(onChange);
  listeners.set(key, set);
  return () => {
    set.delete(onChange);
    if (!set.size) listeners.delete(key);
    if (!listeners.size) window.removeEventListener('storage', onStorage);
  };
}

const noopSubscribe = () => () => {};

function parse<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** useState backed by localStorage. The third value is `true` once the stored value is in (client only). */
export function useStoredState<T>(key: string, initial: T) {
  // First value wins, like useState — later `initial` arguments are ignored.
  const [fallback] = useState(initial);
  const raw = useSyncExternalStore(
    useCallback((cb: () => void) => subscribe(key, cb), [key]),
    () => read(key),
    () => null
  );
  const loaded = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const value = useMemo(() => parse(raw, fallback), [raw, fallback]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = parse(read(key), fallback);
      const value = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
      write(key, JSON.stringify(value));
    },
    [key, fallback]
  );
  return [value, update, loaded] as const;
}
