# AI Commit Shorts

iOS-first Expo app: **TLDR for your pocket** — dense AI engineering news in swipeable cards.

Part of [The AI Commit](https://theaicommit.com). Built for engineers and technical pros who already live on digests like TLDR AI, for commute / between-meeting moments email doesn’t cover.

## MVP

- Vertical swipe cards (Inshorts-style)
- ~60-word summaries + “why it matters”
- Categories: Models · Tools · Research · Platforms
- Open source article in-browser
- Optional **Deep lab** link when The AI Commit has a related lab
- Local saves (AsyncStorage)
- Loading + empty states

## Run

```bash
npm install
npm run ios      # macOS + Xcode / Expo Go
npm run web      # preview on http://localhost:3847
npm start        # QR for Expo Go on a physical iPhone
```

Open in **Expo Go** on iOS for the fastest device loop. Production builds: `npx eas-cli build --platform ios`.

## Stack

Expo SDK 57 · React Native · Expo Router · TypeScript

## Product note

Email digests (TLDR) and this app coexist: inbox for the desk, Shorts for phone moments. Curation taste matches TLDR density — models, tools, research, platforms — not productivity-prompt fluff.
