import type { Story } from "../data/stories";

export const FEED_URL =
  process.env.EXPO_PUBLIC_FEED_URL ?? "https://engai.theaicommit.com/feed.json";

const CATEGORIES = new Set(["Models", "Tools", "Research", "Platforms"]);

export function parseFeed(value: unknown): Story[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const stories: Story[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const card = item as Story;
    if (!card.id || !card.headline || !card.summary || !card.sourceUrl) return null;
    if (!CATEGORIES.has(card.category)) return null;
    stories.push(card);
  }
  return stories;
}

export async function fetchPublishedFeed(signal?: AbortSignal): Promise<Story[] | null> {
  const response = await fetch(FEED_URL, {
    headers: { accept: "application/json" },
    signal,
  });
  if (!response.ok) return null;
  return parseFeed(await response.json());
}
