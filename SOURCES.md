# Sources we plan to monitor

Operating list for EngAI. A card links the original page. Sensors only tell us where to look.

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

Then write four fields. Do not paste the vendor headline or the first paragraph.

- **Headline.** The decision a reader should remember.
- **Summary.** About 60 words. What shipped. A number only when the page states it.
- **For a software engineer.** Every card has this. Map the idea onto a system the reader already runs: a sort, a cache, a queue, a lock. For a The AI Commit lab card, use that section from the post.
- **Why it matters.** What an engineer should do differently.

## Standing sources

Check these every pass. “Latest” means this page is new, not that a newsletter repeated it.

### The AI Commit

- [theaicommit.com](https://theaicommit.com) — one lab a day. Every pass puts the latest lab in the feed as its own card, linked to that article. When the same lab also explains a news card, attach it there as the Deep lab link too.

### Models

- OpenAI news
- Anthropic news
- Google DeepMind and Gemini posts
- xAI news
- Meta AI, including Muse Spark and the Meta Model API ([research.meta.ai](https://research.meta.ai)). Muse Code when a release changes what you run. The consumer Muse agent (WhatsApp, glasses, avatars) is not a beat. Card it only when a model, API, or agent-architecture post gives an engineer something to call or change.
- Microsoft Research (Phi and other small models)
- Mistral
- Qwen
- Hugging Face blog — model, training, inference, and benchmark posts. Skip hiring notes.

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

Original articles are the main lane. A run is ordered, not mixed at random: today’s lab, a new model, a different publisher, a tool, a research piece, then a news card, then more original articles, with two more news seats at most. At most two cards from the same publisher. An empty slot stays empty. Skip a news card when it only recaps a story already in the stack.

- [DeepLearning.AI, The Batch](https://www.deeplearning.ai/the-batch/)
- [Microsoft Research](https://www.microsoft.com/en-us/research/blog/)
- [Perplexity](https://www.perplexity.ai/hub)
- [Thinking Machines Lab](https://thinkingmachines.ai/news/)
- Qwen blog
- [Hugging Face blog](https://huggingface.co/blog)
- Simon Willison, Interconnects, Latent Space, Import AI, Lilian Weng, Sebastian Raschka, BAIR
- TechCrunch AI, The Verge AI, VentureBeat AI, MIT Technology Review, Ars Technica AI, Wired AI, The Decoder, MarkTechPost

## Additional seats

These are extra cards after the run above. They do not replace today’s lab, the standing list, the 60-word card, the “why it matters,” the two-per-publisher cap, or an empty slot.

Look only when that pass’s ordered seats are already filled or honestly empty. A card still has to clear the same bar: original page, something concrete, an engineer can call it, switch a model, or change a harness.

- **One serving or chip card,** if the ordered run did not already include one. Price, latency, or a new API on Groq, Fireworks, Together, Modal, or Cloudflare, plus an Nvidia inference post when an engineer can buy, call, or retarget a workload. Not a chip rumor.
- **One long read,** if the ordered run did not already include a paper, kernel, or benchmark that would change an eval. Same card shape. Mark it as the long read so it is not mistaken for a one-minute launch.

Personnel moves, IPOs, legal fights, and revenue claims stay off the list. They are not an additional seat.

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

- **TypeSafe — Jev.** Original post: [Introducing System One Models and Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev). Docs: [docs.typesafe.ai](https://docs.typesafe.ai). The card is the decision: Jev returns a typed choice, score, or probability, not prose, so it belongs in routing, classification, and checks inside an agent loop. Do not link the seed round, the Vercel adoption piece, or a third-party hosted wrapper. A second card-worthy post moves TypeSafe onto Models. CLM-8B is not that second post. It is a different lab.

- **Contrastive-LM — CLM-8B.** Original: [github.com/Contrastive-LM/CLM](https://github.com/Contrastive-LM/CLM). An open System One model with a TypeSafe-compatible API. An engineer can run it as a verifier or a typed check. Card the repo, not a recap of the benchmark claims. A second card-worthy post moves it onto Models.

- **Inferact.** Original: [700 TPS on Kimi K3: A Case for TPU Megakernels](https://inferact.ai/blog/tpu-megakernels). A kernel an engineer can run, with a number against a named vLLM baseline. Card that post, not a rewrite of the benchmark. A second card-worthy post moves Inferact onto Tools, next to vLLM.

## Slow day only

- Simon Willison, for tools, when the standing list is quiet.

## Do not monitor

- TLDR, DevBrief, ByteByteGo, The Rundown, Superhuman, and other digests. They are downstream. Reading them makes us a rewrite behind.
- Funding, valuations, and executive moves.
- Consumer tips and “AI will change X” essays.
- Policy, unless it blocks shipping (weights pulled, an API shut off).
- Computer-vision and PubMed blogs, unless a paper would change an eval you run.
- A second write-up of a story we already linked.
