#!/usr/bin/env node
/**
 * Prepend new cards to src/data/stories.json.
 *
 * Reads standing RSS feeds, skips URLs already in the feed, and skips
 * posts that are funding, policy, or community news. A card is added only
 * when the article page has a concrete sentence (a number, an API, a flag,
 * a price). Each run adds 10 to 12 cards, newest first, skipping URLs
 * already in the file.
 *
 * Rule: the latest theaicommit.com lab is always one of those cards when
 * its URL is not already in the file. It is not dropped by the news filters.
 * At most 3 of the new cards come from news sites. The rest are original
 * articles from labs, tools, and research blogs.
 *
 *   npm run generate
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const storiesPath = join(root, "src/data/stories.json");
const MIN_NEW = 10;
const MAX_NEW = 12;
/** News sites stay the smaller lane. The rest of a run is original articles. */
const MAX_NEWS = 3;
const MAX_AGE_MS = 45 * 24 * 60 * 60 * 1000;

/** No RSS. Checked every run so a breakout is not crowded out by changelog posts. */
const DIRECT = [
  {
    link: "https://research.meta.ai/blog/introducing-muse-spark-1-3",
    title: "Introducing Muse Spark 1.3",
    description:
      "Muse Spark 1.3 uses about 20% fewer tool calls and 25% fewer tokens than 1.2 on coding agents. It is available in Muse Code and the Meta Model API.",
    published: new Date("2026-09-02T12:00:00Z"),
    category: "Models",
    sourceName: "Meta AI",
    color: "#0B3D5C",
  },
  {
    link: "https://typesafe.ai/blog/introducing-system-one-models-and-jev",
    title: "Introducing System One Models and Jev",
    description:
      "Jev returns a typed choice, score, or probability instead of prose. Use it for routing, classification, and checks inside an agent loop.",
    published: new Date("2026-09-15T12:00:00Z"),
    category: "Models",
    sourceName: "TypeSafe",
    color: "#0B3D5C",
  },
];

const AIC_FEED = {
  url: "https://theaicommit.com/feed.xml",
  category: "Research",
  sourceName: "The AI Commit",
  color: "#4A1942",
  role: "publisher",
};

const FEEDS = [
  {
    url: "https://openai.com/news/rss.xml",
    category: "Models",
    sourceName: "OpenAI",
    color: "#0B3D5C",
    allowCategory: /^(Product|Research|Engineering|API|Safety|Release)$/i,
    denyTitle: /\bads?\b/i,
  },
  {
    url: "https://pytorch.org/blog/feed.xml",
    category: "Tools",
    sourceName: "PyTorch",
    color: "#3D2914",
    match: /vllm|llm|transformer|gpu|inferen|model/i,
  },
  {
    url: "https://blog.google/rss/",
    category: "Models",
    sourceName: "Google",
    color: "#102A43",
    match: /gemini|deepmind|\bmodel\b/i,
    denyTitle: /vids|anyone can|stunning/i,
  },
  {
    url: "https://cursor.com/changelog/rss.xml",
    category: "Tools",
    sourceName: "Cursor",
    color: "#3D2914",
  },
  {
    url: "https://huggingface.co/blog/feed.xml",
    category: "Models",
    sourceName: "Hugging Face",
    color: "#0B3D5C",
    role: "publisher",
    match:
      /model|llm|train|inferen|dataset|agent|vllm|gpu|transformer|llama|token|benchmark|fine-tun|quant|vision|encoder|gradio|mlx|grpo|weight/i,
    denyTitle: /joins hugging face/i,
  },
  {
    url: "https://deepmind.google/blog/rss.xml",
    category: "Research",
    sourceName: "Google DeepMind",
    color: "#4A1942",
  },
  {
    url: "https://github.blog/changelog/feed/",
    category: "Tools",
    sourceName: "GitHub",
    color: "#3D2914",
    role: "publisher",
    match: /copilot|agent|model|ai\b|llm/i,
  },
  {
    url: "https://www.microsoft.com/en-us/research/feed/",
    category: "Research",
    sourceName: "Microsoft Research",
    color: "#4A1942",
    role: "publisher",
    match: /phi|language model|machine learning|multimodal|agent|reasoning|llm/i,
  },
  {
    url: "https://qwenlm.github.io/blog/index.xml",
    category: "Models",
    sourceName: "Qwen",
    color: "#0B3D5C",
    role: "publisher",
  },
  {
    url: "https://simonwillison.net/atom/everything/",
    category: "Tools",
    sourceName: "Simon Willison",
    color: "#3D2914",
    role: "publisher",
    match: /llm|model|gpt|claude|gemini|agent|ai\b/i,
  },
  {
    url: "https://www.interconnects.ai/feed",
    category: "Research",
    sourceName: "Interconnects",
    color: "#4A1942",
    role: "publisher",
  },
  {
    url: "https://www.latent.space/feed",
    category: "Research",
    sourceName: "Latent Space",
    color: "#4A1942",
    role: "publisher",
  },
  {
    url: "https://jack-clark.net/feed/",
    category: "Research",
    sourceName: "Import AI",
    color: "#4A1942",
    role: "publisher",
  },
  {
    url: "https://lilianweng.github.io/index.xml",
    category: "Research",
    sourceName: "Lilian Weng",
    color: "#4A1942",
    role: "publisher",
  },
  {
    url: "https://magazine.sebastianraschka.com/feed",
    category: "Research",
    sourceName: "Sebastian Raschka",
    color: "#4A1942",
    role: "publisher",
  },
  {
    url: "https://bair.berkeley.edu/blog/feed.xml",
    category: "Research",
    sourceName: "BAIR",
    color: "#4A1942",
    role: "publisher",
  },
  {
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    category: "Platforms",
    sourceName: "TechCrunch",
    color: "#102A43",
    role: "news",
  },
  {
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    category: "Platforms",
    sourceName: "The Verge",
    color: "#102A43",
    role: "news",
  },
  {
    url: "https://venturebeat.com/category/ai/feed/",
    category: "Platforms",
    sourceName: "VentureBeat",
    color: "#102A43",
    role: "news",
  },
  {
    url: "https://www.technologyreview.com/topic/artificial-intelligence/feed/",
    category: "Research",
    sourceName: "MIT Technology Review",
    color: "#4A1942",
    role: "news",
  },
  {
    url: "https://arstechnica.com/ai/feed/",
    category: "Platforms",
    sourceName: "Ars Technica",
    color: "#102A43",
    role: "news",
  },
  {
    url: "https://www.wired.com/feed/tag/ai/latest/rss",
    category: "Platforms",
    sourceName: "Wired",
    color: "#102A43",
    role: "news",
  },
  {
    url: "https://the-decoder.com/feed/",
    category: "Models",
    sourceName: "The Decoder",
    color: "#0B3D5C",
    role: "news",
  },
  {
    url: "https://www.marktechpost.com/feed/",
    category: "Models",
    sourceName: "MarkTechPost",
    color: "#0B3D5C",
    role: "news",
  },
  {
    url: "https://importai.substack.com/feed",
    category: "Research",
    sourceName: "Import AI",
    color: "#4A1942",
    role: "news",
  },
];

/** Pages with no feed. Newest links on the index are checked every run. */
const INDEXES = [
  {
    url: "https://www.deeplearning.ai/the-batch/",
    sourceName: "DeepLearning.AI",
    category: "Research",
    color: "#4A1942",
    role: "publisher",
    accept: (href) => {
      const slug = href.split("/").filter(Boolean).pop() || "";
      return (
        /deeplearning\.ai\/the-batch\//.test(href) &&
        slug.includes("-") &&
        slug.length > 16
      );
    },
  },
  {
    url: "https://thinkingmachines.ai/news/",
    sourceName: "Thinking Machines",
    category: "Models",
    color: "#0B3D5C",
    role: "publisher",
    accept: (href) => {
      const slug = href.split("/").filter(Boolean).pop() || "";
      return (
        /thinkingmachines\.ai\/news\//.test(href) &&
        slug.includes("-") &&
        !/grant/.test(slug)
      );
    },
  },
  {
    url: "https://www.perplexity.ai/hub",
    sourceName: "Perplexity",
    category: "Platforms",
    color: "#102A43",
    role: "publisher",
    accept: (href) => /perplexity\.ai\/hub\/[^/?#]+/.test(href),
  },
  {
    url: "https://vllm.ai/blog",
    sourceName: "vLLM",
    category: "Tools",
    color: "#3D2914",
    role: "publisher",
    accept: (href) => /vllm\.ai\/blog\/20\d{2}-/.test(href),
  },
];

const DENY_TITLE =
  /\b(funding|valuation|academy|remarks|policy|secures|raises|series [a-d]|conference|pytorchcon|training|financial services|scaling|code intelligence|billion users)\b/i;
/** A card has to be a model, tool, research, or platform development, not a general post. */
const DEVELOPMENT =
  /model|gpt|claude|gemini|llama|qwen|grok|muse|jev|inkling|phi|agent|api|benchmark|release|launch|ship|inferen|vllm|weight|checkpoint|context|token|price|latency|eval|copilot|cursor|perplexity|open-weight|fine-tun|transcri|batch|deeplearning/i;
const CONCRETE = /\d|API|available|enable|flag|price|cost|token|benchmark/i;

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

const stories = JSON.parse(readFileSync(storiesPath, "utf8"));
const known = new Set(stories.map((story) => normalize(story.sourceUrl)));
const added = [];
const candidates = [];

for (const page of DIRECT) {
  if (known.has(normalize(page.link))) continue;
  candidates.push({ feed: { ...page, role: "publisher" }, item: page });
}

let aicCard = null;
try {
  const xml = await get(AIC_FEED.url);
  const latest = parseItems(xml).find((item) => item.link && item.title && item.published);
  if (latest && !known.has(normalize(latest.link))) {
    aicCard = await toCard(latest, AIC_FEED, { required: true });
    if (!aicCard) console.error(`Missed The AI Commit: ${latest.link}`);
  }
} catch (error) {
  console.error(`Feed failed: ${AIC_FEED.url} (${error.message})`);
}

for (const feed of FEEDS) {
  let xml = "";
  try {
    xml = await get(feed.url);
  } catch (error) {
    console.error(`Feed failed: ${feed.url} (${error.message})`);
    continue;
  }
  const fresh = parseItems(xml)
    .filter((item) => item.link && item.title && item.published)
    .filter((item) => Date.now() - item.published.getTime() <= MAX_AGE_MS)
    .filter((item) => !known.has(normalize(item.link)))
    .filter((item) => !DENY_TITLE.test(item.title))
    .filter((item) => !feed.denyTitle?.test(item.title))
    .filter((item) => !/\/ads?(\/|$)|chatgpt-ads/i.test(item.link))
    .filter((item) => !feed.allowCategory || feed.allowCategory.test(item.category))
    .filter((item) => !feed.match || feed.match.test(`${item.title} ${item.link} ${item.description}`))
    .filter((item) => DEVELOPMENT.test(`${item.title} ${item.description}`));
  for (const item of fresh) candidates.push({ feed, item });
}

for (const index of INDEXES) {
  try {
    const html = await get(index.url);
    const hrefs = [...html.matchAll(/href=["']([^"']+)["']/gi)].map((match) =>
      abs(index.url, match[1]),
    );
    const seen = new Set();
    let count = 0;
    for (const href of hrefs) {
      if (!href || seen.has(normalize(href)) || !index.accept(href)) continue;
      seen.add(normalize(href));
      const title = decode(href.split("/").filter(Boolean).pop() || "").replace(/[-_]+/g, " ");
      candidates.push({
        feed: index,
        item: {
          link: href,
          title,
          description: `${index.sourceName} ${title}`,
          category: "",
          published: new Date(),
        },
      });
      count += 1;
      if (count >= 3) break;
    }
  } catch (error) {
    console.error(`Index failed: ${index.url} (${error.message})`);
  }
}

const SLOTS = [
  "aic",
  "models",
  "tools",
  "research",
  "original",
  "news",
  "original",
  "original",
  "news",
  "original",
  "original",
  "news",
];

candidates.sort((a, b) => b.item.published - a.item.published);
const counts = {};

if (aicCard) {
  added.push(aicCard);
  counts[aicCard.sourceName] = 1;
  known.add(normalize(aicCard.sourceUrl));
}

for (const slot of SLOTS) {
  if (slot === "aic" || added.length >= MAX_NEW) continue;
  const card = (await pick(slot, true)) || (slot === "news" ? null : await pick(slot, false));
  if (!card) continue;
  added.push(card);
}

async function pick(slot, differentPublisher) {
  for (let i = 0; i < candidates.length; i += 1) {
    const entry = candidates[i];
    const source = entry.feed.sourceName;
    const isNews = entry.feed.role === "news";
    if ((counts[source] || 0) >= 2) continue;
    const previous = added.at(-1)?.sourceName;
    if (differentPublisher && previous && source === previous) continue;
    if (slot === "news") {
      if (!isNews || recap(entry.item.title, added)) continue;
    } else if (isNews) {
      continue;
    } else if (slot === "models" && entry.feed.category !== "Models") {
      continue;
    } else if (slot === "tools" && entry.feed.category !== "Tools") {
      continue;
    } else if (
      slot === "research" &&
      (entry.feed.category !== "Research" || source === "The AI Commit")
    ) {
      continue;
    }
    candidates.splice(i, 1);
    i -= 1;
    const card = await toCard(entry.item, entry.feed);
    if (!card) continue;
    counts[source] = (counts[source] || 0) + 1;
    known.add(normalize(card.sourceUrl));
    return card;
  }
  return null;
}

function recap(title, cards) {
  const words = tokens(title);
  return cards.some((card) => {
    const seen = tokens(card.headline);
    let shared = 0;
    for (const word of words) if (seen.has(word)) shared += 1;
    return shared >= 2;
  });
}

function tokens(value) {
  const skip = new Set(["with", "from", "that", "this", "your", "into", "about", "after", "their"]);
  return new Set(
    value
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length > 3 && !skip.has(word)),
  );
}

if (added.length < MIN_NEW) {
  console.error(`Only ${added.length} new cards. Need ${MIN_NEW}–${MAX_NEW}.`);
}

writeFileSync(storiesPath, `${JSON.stringify([...added, ...stories], null, 2)}\n`);
for (const card of added) console.log(`Added ${card.id} — ${card.headline}`);

async function toCard(item, feed, { required = false } = {}) {
  let html = "";
  let finalUrl = item.link;
  try {
    const response = await fetch(item.link, {
      headers: { "user-agent": UA, accept: "text/html" },
      redirect: "follow",
    });
    if (!response.ok) return null;
    html = await response.text();
    finalUrl = response.url || item.link;
  } catch {
    return null;
  }
  if (known.has(normalize(finalUrl))) return null;

  const body = articleText(html);
  let excerpt =
    (/log in|try chatgpt|opens in a new window|see all in/i.test(body) || body.length < 80) &&
    item.description
      ? item.description
      : body;
  if (/sign in/i.test(excerpt)) {
    excerpt = excerpt.replace(/^[\s\S]*?\bChangelog\s+/i, "");
  }
  const sentence = excerpt
    .split(/(?<=[.!?])\s+/)
    .find((line) => CONCRETE.test(line) && line.length > 40 && line.length < 220);
  const junk = /log in|try chatgpt|see all in/i.test(excerpt);
  if ((!sentence || junk) && !required) return null;
  const why = sentence && !junk ? sentence : item.description || words(excerpt, 40);
  if (!why) return null;

  const imageUrl = abs(finalUrl, meta(html, "og:image") || meta(html, "twitter:image"));
  const headline = item.title
    .replace(/^(Introducing|Announcing)\s+/i, "")
    .replace(/\s+[|–—-]\s+.*$/, "")
    .trim();

  return {
    id: slug(finalUrl, stories, added),
    category: feed.category,
    headline,
    summary: required && item.description ? words(item.description, 60) : words(excerpt, 60),
    whyItMatters: required && item.description ? item.description : why,
    sourceName: feed.sourceName,
    sourceUrl: finalUrl,
    ...(imageUrl ? { imageUrl } : {}),
    imageColor: feed.color,
    publishedLabel: label(item.published),
  };
}

function parseItems(xml) {
  return xml
    .split(/<(?:item|entry)[\s>]/i)
    .slice(1)
    .map((chunk) => {
      const pub = text(chunk, "pubDate") || text(chunk, "updated") || text(chunk, "published");
      const published = pub ? new Date(pub) : null;
      const linkText = text(chunk, "link");
      const href = chunk.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1] ?? "";
      return {
        title: text(chunk, "title"),
        link: linkText.startsWith("http") ? linkText : href,
        category: text(chunk, "category"),
        description: text(chunk, "description") || text(chunk, "summary"),
        published: published && !Number.isNaN(published.getTime()) ? published : null,
      };
    });
}

function text(chunk, tag) {
  const match = chunk.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  if (!match) return "";
  return decode(match[1].replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function articleText(source) {
  const stripped = source
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ");
  return [...stripped.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) =>
      decode(match[1].replace(/<[^>]+>/g, " "))
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter((paragraph) => paragraph.length > 40)
    .join(" ");
}

function words(value, count) {
  const taken = value.split(/\s+/).slice(0, count).join(" ");
  const end = taken.lastIndexOf(".");
  return end > 80 ? taken.slice(0, end + 1) : taken;
}

function label(date) {
  const days = Math.floor((Date.now() - date.getTime()) / (24 * 60 * 60 * 1000));
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function slug(url, current, extra) {
  const base =
    new URL(url).pathname
      .split("/")
      .filter(Boolean)
      .pop()
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "story";
  const ids = new Set([...current, ...extra].map((story) => story.id));
  let id = base;
  let n = 2;
  while (ids.has(id)) id = `${base}-${n++}`;
  return id;
}

function normalize(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.search = "";
    return parsed.href.replace(/\/$/, "");
  } catch {
    return url;
  }
}

function meta(source, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${escaped}["']`, "i"),
  ];
  for (const pattern of patterns) {
    const match = source.match(pattern);
    if (match?.[1]) return decode(match[1]);
  }
  return "";
}

function abs(base, value) {
  if (!value) return "";
  try {
    return new URL(value, base).href;
  } catch {
    return "";
  }
}

function decode(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

async function get(url) {
  const response = await fetch(url, {
    headers: { "user-agent": UA, accept: "application/rss+xml, application/xml, text/xml" },
    redirect: "follow",
  });
  if (!response.ok) throw new Error(String(response.status));
  return response.text();
}
