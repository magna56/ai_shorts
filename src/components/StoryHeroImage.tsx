import { Image } from "expo-image";
import { useState, type ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { Story } from "../data/stories";
import {
  getCategoryFallback,
  getStoryImageSource,
} from "../lib/storyImages";

type Props = {
  story: Story;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

/**
 * Full-bleed hero: prefer article/OG image, fall back to generated category art.
 */
export function StoryHeroImage({ story, style, children }: Props) {
  const [failed, setFailed] = useState(false);
  const primary = getStoryImageSource(story);
  const fallback = getCategoryFallback(story);
  const source = failed ? fallback : primary;

  return (
    <View style={[styles.root, style]}>
      <Image
        source={source}
        style={StyleSheet.absoluteFill}
        contentFit="contain"
        transition={200}
        onError={() => setFailed(true)}
        accessibilityIgnoresInvertColors
      />
      <LinearGradient
        colors={[
          "rgba(8,14,12,0.35)",
          "rgba(8,14,12,0.55)",
          "rgba(8,14,12,0.92)",
        ]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      {/* Soft brand tint if we landed on a very light article image */}
      <LinearGradient
        colors={["transparent", story.imageColor + "55"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: "hidden",
    backgroundColor: "#0A1210",
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
