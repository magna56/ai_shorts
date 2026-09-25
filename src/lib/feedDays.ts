import type { Story } from "../data/stories";

/** Editorial day for a pass. A later pass the same day keeps this date. */
export function editorialDate(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function shiftDate(iso: string, days: number): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function feedDates(stories: Story[]): string[] {
  return [...new Set(stories.map((story) => story.feedDate).filter((date): date is string => Boolean(date)))].sort(
    (a, b) => b.localeCompare(a),
  );
}

export function storiesOn(stories: Story[], date: string): Story[] {
  return stories.filter((story) => story.feedDate === date);
}

export function formatFeedDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** "Yesterday" when the previous stored day is the calendar day before this one. */
export function previousFeedLabel(date: string, previous: string): string {
  return shiftDate(date, -1) === previous ? "Yesterday" : formatFeedDate(previous);
}
