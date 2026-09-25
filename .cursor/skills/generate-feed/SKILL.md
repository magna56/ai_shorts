---
name: generate-feed
description: >-
  Generate the EngAI feed in src/data/stories.json and refuse a repeated
  story. Use this whenever the user asks to generate, curate, refresh,
  update, or write the feed, today's stories, or new cards, even if they
  never say "skill". Skip a URL already stored and the same release linked
  from another publisher.
---

# Generate the feed

Read [SOURCES.md](../../../SOURCES.md) before adding a card. Write cards into `src/data/stories.json`. Do not publish unless the user asks.

## Do not repeat a story

A story is already in the feed when either of these is true:

- `sourceUrl` matches a card after dropping the hash, the query string, and a trailing slash.
- The same release is already linked, even from another publisher. A Verge recap of a launch we already carded is a repeat. A second post about the same model, kernel, or satellite test is a repeat.

`npm run generate` skips a URL it has already stored. It does not understand that two URLs are one story. After it runs, delete any new card that repeats a story already in the file. One card per story.

Each card has `feedDate`, the editorial day in America/New_York (`YYYY-MM-DD`). A second or third pass the same day prepends new cards onto that same date. It does not replace yesterday. Yesterday stays the previous day's file.

## Steps

1. Read `src/data/stories.json` and note the URLs and the releases already covered.
2. Run `npm run generate` from the repo root. It prepends candidates and skips known URLs.
3. For a URL the feeds missed, run `npm run draft -- <url>`. Still reject it when the story is already in the file.
4. Rewrite every new card. Do not leave vendor titles, nav text, or "Subscribe" / "Sign in" in `summary` or `whyItMatters`.
5. Run `npm run check-feed`. It fails when two cards share a URL. Fix that before stopping.

## What a card contains

- **Headline.** The decision to remember.
- **Summary.** About 60 words. What shipped. A number only when the page states it.
- **forEngineers.** Shown as "For a software engineer." Map the idea onto a system the reader already runs. On a The AI Commit lab card, use that section from the post.
- **whyItMatters.** What an engineer should do differently.
- **sourceUrl.** The original lab post, changelog, paper, or repo. Not a homepage. Not a digest.

Order a pass the way SOURCES.md says: today's lab, a model, a different publisher, a tool, research, then at most a few news cards. At most two cards from one publisher. If a seat is empty, leave it empty.

Skip funding, personnel, IPOs, legal fights, revenue claims, consumer tips, and policy unless it blocks shipping.
