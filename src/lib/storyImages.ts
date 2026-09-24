import type { ImageSourcePropType } from "react-native";
import type { Story } from "../data/stories";

/** Local article images pulled from source OG tags when available. */
export const ARTICLE_IMAGES: Record<string, ImageSourcePropType> = {
  "1": require("../../assets/stories/muse.webp"),
  "2": require("../../assets/stories/phi.png"),
  // Story 3 uses generated Tools fallback (GitHub OG is logo-only).
  "4": require("../../assets/stories/huggingface.png"),
  "5": require("../../assets/stories/papers.png"),
  "6": require("../../assets/stories/anthropic.jpg"),
  "9": require("../../assets/stories/mcp.png"),
};

/** Generated covers used when an article image is missing or fails to load. */
export const CATEGORY_FALLBACKS = {
  Models: require("../../assets/fallbacks/models.png"),
  Tools: require("../../assets/fallbacks/tools.png"),
  Research: require("../../assets/fallbacks/research.png"),
  Platforms: require("../../assets/fallbacks/platforms.png"),
} as const;

export function getStoryImageSource(story: Story): ImageSourcePropType {
  if (story.imageUrl) {
    return { uri: story.imageUrl };
  }
  return ARTICLE_IMAGES[story.id] ?? CATEGORY_FALLBACKS[story.category];
}

export function getCategoryFallback(story: Story): ImageSourcePropType {
  return CATEGORY_FALLBACKS[story.category];
}
