#!/usr/bin/env node
/**
 * Pull the facts for one card from an article URL.
 *
 *   node scripts/draft-card.mjs https://example.com/post
 *
 * The page supplies the image and the facts. The headline, summary, and
 * "why it matters" are written after this, not copied from the vendor title.
 *
 * Headline: the decision, not the press-release title.
 * Summary: about 60 words. What shipped, and a number only if the page states it.
 * Why it matters: one or two sentences for someone who builds with this.
 * Image: og:image, then twitter:image. If both are missing, leave imageUrl
 * empty and the app uses the category cover.
 */

const CATEGORY_COLOR = {
  Models: "#0B3D5C",
  Tools: "#3D2914",
  Research: "#4A1942",
  Platforms: "#102A43",
};

const HOSTS = [
  ["openai.com", "OpenAI", "Models"],
  ["anthropic.com", "Anthropic", "Models"],
  ["blog.google", "Google", "Models"],
  ["deepmind.google", "Google DeepMind", "Research"],
  ["x.ai", "xAI", "Models"],
  ["ai.meta.com", "Meta AI", "Models"],
  ["research.meta.ai", "Meta AI", "Models"],
  ["typesafe.ai", "TypeSafe", "Models"],
  ["microsoft.com", "Microsoft Research", "Models"],
  ["mistral.ai", "Mistral", "Models"],
  ["qwen.ai", "Qwen", "Models"],
  ["cursor.com", "Cursor", "Tools"],
  ["github.blog", "GitHub", "Tools"],
  ["github.com", "GitHub", "Tools"],
  ["modelcontextprotocol.io", "Model Context Protocol", "Tools"],
  ["vllm.ai", "vLLM", "Tools"],
  ["pytorch.org", "PyTorch", "Tools"],
  ["arxiv.org", "arXiv", "Research"],
  ["nature.com", "Nature", "Research"],
  ["groq.com", "Groq", "Platforms"],
  ["fireworks.ai", "Fireworks", "Platforms"],
  ["together.ai", "Together", "Platforms"],
  ["modal.com", "Modal", "Platforms"],
  ["cloudflare.com", "Cloudflare", "Platforms"],
  ["theaicommit.com", "The AI Commit", "Research"],
];

const url = process.argv[2];
if (!url) {
  console.error("Usage: node scripts/draft-card.mjs <article-url>");
  process.exit(1);
}

const response = await fetch(url, {
  headers: {
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    accept: "text/html",
  },
  redirect: "follow",
});

if (!response.ok) {
  console.error(`Fetch failed: ${response.status} ${url}`);
  process.exit(1);
}

const html = await response.text();
const finalUrl = response.url || url;
const host = new URL(finalUrl).hostname.replace(/^www\./, "");
const known = HOSTS.find(([domain]) => host === domain || host.endsWith(`.${domain}`));

const pageTitle = meta(html, "og:title") || tagText(html, "title");
const imageUrl = abs(finalUrl, meta(html, "og:image") || meta(html, "twitter:image"));
const description = meta(html, "og:description") || meta(html, "description");
const published =
  meta(html, "article:published_time") ||
  meta(html, "publish_date") ||
  "";
const text = articleText(html);

const category = known?.[2] ?? "";
const draft = {
  sourceUrl: finalUrl,
  sourceName: known?.[1] ?? host,
  category,
  imageUrl,
  imageColor: CATEGORY_COLOR[category] ?? "#1A3328",
  published,
  pageTitle,
  description,
  excerpt: text.slice(0, 2500),
  write: {
    headline: "Decision, not the press-release title.",
    summary: "About 60 words from the excerpt. Numbers only if the page states them.",
    whyItMatters: "What an engineer should do differently.",
  },
};

console.log(JSON.stringify(draft, null, 2));

function meta(source, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']*)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${escaped}["']`,
      "i",
    ),
  ];
  for (const pattern of patterns) {
    const match = source.match(pattern);
    if (match?.[1]) return decode(match[1]);
  }
  return "";
}

function tagText(source, tag) {
  const match = source.match(new RegExp(`<${tag}[^>]*>([^<]+)</${tag}>`, "i"));
  return match ? decode(match[1]).trim() : "";
}

function articleText(source) {
  const stripped = source
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ");
  const paragraphs = [...stripped.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) =>
      decode(match[1].replace(/<[^>]+>/g, " "))
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter((paragraph) => paragraph.length > 40);
  return paragraphs.join("\n\n");
}

function abs(base, value) {
  if (!value) return "";
  try {
    return new URL(value, base).href;
  } catch {
    return value;
  }
}

function decode(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x2F;/g, "/")
    .replace(/&nbsp;/g, " ");
}
