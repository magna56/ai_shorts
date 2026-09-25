import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const KEY = "aic-shorts-ritual";

type Ritual = {
  seen: string[];
};

/**
 * Remembers which cards were opened so the next visit resumes,
 * and so "caught up" means they finished this set.
 */
export function useReadingRitual(storyIds: string[]) {
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (!cancelled && raw) {
          const parsed = JSON.parse(raw) as Ritual;
          setSeen(new Set(parsed.seen));
        }
      } catch {
        // Local-only. A missing record just starts at the first card.
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const markSeen = useCallback((id: string) => {
    setSeen((current) => {
      if (current.has(id)) return current;
      const next = new Set(current);
      next.add(id);
      void AsyncStorage.setItem(KEY, JSON.stringify({ seen: [...next] }));
      return next;
    });
  }, []);

  const unseen = storyIds.filter((id) => !seen.has(id));
  const caughtUp = storyIds.length > 0 && unseen.length === 0;
  const startIndex = Math.max(0, storyIds.findIndex((id) => !seen.has(id)));

  return { ready, caughtUp, startIndex, markSeen, remaining: unseen.length };
}
