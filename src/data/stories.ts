export type Category = "All" | "Models" | "Tools" | "Research" | "Platforms";

export type Story = {
  id: string;
  category: Exclude<Category, "All">;
  headline: string;
  summary: string;
  whyItMatters: string;
  sourceName: string;
  sourceUrl: string;
  deepLabUrl?: string;
  /** Remote article/OG image. Local bundle or generated category art used if missing/fails. */
  imageUrl?: string;
  imageColor: string;
  publishedLabel: string;
};

export const CATEGORIES: Category[] = [
  "All",
  "Models",
  "Tools",
  "Research",
  "Platforms",
];

/** Seed feed — TLDR-density AI engineering radar for MVP. */
export const STORIES: Story[] = [
  {
    id: "1",
    category: "Platforms",
    headline: "Meta unveils Muse device at AI summit",
    summary:
      "Meta showed Muse, an on-device AI hardware play aimed at lower-latency multimodal assistants. The pitch: run more inference locally, cut cloud round-trips, and ship always-on context for builders testing edge agents.",
    whyItMatters:
      "If Muse ships with usable APIs, on-device multimodal demos stop being lab-only and become something you can prototype against.",
    sourceName: "Meta AI Blog",
    sourceUrl: "https://ai.meta.com/",
    imageColor: "#1B4332",
    publishedLabel: "Today",
  },
  {
    id: "2",
    category: "Models",
    headline: "Microsoft ships a leaner Phi model drop",
    summary:
      "Microsoft refreshed Phi with stronger reasoning-per-parameter for local and edge workloads. Early numbers target coding and tool-use tasks where small models are finally competitive with larger cloud endpoints.",
    whyItMatters:
      "Cheap, fast SLMs change default architecture choices for agent loops, offline IDE features, and cost-sensitive products.",
    sourceName: "Microsoft Research",
    sourceUrl: "https://www.microsoft.com/en-us/research/",
    imageColor: "#0B3D5C",
    publishedLabel: "Today",
  },
  {
    id: "3",
    category: "Tools",
    headline: "Agent harness upgrades land in coding IDEs",
    summary:
      "New agent harnesses tighten the loop between plan, edit, test, and retry. The practical win is fewer stalled sessions and clearer diffs when an agent touches a multi-file codebase.",
    whyItMatters:
      "Harness quality is becoming as important as the underlying model for real software delivery.",
    sourceName: "GitHub Blog",
    sourceUrl: "https://github.blog/",
    deepLabUrl: "https://theaicommit.com",
    imageColor: "#3D2914",
    publishedLabel: "Yesterday",
  },
  {
    id: "4",
    category: "Research",
    headline: "Open weights redraw the speed–quality frontier",
    summary:
      "A fresh open-weight release posts strong reasoning scores while staying cheap to serve. Labs and indie teams are already swapping closed endpoints for self-hosted stacks on eval suites that matter for shipping.",
    whyItMatters:
      "When open models close the gap on your evals, vendor lock-in and unit economics both move overnight.",
    sourceName: "Hugging Face",
    sourceUrl: "https://huggingface.co/blog",
    imageColor: "#4A1942",
    publishedLabel: "Yesterday",
  },
  {
    id: "5",
    category: "Tools",
    headline: "Eval suites start measuring agent reliability",
    summary:
      "New public evals score agents on task completion, recovery from failure, and tool correctness—not just chat quality. Early leaderboards show wide spreads between demos that look polished and agents that finish work.",
    whyItMatters:
      "If you ship agents, “looks smart” is no longer enough; completion under failure modes is the metric that sticks.",
    sourceName: "Papers with Code",
    sourceUrl: "https://paperswithcode.com/",
    imageColor: "#1F2A44",
    publishedLabel: "2d ago",
  },
  {
    id: "6",
    category: "Models",
    headline: "Frontier labs push computer-use agents further",
    summary:
      "Updated computer-use models navigate UIs with fewer dead ends: better screenshot grounding, clearer action traces, and tighter retries when clicks miss. Still brittle, but usable for constrained internal workflows.",
    whyItMatters:
      "Desktop automation is moving from demo reels to narrow production paths—worth a spike if your ops stack is click-heavy.",
    sourceName: "Anthropic",
    sourceUrl: "https://www.anthropic.com/news",
    imageColor: "#2C1810",
    publishedLabel: "2d ago",
  },
  {
    id: "7",
    category: "Platforms",
    headline: "Cloud providers cut latency for token-heavy agents",
    summary:
      "Inference platforms are shipping lower-latency routes and better batching for multi-step agent traffic. The quiet story is cost: long tool loops get less punishing when TTFT and cache hits improve.",
    whyItMatters:
      "Agent products live or die on loop cost. Infra wins here show up directly in unit economics.",
    sourceName: "AWS Machine Learning",
    sourceUrl: "https://aws.amazon.com/blogs/machine-learning/",
    imageColor: "#102A43",
    publishedLabel: "3d ago",
  },
  {
    id: "8",
    category: "Research",
    headline: "Speculative decoding speeds open model serving",
    summary:
      "New speculative decoding recipes cut token latency for popular open models without retraining. Teams running self-hosted endpoints report snappier chat and agent turns at the same GPU budget.",
    whyItMatters:
      "If you self-host, serving tricks can beat waiting for the next model drop.",
    sourceName: "arXiv",
    sourceUrl: "https://arxiv.org/list/cs.LG/recent",
    imageColor: "#1A3328",
    publishedLabel: "3d ago",
  },
  {
    id: "9",
    category: "Tools",
    headline: "MCP-style tool bridges expand across stacks",
    summary:
      "More IDEs and agent runtimes are adopting shared tool protocols so one connector works across clients. That reduces one-off glue code when you wire browsers, repos, and internal APIs into agents.",
    whyItMatters:
      "Standard tool interfaces compound—write once, reuse across the agents your team actually runs.",
    sourceName: "Model Context Protocol",
    sourceUrl: "https://modelcontextprotocol.io/",
    imageColor: "#243B55",
    publishedLabel: "4d ago",
  },
  {
    id: "10",
    category: "Models",
    headline: "Multimodal coding models improve screenshot→UI",
    summary:
      "Updated multimodal coding models turn screenshots and design mocks into closer first drafts. Diff quality is still uneven, but layout scaffolding and component guesses are noticeably less random.",
    whyItMatters:
      "Frontend spikes get cheaper when the model’s first pass is closer to your design system.",
    sourceName: "OpenAI",
    sourceUrl: "https://openai.com/news/",
    deepLabUrl: "https://theaicommit.com",
    imageColor: "#0F2922",
    publishedLabel: "4d ago",
  },
];
