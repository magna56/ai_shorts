import * as WebBrowser from "expo-web-browser";
import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Story } from "../data/stories";
import { colors, spacing } from "../theme";
import { StoryHeroImage } from "./StoryHeroImage";

type Props = {
  story: Story;
  index: number;
  total: number;
  saved: boolean;
  onToggleSave: () => void;
  cardHeight: number;
  chromeHeight: number;
};

export function StoryCard({
  story,
  index,
  total,
  saved,
  onToggleSave,
  cardHeight,
  chromeHeight,
}: Props) {
  const insets = useSafeAreaInsets();

  const openLink = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch {
      Alert.alert("Couldn’t open link", "Check your connection and try again.");
    }
  };

  const isLast = index === total - 1;

  return (
    <View style={[styles.card, { height: cardHeight }]}>
      <StoryHeroImage
        story={story}
        style={[
          styles.hero,
          { paddingTop: Math.max(chromeHeight, insets.top + 118) + spacing.sm },
        ]}
      >
        <View style={styles.heroInner}>
          <View style={styles.heroMeta}>
            <Text style={styles.category}>{story.category.toUpperCase()}</Text>
            <Text style={styles.progress}>
              {index + 1} / {total}
            </Text>
          </View>
          <Text style={styles.brandMark}>The AI Commit</Text>
          <Text style={styles.headline}>{story.headline}</Text>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${((index + 1) / Math.max(total, 1)) * 100}%` },
              ]}
            />
          </View>
        </View>
      </StoryHeroImage>

      <View
        style={[
          styles.body,
          { paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.sm },
        ]}
      >
        <Text style={styles.summary}>{story.summary}</Text>
        <Text style={styles.whyLabel}>Why it matters</Text>
        <Text style={styles.why}>{story.whyItMatters}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.source}>
            {story.sourceName} · {story.publishedLabel}
          </Text>
          <Pressable
            onPress={onToggleSave}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={saved ? "Remove saved story" : "Save story"}
          >
            <Text style={[styles.save, saved && styles.saveActive]}>
              {saved ? "Saved" : "Save"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.primaryBtn}
            onPress={() => openLink(story.sourceUrl)}
            accessibilityRole="button"
          >
            <Text style={styles.primaryBtnText}>Read source</Text>
          </Pressable>
          {story.deepLabUrl ? (
            <Pressable
              style={styles.secondaryBtn}
              onPress={() => story.deepLabUrl && openLink(story.deepLabUrl)}
              accessibilityRole="button"
            >
              <Text style={styles.secondaryBtnText}>Deep lab</Text>
            </Pressable>
          ) : null}
        </View>

        <Text style={styles.hint}>
          {isLast ? "You’re caught up" : "Swipe up for next"}
        </Text>
      </View>
    </View>
  );
}

export function useCardHeight() {
  const { height } = Dimensions.get("window");
  return height;
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: colors.paper,
  },
  hero: {
    flex: 1.05,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  heroInner: {
    flex: 1,
    justifyContent: "flex-end",
  },
  heroMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  category: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    letterSpacing: 1.4,
    color: "rgba(255,255,255,0.72)",
  },
  progress: {
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
    color: "rgba(255,255,255,0.72)",
  },
  brandMark: {
    fontFamily: "SourceSerif4_600SemiBold",
    fontSize: 18,
    color: "rgba(255,255,255,0.92)",
    marginBottom: spacing.sm,
  },
  headline: {
    fontFamily: "SourceSerif4_700Bold",
    fontSize: 30,
    lineHeight: 36,
    color: "#FFFFFF",
    maxWidth: 340,
    textShadowColor: "rgba(0,0,0,0.45)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  progressTrack: {
    marginTop: spacing.md,
    height: 3,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#7DFFC8",
  },
  body: {
    flex: 1,
    backgroundColor: colors.paperElevated,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    marginTop: -18,
  },
  summary: {
    fontFamily: "DMSans_400Regular",
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
  },
  whyLabel: {
    marginTop: spacing.md,
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: colors.signal,
  },
  why: {
    marginTop: spacing.xs,
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkMuted,
  },
  metaRow: {
    marginTop: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  source: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: colors.inkMuted,
  },
  save: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: colors.accent,
  },
  saveActive: {
    color: colors.signal,
  },
  actions: {
    marginTop: spacing.lg,
    flexDirection: "row",
    gap: spacing.sm,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: colors.ink,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryBtnText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    color: colors.paper,
  },
  secondaryBtn: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.signalSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    color: colors.signal,
  },
  hint: {
    marginTop: spacing.md,
    textAlign: "center",
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: colors.inkMuted,
  },
});
