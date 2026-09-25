import type { Story } from "../data/stories";

export const FEED_URL =
  process.env.EXPO_PUBLIC_FEED_URL ?? "https://engai.theaicommit.com/feed.json";

const FEED_ORIGIN = FEED_URL.replace(/\/feed\.json$/, "");

export function feedIndexUrl(): string {
  return `${FEED_ORIGIN}/feeds/index.json`;
}

export function feedDayUrl(date: string): string {
  return `${FEED_ORIGIN}/feeds/${date}.json`;
}

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

export function parseFeedIndex(value: unknown): string[] | null {
  if (!value || typeof value !== "object") return null;
  const days = (value as { days?: unknown }).days;
  if (!Array.isArray(days) || days.length === 0) return null;
  const dates: string[] = [];
  for (const day of days) {
    if (typeof day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day)) dates.push(day);
    else if (day && typeof day === "object" && typeof (day as { date?: unknown }).date === "string") {
      const date = (day as { date: string }).date;
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) dates.push(date);
    }
  }
  return dates.length ? dates : null;
}

async function fetchJson(url: string, signal?: AbortSignal): Promise<unknown | null> {
  const response = await fetch(url, {
    headers: { accept: "application/json" },
    signal,
  });
  if (!response.ok) return null;
  return response.json();
}

export async function fetchFeedIndex(signal?: AbortSignal): Promise<string[] | null> {
  const json = await fetchJson(feedIndexUrl(), signal);
  if (!json) return null;
  return parseFeedIndex(json);
}

export async function fetchFeedDay(date: string, signal?: AbortSignal): Promise<Story[] | null> {
  const json = await fetchJson(feedDayUrl(date), signal);
  if (!json) return null;
  return parseFeed(json);
}

export async function fetchPublishedFeed(signal?: AbortSignal): Promise<Story[] | null> {
  const json = await fetchJson(FEED_URL, signal);
  if (!json) return null;
  return parseFeed(json);
}
