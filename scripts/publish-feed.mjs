#!/usr/bin/env node
/**
 * Publish the curated feed.
 * Writes src/data/stories.json to R2, purges the CDN URL, then notifies phones.
 *
 * Requires CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, PUBLISH_SECRET.
 * Optional: FEED_NOTIFY_URL, FEED_PUBLIC_URL, CLOUDFLARE_ZONE_ID, R2_BUCKET.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const account = process.env.CLOUDFLARE_ACCOUNT_ID ?? "573958e0e782dd175caf762d7e255da8";
const zone = process.env.CLOUDFLARE_ZONE_ID ?? "c5dbbddffb2f1b349cbed664b3491916";
const bucket = process.env.R2_BUCKET ?? "engai";
const key = "feed.json";
const publicUrl = process.env.FEED_PUBLIC_URL ?? "https://engai.theaicommit.com/feed.json";
const token = process.env.CLOUDFLARE_API_TOKEN;
const notifyUrl = process.env.FEED_NOTIFY_URL;
const publishSecret = process.env.PUBLISH_SECRET;

if (!token) {
  console.error("CLOUDFLARE_API_TOKEN is missing. Put it in .env. Do not commit it.");
  process.exit(1);
}

const stories = JSON.parse(readFileSync(join(root, "src/data/stories.json"), "utf8"));
const auth = { Authorization: `Bearer ${token}` };
const byDate = new Map();
for (const story of stories) {
  const date = story.feedDate;
  if (!date) continue;
  const list = byDate.get(date) ?? [];
  list.push(story);
  byDate.set(date, list);
}
const dates = [...byDate.keys()].sort((a, b) => b.localeCompare(a));
const latest = dates[0];
const origin = publicUrl.replace(/\/feed\.json$/, "");
const index = {
  days: dates.map((date) => ({
    date,
    count: byDate.get(date).length,
  })),
};
const uploads = [
  { key, body: JSON.stringify(byDate.get(latest) ?? []), url: publicUrl },
  {
    key: "feeds/index.json",
    body: JSON.stringify(index),
    url: `${origin}/feeds/index.json`,
  },
  ...dates.map((date) => ({
    key: `feeds/${date}.json`,
    body: JSON.stringify(byDate.get(date)),
    url: `${origin}/feeds/${date}.json`,
  })),
];

for (const file of uploads) {
  const put = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account}/r2/buckets/${bucket}/objects/${file.key}`,
    {
      method: "PUT",
      headers: {
        ...auth,
        "content-type": "application/json",
        "cache-control": "public, max-age=300",
      },
      body: file.body,
    },
  );
  const putJson = await put.json().catch(() => ({}));
  if (!put.ok || putJson.success === false) {
    console.error("R2 upload failed.", file.key, put.status, JSON.stringify(putJson.errors ?? putJson));
    process.exit(1);
  }
  console.log(`Stored ${file.key}`);
}

const purge = await fetch(`https://api.cloudflare.com/client/v4/zones/${zone}/purge_cache`, {
  method: "POST",
  headers: { ...auth, "content-type": "application/json" },
  body: JSON.stringify({ files: uploads.map((file) => file.url) }),
});
const purgeJson = await purge.json().catch(() => ({}));
if (!purge.ok || purgeJson.success === false) {
  console.error("CDN purge failed.", purge.status, JSON.stringify(purgeJson.errors ?? purgeJson));
  console.error("feed.json stays uncached until a cache rule marks it eligible.");
} else {
  console.log(`Purged ${uploads.length} files`);
}

if (notifyUrl && publishSecret) {
  const notify = await fetch(notifyUrl, {
    method: "POST",
    headers: { authorization: `Bearer ${publishSecret}` },
  });
  if (!notify.ok) {
    console.error("Push notify failed.", notify.status, await notify.text());
    process.exit(1);
  }
  console.log("Notified phones.");
} else {
  console.log("FEED_NOTIFY_URL or PUBLISH_SECRET unset. Stored and purged. No push sent.");
}
