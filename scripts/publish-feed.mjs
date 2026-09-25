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

const body = readFileSync(join(root, "src/data/stories.json"));
const auth = { Authorization: `Bearer ${token}` };

const put = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${account}/r2/buckets/${bucket}/objects/${key}`,
  {
    method: "PUT",
    headers: {
      ...auth,
      "content-type": "application/json",
      // JSON is not cached until a zone cache rule marks /feed.json eligible.
      "cache-control": "public, max-age=300",
    },
    body,
  },
);
const putJson = await put.json().catch(() => ({}));
if (!put.ok || putJson.success === false) {
  console.error("R2 upload failed.", put.status, JSON.stringify(putJson.errors ?? putJson));
  process.exit(1);
}
console.log(`Stored ${key} in ${bucket}`);

const purge = await fetch(`https://api.cloudflare.com/client/v4/zones/${zone}/purge_cache`, {
  method: "POST",
  headers: { ...auth, "content-type": "application/json" },
  body: JSON.stringify({ files: [publicUrl] }),
});
const purgeJson = await purge.json().catch(() => ({}));
if (!purge.ok || purgeJson.success === false) {
  console.error("CDN purge failed.", purge.status, JSON.stringify(purgeJson.errors ?? purgeJson));
  console.error("feed.json stays uncached until a cache rule marks it eligible.");
} else {
  console.log(`Purged ${publicUrl}`);
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
