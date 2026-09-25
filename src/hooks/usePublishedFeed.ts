import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { fetchPublishedFeed } from "../lib/remoteFeed";
import type { Story } from "../data/stories";

/** Bundled cards first. Replace them when the CDN file loads. Keep them if it does not. */
export function usePublishedFeed(bundled: Story[]) {
  const [stories, setStories] = useState(bundled);

  useEffect(() => {
    let cancel = false;
    const load = () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      fetchPublishedFeed(controller.signal)
        .then((next) => {
          if (!cancel && next) setStories(next);
        })
        .catch(() => undefined)
        .finally(() => clearTimeout(timer));
      return controller;
    };
    let current = load();
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") return;
      current.abort();
      current = load();
    });
    return () => {
      cancel = true;
      current.abort();
      sub.remove();
    };
  }, []);

  return stories;
}
