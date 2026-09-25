import * as WebBrowser from "expo-web-browser";
import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Story } from "../data/stories";
import { colors, radius, spacing } from "../theme";
import { StoryHeroImage } from "./StoryHeroImage";

type Props = {
  story: Story;
  index: number;
  total: number;
  saved: boolean;
  onToggleSave: () => void;
  cardHeight: number;
  chromeHeight: number;
  quizFollows: boolean;
};

export function StoryCard({
  story,
  index,
  total,
  saved,
  onToggleSave,
  cardHeight,
  chromeHeight,
  quizFollows,
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
    <View style={[styles.card, { height: cardHeight, paddingTop: chromeHeight + spacing.sm }]}>
      <View style={styles.stack}>
        <View style={[styles.sheet, styles.sheetFar]} />
        <View style={[styles.sheet, styles.sheetNear]} />
        <View style={styles.face}>
          <StoryHeroImage story={story} style={styles.hero}>
            <View style={styles.heroInner}>
              <View style={styles.heroMeta}>
                <Text style={styles.category}>{story.category.toUpperCase()}</Text>
                <Text style={styles.progress}>
                  {index + 1} / {total}
                </Text>
              </View>
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

      <ScrollView
        style={styles.bodyScroll}
        contentContainerStyle={[
          styles.body,
          { paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.sm },
        ]}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        <View style={styles.rule} />
        {story.longRead ? <Text style={styles.longRead}>Long read</Text> : null}
        <Text style={styles.headline}>{story.headline}</Text>
        <Text style={styles.summary}>{story.summary}</Text>
            {story.forEngineers ? (
              <View style={styles.whyBlock}>
                <Text style={styles.whyLabel}>For a software engineer</Text>
                <Text style={styles.why}>{story.forEngineers}</Text>
              </View>
            ) : null}
            <View style={styles.whyBlock}>
              <Text style={styles.whyLabel}>Why it matters</Text>
              <Text style={styles.why}>{story.whyItMatters}</Text>
            </View>

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
          {isLast && quizFollows
            ? "Swipe up for five questions"
            : isLast
              ? "That’s today’s radar. Come back when the next one ships."
              : "Swipe up for the next"}
        </Text>
      </ScrollView>
        </View>
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
    backgroundColor: colors.field,
    paddingHorizontal: spacing.md,
  },
  stack: {
    flex: 1,
    marginBottom: spacing.md,
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    borderRadius: radius.card,
  },
  sheetFar: {
    top: 0,
    bottom: 0,
    backgroundColor: colors.slateFar,
  },
  sheetNear: {
    top: 8,
    bottom: 0,
    backgroundColor: colors.slate,
  },
  face: {
    flex: 1,
    marginTop: 16,
    backgroundColor: colors.paper,
    borderRadius: radius.card,
    overflow: "hidden",
  },
  hero: {
    height: 168,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  bodyScroll: {
    flex: 1,
  },
  heroInner: {
    flex: 1,
    justifyContent: "flex-end",
  },
  rule: {
    width: 72,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginBottom: spacing.md,
  },
  longRead: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.accent,
    marginBottom: spacing.sm,
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
  headline: {
    fontFamily: "SourceSerif4_700Bold",
    fontSize: 28,
    lineHeight: 34,
    color: colors.ink,
    marginBottom: spacing.sm,
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
    backgroundColor: colors.accent,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  summary: {
    fontFamily: "DMSans_400Regular",
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
  },
  whyBlock: {
    marginTop: spacing.md,
    paddingLeft: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  whyLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: colors.accent,
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
    color: colors.ink,
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
    borderRadius: radius.control,
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
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    color: colors.ink,
  },
  hint: {
    marginTop: spacing.md,
    textAlign: "center",
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: colors.inkMuted,
  },
});
