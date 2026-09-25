# AI Commit Shorts — where this stands

iOS-first Expo app. Swipe cards for engineers: about 60 words, why it matters, and a link to the article. Audience and scope stay as written in [HANDOFF.md](./HANDOFF.md).

## Feed

Cards live in `src/data/stories.json`, newest useful items first. `src/data/stories.ts` types that file and holds the five-question quiz.

`npm run generate` reads lab feeds and AI news sites, skips URLs already in the file, and prepends 10 to 12 cards. Original publishers and news sites are interleaved. Muse Spark and Jev are checked directly because those sites have no feed. The source list and the rules are in [SOURCES.md](./SOURCES.md).

`npm run draft -- <url>` pulls facts from one page when a feed missed it. The headline, summary, and why-it-matters still have to be written from the page, not pasted from the vendor title.

## App

- Phone-width column on desktop web. Real phones use the full screen.
- Hero images use `contain` so landscape art is not cropped on the sides.
- Saved filter, reading position, and a caught-up line.
- After the last card, a quiz page: five questions from the radar, then a score. No streak.

## Not done

TestFlight is not submitted. Apple sign-in was deferred. The EAS project is linked (`shortsai`, `com.theaicommit.shorts`). Perplexity’s hub blocks the generator, so that source is listed but does not yield cards yet.
