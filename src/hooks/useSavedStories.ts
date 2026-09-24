import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const KEY = "aic-shorts-saved";

export function useSavedStories() {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (!cancelled && raw) {
          setSavedIds(new Set(JSON.parse(raw) as string[]));
        }
      } catch {
        // Local-only MVP; ignore storage errors.
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (next: Set<string>) => {
    setSavedIds(next);
    try {
      await AsyncStorage.setItem(KEY, JSON.stringify([...next]));
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(
    (id: string) => {
      const next = new Set(savedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      void persist(next);
    },
    [persist, savedIds],
  );

  return { savedIds, toggle, ready };
}
