# AI Commit Shorts — Handoff for next Cursor session

**Repo:** https://github.com/magna56/ai_shorts  
**Brand:** [theaicommit.com](https://theaicommit.com) — Daily AI Engineering Lab  
**Product:** iOS-first Expo app — **TLDR for your pocket**  
**Owner:** Theaicommit / magna56  

Use this file as the full brief when continuing work in a new Cursor session. Do not re-litigate settled decisions unless the user asks.

---

## 1. Intent (what we are building)

Create an **Inshorts-style short-news iOS app** niche-focused on **AI for technical people** — so engineers and tech pros can stay current when **too much ships every day**.

**Job to be done**

> “Did anything ship today in AI that I should care about as someone who works in tech — in under 5 minutes on my phone?”

**Not**

- Replace The AI Commit’s deep daily lab (1 article/day)
- Compete as another email newsletter (TLDR / Superhuman / Rundown already win inbox)
- Broad “AI curious” / productivity-prompt fluff (Superhuman / Rundown lane)

**Coexistence model**

```
Noise → Shorts (scan on phone) → Pick what matters → Deep dive
                                              ├─ original source (primary)
                                              └─ The AI Commit lab (when we have one)
```

Email digests and this app **coexist** (different moments):

| | Email (TLDR) | App (Shorts) |
|---|---|---|
| When | Morning desk / inbox | Commute, between meetings, evening |
| Habit | Push (arrives) | Pull (open) / later push |
| Format | Link list | One swipeable card |

The AI Commit only publishes **one deep lab/day**. Shorts are the **radar** for many candidate stories (Meta Muse, Phi drops, agent harnesses, etc.). Depth can be AIC **or** any other source.

---

## 2. Settled audience

**Primary (locked):** Same market as **TLDR AI** — engineers, ML/AI folks, researchers, tech leads who want dense technical signal in ~5 minutes.

**Include adjacent:** PMs / tech leads who decide what to adopt.

**Out of scope for now:** students-as-primary, marketers, general “AI curious,” Superhuman-style productivity beginners.

**Why not “builder-only”?** Too narrow for MVP growth. **Why not “everyone keep up with AI”?** Too vague; fights multi-million email brands without a wedge.

**Positioning line:** “TLDR for your pocket.”

---

## 3. Market research (condensed)

### Inshorts (format inspiration)

- India-first aggregator (2013): image + headline + ~60-word card, vertical swipe, tap for full article
- Monetization: native ad cards; FY24 ~₹181 Cr revenue, still loss-making
- Strength: low cognitive load, high cards/session
- Weakness: thin depth, few languages vs Dailyhunt

**Format takeaway:** swipe cards + brief + source link = proven UX. Apply it to **AI tech news**, not general news.

### “Keep up with AI” landscape

**Email wins (huge):**

| Product | Approx scale | Audience |
|---|---|---|
| The Rundown AI | ~2M+ | Broad professionals + how-tos |
| Superhuman AI | ~1.5M+ | Non-technical / productivity |
| TLDR AI | ~1.1–1.25M | Engineers / technical |
| The Neuron | ~500K | Business + broad |
| Ben’s Bites | ~120–160K | Builders / products |
| The Batch | large weekly | Research / practitioners |

Top AI newsletters monetize via sponsorships (often ~$1M–$20M/yr reported for leaders). Demand for “keep up with AI” is proven.

**iOS AI short-news apps (mostly early / weak traction):**

| App | Notes |
|---|---|
| **DevBrief** | Closest competitor — card digest for AI/ML pros; claims ~1k users; App Store few ratings; still early |
| **Prism** | Swipe AI digest + audio; ~2 ratings; freemium |
| **NineT** | 90-word AI summaries; &lt;1k downloads |
| **AI Short News** | Broader exec audience; tiny |
| **Volv** | Real scale (~80k Android) but **general** short news, not AI-only |

**Conclusion:** Format works (Volv). AI-specific short apps have **not won yet**. Real pressure is **TLDR-in-inbox**, not DevBrief scale. Opportunity = **same TLDR audience, mobile card surface**.

**Compete primarily with:** DevBrief / Prism (app UX) while matching **TLDR taste**.  
**Do not try to kill:** TLDR email.  
**Do not pick as primary:** Volv (wrong category + capital).

### Would TLDR readers love the same in an app?

- They love **curation trust, brevity, technical density, zero friction** — not email per se.
- Same content/taste → **yes for phone moments**.
- They **won’t switch off email**; app wins **commute / between meetings / breaking**.
- Bounce if: fluff, worse curation than TLDR, paywall before value, noisy notifications.

---

## 4. MVP scope (locked)

| In | Out (for now) |
|---|---|
| Vertical swipe cards | Auth / accounts |
| ~60w summary + “why it matters” | ML personalization |
| Categories: Models · Tools · Research · Platforms | Live scrape of everything |
| Read source | Ads |
| Optional Deep lab → theaicommit.com | Offline v2 |
| Local saves | Push notifications (later) |
| Article/OG hero images; generated category fallback if missing | Android-first (iOS first) |

**Candidate story types:** model drops (Phi), platforms/devices (Muse), tools/agents, research that changes what you ship.  
**Not candidates:** CEO takes, consumer tips, vague hype, policy unless it blocks builders.

---

## 5. What is already shipped in this repo

Stack: **Expo SDK 57 · React Native · TypeScript · Expo Router**

- Swipe feed (`src/components/Feed.tsx`, `StoryCard.tsx`)
- Seed stories (`src/data/stories.ts`) — Muse, Phi, agents, open weights, etc.
- Categories + empty/loading states
- Save via AsyncStorage
- Hero images from article OG assets + generated category fallbacks (`assets/stories/`, `assets/fallbacks/`, `src/lib/storyImages.ts`)
- Bundle id: `com.theaicommit.shorts`
- `eas.json` with production / preview / development profiles
- README with clone + App Store laptop steps

**GitHub:** `git@github.com:magna56/ai_shorts.git` (branch `main`)

**Run locally:**

```bash
npm install
npm start          # Expo Go on iPhone
npm run ios        # Mac + Xcode
npm run web        # http://localhost:3847
```

---

## 6. App Store path (for laptop session)

Cannot finish App Store from cloud VM without Apple/Expo credentials on the user’s machine.

```bash
git clone git@github.com:magna56/ai_shorts.git
cd ai_shorts
npm install
npm i -g eas-cli
eas login
eas build --platform ios --profile production --auto-submit
```

Needs:

1. Apple Developer Program ($99/yr)
2. Expo account
3. App Store Connect app for `com.theaicommit.shorts`
4. Listing assets: 1024 icon, screenshots, privacy policy URL, description

Then: TestFlight → fill listing → Submit for Review.

---

## 7. Suggested next work for the new session

Priority order (pick with user):

1. **Ship TestFlight** via EAS on laptop (credentials interactive)
2. **Live feed** — RSS/API/OG fetch for real headlines + images (replace/seed-augment static `STORIES`)
3. **Push notifications** for breaking model/tool drops
4. **Polish** — better icons/splash branded to The AI Commit; App Store screenshots
5. **Deep lab linking** — auto-attach AIC lab URLs when a short matches a published lab

---

## 8. Conversation decisions log (this session)

1. Researched Inshorts; user wanted niche AI news for theaicommit.com audience.
2. Paused build for market research; narrowed audience/MVP.
3. Clarified: Shorts = many daily candidates; deep dive = AIC **or** other sources (AIC is 1/day only).
4. Confirmed similar iOS apps exist but are early; DevBrief = closest.
5. Discussed builder-only vs broader; settled on **TLDR-shaped tech audience** (not Superhuman).
6. Agreed email and apps coexist as different funnels.
7. Built Expo iOS MVP + hero images with generated fallbacks.
8. Published repo to https://github.com/magna56/ai_shorts.
9. Documented App Store via EAS; cloud agent cannot use user’s laptop Apple login — handoff to local Cursor session.

---

## 9. Prompt you can paste into the new Cursor session

```text
Read HANDOFF.md in this repo (https://github.com/magna56/ai_shorts).

We are shipping AI Commit Shorts: an Inshorts-style iOS app (Expo) = “TLDR for your pocket” for engineers/tech pros. Email digests and this app coexist. Do not reopen audience debates unless I ask.

Current code is the MVP (swipe cards, categories, source links, deep lab CTA, hero images + fallbacks, eas.json).

Next: help me run EAS production build + TestFlight / App Store submit from this laptop. Then we can improve live news ingestion.
```

---

*Generated for handoff — keep this file updated when major product decisions change.*
