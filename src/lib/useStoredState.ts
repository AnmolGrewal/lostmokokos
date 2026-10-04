import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useState backed by localStorage. Starts from `initial` (so server and first client render match),
 * then loads the stored value after mount. `loaded` tells you when the stored value is in.
 */
export function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  const initialRef = useRef(initial);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) setValue(JSON.parse(stored) as T);
    } catch {
      setValue(initialRef.current);
    }
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or blocked — keep working in memory
    }
  }, [key, value, loaded]);

  const update = useCallback((next: T | ((prev: T) => T)) => setValue(next), []);
  return [value, update, loaded] as const;
}
