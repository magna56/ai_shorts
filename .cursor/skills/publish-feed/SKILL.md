---
name: publish-feed
description: >-
  Publish the curated EngAI feed to Cloudflare R2, purge the CDN URL, and
  notify registered iPhones. Use when the user says to publish, ship, or push
  today's feed, or after a curation pass is approved.
---

# Publish the feed

The agent publishes only cards that are already written in `src/data/stories.json`. Do not scrape, and do not invent a card in this step.

## Before you run

`CLOUDFLARE_API_TOKEN` must be in `.env`, which is gitignored. Never print the token. Never commit it.

The token needs, on account `573958e0e782dd175caf762d7e255da8` and zone `theaicommit.com`:

- Workers R2 Storage: Edit
- Workers Scripts: Edit
- D1: Edit
- DNS: Edit
- Zone: Read
- Cache Purge: Purge

If the upload returns a permission error, stop and ask for those. Do not try a second token from the chat.

## Publish

From the repo root, with `.env` loaded:

```bash
node scripts/publish-feed.mjs
```

That writes `src/data/stories.json` to R2 object `engai/feed.json`, purges `https://engai.theaicommit.com/feed.json`, then notifies phones when `FEED_NOTIFY_URL` and `PUBLISH_SECRET` are set.

The iOS app already falls back to the bundled copy when that URL is down. A publish does not need a new EAS build.
