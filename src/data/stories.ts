export type Category = "All" | "Models" | "Tools" | "Research" | "Platforms";

export type StoryQuiz = {
  question: string;
  choices: [string, string, string];
  /** Index into choices. */
  answer: 0 | 1 | 2;
};

export type Story = {
  id: string;
  category: Exclude<Category, "All">;
  headline: string;
  summary: string;
  /** Familiar system this maps onto. Lab cards use the post's own section. */
  forEngineers?: string;
  whyItMatters: string;
  sourceName: string;
  sourceUrl: string;
  deepLabUrl?: string;
  /** Remote article/OG image. Local bundle or generated category art used if missing/fails. */
  imageUrl?: string;
  imageColor: string;
  publishedLabel: string;
  /** The one longer paper, kernel, or benchmark in a pass. */
  longRead?: boolean;
};

/** Five checks from the current radar. Shown on their own page after the last card. */
export const RADAR_QUIZ: StoryQuiz[] = [
  {
    question: "What does Gemini Live do while a tool call runs?",
    choices: [
      "Keeps the conversation going",
      "Pauses until the tool returns",
      "Drops the audio",
    ],
    answer: 0,
  },
  {
    question: "Quail’s mean speedup on QUAIL-B versus a tuned vLLM baseline?",
    choices: ["About the same", "1.84×", "10×"],
    answer: 1,
  },
  {
    question: "GPT-6 Sol and Luna API prices versus the GPT-5.6 promo?",
    choices: ["The same", "Twice the promo", "50% below the promo"],
    answer: 2,
  },
  {
    question: "What does Opus 5.5 cost to run versus Opus 5?",
    choices: ["40% less", "The same", "40% more"],
    answer: 0,
  },
  {
    question: "Grok 4.7 ships at which price versus 4.6?",
    choices: [
      "Twice as fast, half the price",
      "Same price and speed",
      "Half the price, same speed",
    ],
    answer: 1,
  },
];

export const CATEGORIES: Category[] = [
  "All",
  "Models",
  "Tools",
  "Research",
  "Platforms",
];

import storiesJson from "./stories.json";

/**
 * Radar cards. `npm run generate` prepends new articles from the standing
 * feeds into stories.json. This file only types that list.
 */
export const STORIES: Story[] = storiesJson as Story[];
