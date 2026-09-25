# Sources we plan to monitor

Operating list for AI Commit Shorts. A card links the original page. Sensors only tell us where to look.

Three passes a day: morning, midday, late afternoon. Each pass keeps items newer than the last card. If nothing clears the bar, that pass adds nothing.

A card is about 60 words, a “why it matters,” and the article, paper, changelog, or repo. Not a homepage. Not a rewrite of another digest.

## Writing a card

From a URL on the standing list:

```bash
npm run generate
npm run draft -- https://example.com/the-article
```

`npm run generate` reads the standing RSS feeds and prepends 10 to 12 new cards to `src/data/stories.json`. It skips a URL already in the feed, and it skips funding, policy, and community posts. A card is added only when the article states something concrete. `npm run draft` is for one URL the feeds did not catch.

The script reads the page. It keeps the original URL, the publisher, a category guess, and the image (`og:image`, then `twitter:image`). If the page has no image, leave `imageUrl` empty and the app uses the category cover.

Then write three fields. Do not paste the vendor headline or the first paragraph.

- **Headline.** The decision a reader should remember.
- **Summary.** About 60 words. What shipped. A number only when the page states it.
- **Why it matters.** What an engineer should do differently.

## Standing sources

Check these every pass. “Latest” means this page is new, not that a newsletter repeated it.

### The AI Commit

- [theaicommit.com](https://theaicommit.com) — one deep lab a day. Check it every pass. When that lab matches a card, attach it as the Deep lab link. The card still links the original article for the news itself.

### Models

- OpenAI news
- Anthropic news
- Google DeepMind and Gemini posts
- xAI news
- Meta AI, including Muse Spark and the Meta Model API ([research.meta.ai](https://research.meta.ai)). Muse Code when a release changes what you run. The consumer Muse agent (WhatsApp, glasses, avatars) is not a beat. Card it only when a model, API, or agent-architecture post gives an engineer something to call or change.
- Microsoft Research (Phi and other small models)
- Mistral
- Qwen

### Tools

- Cursor changelog
- GitHub posts on Copilot and agents
- Claude Code release notes
- Codex release notes
- Gemini CLI release notes
- Model Context Protocol announcements
- vLLM
- PyTorch

### Research

- Anthropic, OpenAI, DeepMind, and FAIR research blogs
- arXiv `cs.CL`, `cs.LG`, and `cs.AI` — only when a paper would change an eval or a method you run
- Nature or Science when the piece is a system or method, not a survey
- Benchmark releases when the suite itself changes (for example SWE-bench Pro). A leaderboard reshuffle is not a card
- Papers with Code only as a way to find the paper. The card links the paper

### Platforms

When price, latency, or a new API ships:

- Groq
- Fireworks
- Together
- Modal
- Cloudflare Workers AI

Google Cloud, AWS, and Azure only when there is something you can call.

## AI news sites

Original publishers are one lane. These sites publish their own AI articles, and a card can link that article. Skip one when it is only a recap of a story already in the feed.

- [DeepLearning.AI, The Batch](https://www.deeplearning.ai/the-batch/)
- [Microsoft Research](https://www.microsoft.com/en-us/research/blog/)
- [Perplexity](https://www.perplexity.ai/hub)
- [Thinking Machines Lab](https://thinkingmachines.ai/news/)
- Qwen blog
- Simon Willison, Interconnects, Latent Space, Import AI, Lilian Weng, Sebastian Raschka, BAIR
- TechCrunch AI, The Verge AI, VentureBeat AI, MIT Technology Review, Ars Technica AI, Wired AI, The Decoder, MarkTechPost

## Sensors

These point at a story. They are not the link on the card.

- **X.** Lab and researcher accounts only (OpenAI, Anthropic, Google DeepMind, xAI, Meta AI, and researchers who ship). If there is no blog, paper, or repo yet, wait.
- **Reddit.** `r/LocalLLaMA` for weights, quants, and local tooling. `r/MachineLearning` when practitioners are pulling a paper apart. Not `r/singularity`, `r/artificial`, or `r/ChatGPT`.
- **Hacker News.** Ranks cards that already have an original link. It does not decide what is eligible.

## Keeping this list current

The standing list is not complete on purpose. New labs and tools show up first on the sensors. Once a week, spend a few minutes on this file only.

**Breakout, same pass.** A name that is not on the standing list can still get one card today when all three are true:

- The link is the lab post, changelog, paper, or API docs. Not a recap.
- An engineer can call it, switch a model, or change a harness.
- It is spreading on at least two sensors, or it shipped on a lab we already check.

Write that card even if the page is older than the newest card, as long as we have never covered that story. One card per story. Do not backfill the month.

Put the publisher on probation the same day. The two-week wait is only for joining the standing list, not for the first card.

**Skip even when it is everywhere:** funding and valuation, “fastest adopted” scoreboards, consumer launch tours, and a second write-up of a story we already linked.

**Add** a publisher when the sensors point at the same site at least twice in two weeks, and both pieces would have been cards (a model drop, a tool change, a paper or benchmark that changes what you run, or a platform API). Put it under the matching category. Link the blog, changelog, or paper page, not a homepage.

**Probation** is for a site you have seen once. Note it here. Do not check it every pass until it earns a second card-worthy piece.

**Remove or move to slow-day** when a standing source has nothing card-worthy for four weeks, or when it has turned into funding, policy, or recap posts. arXiv and the lab news pages stay even in a quiet month. They are where the next drop lands.

Sensors stay sensors. A hot thread does not add a subreddit or an X commentator to this list. It can only add the publisher behind the original page.

### On probation

- **TypeSafe — Jev.** Original post: [Introducing System One Models and Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev). Docs: [docs.typesafe.ai](https://docs.typesafe.ai). The card is the decision: Jev returns a typed choice, score, or probability, not prose, so it belongs in routing, classification, and checks inside an agent loop. Do not link the seed round, the Vercel adoption piece, or a third-party hosted wrapper. A second card-worthy post moves TypeSafe onto Models.

## Slow day only

- Simon Willison, for tools, when the standing list is quiet.

## Do not monitor

- TLDR, DevBrief, ByteByteGo, The Rundown, Superhuman, and other digests. They are downstream. Reading them makes us a rewrite behind.
- Funding, valuations, and executive moves.
- Consumer tips and “AI will change X” essays.
- Policy, unless it blocks shipping (weights pulled, an API shut off).
- Computer-vision and PubMed blogs, unless a paper would change an eval you run.
- A second write-up of a story we already linked.
