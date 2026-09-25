import { useCallback, useEffect, useMemo, useState } from "react";
import { AppState } from "react-native";
import { feedDates, storiesOn } from "../lib/feedDays";
import { fetchFeedDay, fetchFeedIndex } from "../lib/remoteFeed";
import type { Story } from "../data/stories";

/**
 * Opens on the newest dated feed. A later pass the same day replaces that
 * day's file. Yesterday is a separate file the reader can open.
 * Bundled cards stay up when the network does not answer.
 */
export function usePublishedFeed(bundled: Story[]) {
  const bundledDates = useMemo(() => feedDates(bundled), [bundled]);
  const [dates, setDates] = useState(bundledDates);
  const [date, setDate] = useState(bundledDates[0] ?? "");
  const [remote, setRemote] = useState<Record<string, Story[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyDay = useCallback((day: string, stories: Story[] | null) => {
    if (!stories) return false;
    setRemote((current) => ({ ...current, [day]: stories }));
    return true;
  }, []);

  const load = useCallback(
    (day: string) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      setLoading(true);
      setError(null);
      fetchFeedIndex(controller.signal)
        .then(async (index) => {
          if (controller.signal.aborted) return;
          const nextDates = index ?? bundledDates;
          if (index) setDates(index);
          const target = nextDates.includes(day) ? day : (nextDates[0] ?? day);
          if (target !== day) setDate(target);
          const stories = target ? await fetchFeedDay(target, controller.signal) : null;
          if (controller.signal.aborted) return;
          if (!applyDay(target, stories) && !storiesOn(bundled, target).length) {
            setError("Couldn't load that day");
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) setError("Couldn't load that day");
        })
        .finally(() => {
          clearTimeout(timer);
          if (!controller.signal.aborted) setLoading(false);
        });
      return controller;
    },
    [applyDay, bundled, bundledDates],
  );

  useEffect(() => {
    let current = load(date);
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") return;
      current.abort();
      current = load(date);
    });
    return () => {
      current.abort();
      sub.remove();
    };
  }, [date, load]);

  const stories = remote[date] ?? storiesOn(bundled, date);
  const latestDate = dates[0] ?? "";
  const previousDate = dates[dates.indexOf(date) + 1] ?? null;

  return {
    stories,
    date,
    dates,
    latestDate,
    previousDate,
    loading,
    error,
    selectDate: setDate,
  };
}
