#!/usr/bin/env node
/**
 * Fail when two cards in src/data/stories.json share a source URL.
 * Hash, query string, and a trailing slash do not make a URL new.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stories = JSON.parse(readFileSync(join(root, "src/data/stories.json"), "utf8"));
const seen = new Map();
const dupes = [];

for (const story of stories) {
  const key = normalize(story.sourceUrl);
  if (!key) {
    dupes.push(`${story.id} has no sourceUrl`);
    continue;
  }
  if (!story.feedDate) dupes.push(`${story.id} has no feedDate`);
  const prior = seen.get(key);
  if (prior) dupes.push(`${story.id} repeats ${prior} (${key})`);
  else seen.set(key, story.id);
}

if (dupes.length) {
  console.error(dupes.join("\n"));
  process.exit(1);
}
console.log(`${stories.length} cards, no repeated URLs.`);

function normalize(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.search = "";
    return parsed.href.replace(/\/$/, "");
  } catch {
    return String(url).replace(/\/$/, "");
  }
}
