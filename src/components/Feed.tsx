import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewToken,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CATEGORIES,
  STORIES,
  type Category,
  type Story,
} from "../data/stories";
import { useAccount } from "../hooks/useAccount";
import { usePublishedFeed } from "../hooks/usePublishedFeed";
import { useReadingRitual } from "../hooks/useReadingRitual";
import { useSavedStories } from "../hooks/useSavedStories";
import { colors, radius, spacing } from "../theme";
import { CategoryBar } from "./CategoryBar";
import { RadarQuiz } from "./RadarQuiz";
import { StoryCard, useCardHeight } from "./StoryCard";

type FeedItem =
  | { kind: "story"; story: Story }
  | { kind: "quiz" };

export function Feed() {
  const insets = useSafeAreaInsets();
  const cardHeight = useCardHeight();
  const listRef = useRef<FlatList<FeedItem>>(null);
  const [category, setCategory] = useState<Category>("All");
  const [showSaved, setShowSaved] = useState(false);
  const [chromeHeight, setChromeHeight] = useState(0);
  const [onQuiz, setOnQuiz] = useState(false);
  const { savedIds, toggle, ready } = useSavedStories();
  const { account } = useAccount();
  const published = usePublishedFeed(STORIES);
  const ritual = useReadingRitual(published.map((story) => story.id));
  const resumed = useRef(false);

  const stories = useMemo(() => {
    const byCategory =
      category === "All"
        ? published
        : published.filter((s) => s.category === category);
    if (!showSaved) return byCategory;
    return byCategory.filter((s) => savedIds.has(s.id));
  }, [category, showSaved, savedIds, published]);

  const quizFollows = category === "All" && !showSaved && stories.length > 0;
  const items = useMemo<FeedItem[]>(() => {
    const rows: FeedItem[] = stories.map((story) => ({ kind: "story", story }));
    if (quizFollows) rows.push({ kind: "quiz" });
    return rows;
  }, [stories, quizFollows]);

  useEffect(() => {
    setOnQuiz(false);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [category, showSaved]);

  useEffect(() => {
    if (!ritual.ready || resumed.current || category !== "All" || showSaved) return;
    if (ritual.startIndex <= 0) return;
    resumed.current = true;
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({
        index: ritual.startIndex,
        animated: false,
      });
    });
  }, [ritual.ready, ritual.startIndex, category, showSaved]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const item = viewableItems[0]?.item as FeedItem | undefined;
      if (!item) return;
      if (item.kind === "story") {
        ritual.markSeen(item.story.id);
        setOnQuiz(false);
      } else {
        setOnQuiz(true);
      }
    },
  ).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  if (!ready || !ritual.ready) {
    return <View style={styles.centered} />;
  }

  const minutes = Math.max(1, Math.round(stories.length / 3));
  const caughtUp = category === "All" && !showSaved && ritual.caughtUp;
  const sessionLine = onQuiz
    ? "Five questions"
    : caughtUp
      ? "Caught up · next one lands through the day"
      : `${stories.length} ${stories.length === 1 ? "story" : "stories"} · about ${minutes} min`;
  const headerOnPaper = true;

  const emptyTitle = showSaved
    ? "Nothing saved yet"
    : `No stories in ${category}`;
  const emptyBody = showSaved
    ? "Tap Save on a card and it will show up here."
    : "Try another category — today’s radar is thin here.";

  return (
    <View style={styles.root}>
      <View
        style={[styles.chrome, { paddingTop: insets.top + spacing.sm }]}
        onLayout={(e) => setChromeHeight(e.nativeEvent.layout.height)}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={[styles.kicker, headerOnPaper && styles.kickerOnPaper]}>
              News
            </Text>
            <Text style={[styles.title, headerOnPaper && styles.titleOnPaper]}>
              Eng AI
            </Text>
            <View style={styles.mastRule} />
            <Text style={[styles.subtitle, headerOnPaper && styles.subtitleOnPaper]}>
              {stories.length === 0 ? "For software engineers" : sessionLine}
            </Text>
          </View>
          <View style={styles.chips}>
          <Pressable
            onPress={() => router.push("/account")}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={account ? "Account" : "Sign in"}
            style={[
              styles.savedChip,
              headerOnPaper && styles.savedChipOnPaper,
            ]}
          >
            <Text
              style={[
                styles.savedLabel,
                headerOnPaper && styles.savedLabelOnPaper,
              ]}
            >
              {account ? account.name?.split(" ")[0] || "Account" : "Sign in"}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setShowSaved((on) => !on)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityState={{ selected: showSaved }}
            accessibilityLabel={showSaved ? "Show all stories" : "Show saved stories"}
            style={[
              styles.savedChip,
              headerOnPaper && styles.savedChipOnPaper,
              showSaved && styles.savedChipActive,
            ]}
          >
            <Text
              style={[
                styles.savedLabel,
                headerOnPaper && !showSaved && styles.savedLabelOnPaper,
                showSaved && styles.savedLabelActive,
              ]}
            >
              {showSaved ? "Saved" : `Saved ${savedIds.size}`}
            </Text>
          </Pressable>
          </View>
        </View>

        <CategoryBar
          categories={CATEGORIES}
          selected={category}
          onSelect={setCategory}
          onPaper={headerOnPaper}
        />
      </View>

      {stories.length === 0 ? (
        <View style={[styles.centered, { paddingTop: chromeHeight }]}>
          <Text style={styles.emptyTitle}>{emptyTitle}</Text>
          <Text style={styles.emptyBody}>{emptyBody}</Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={items}
          keyExtractor={(item) => (item.kind === "quiz" ? "quiz" : item.story.id)}
          pagingEnabled
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          snapToInterval={cardHeight}
          snapToAlignment="start"
          disableIntervalMomentum
          getItemLayout={(_, index) => ({
            length: cardHeight,
            offset: cardHeight * index,
            index,
          })}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onScrollToIndexFailed={(info) => {
            listRef.current?.scrollToOffset({
              offset: info.index * cardHeight,
              animated: false,
            });
          }}
          renderItem={({ item, index }) =>
            item.kind === "quiz" ? (
              <RadarQuiz
                cardHeight={cardHeight}
                chromeHeight={chromeHeight}
                onDone={() =>
                  listRef.current?.scrollToOffset({ offset: 0, animated: true })
                }
              />
            ) : (
              <StoryCard
                story={item.story}
                index={index}
                total={stories.length}
                saved={savedIds.has(item.story.id)}
                onToggleSave={() => toggle(item.story.id)}
                cardHeight={cardHeight}
                chromeHeight={chromeHeight}
                quizFollows={quizFollows && index === stories.length - 1}
              />
            )
          }
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.field,
  },
  chrome: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    gap: spacing.sm,
  },
  topBar: {
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  chips: {
    flexDirection: "row",
    gap: spacing.xs,
    marginBottom: 2,
  },
  savedChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.control,
    backgroundColor: "rgba(14,26,23,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },
  savedChipOnPaper: {
    backgroundColor: colors.paperElevated,
    borderColor: colors.line,
  },
  savedChipActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  savedLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
  },
  savedLabelOnPaper: {
    color: colors.ink,
  },
  savedLabelActive: {
    color: colors.paper,
  },
  kicker: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.7)",
  },
  mastRule: {
    width: 36,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginTop: 4,
  },
  title: {
    fontFamily: "SourceSerif4_700Bold",
    fontSize: 22,
    color: colors.ink,
  },
  kickerOnPaper: {
    color: colors.inkMuted,
  },
  titleOnPaper: {
    color: colors.ink,
  },
  subtitle: {
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
    color: "rgba(255,255,255,0.72)",
    marginTop: 2,
  },
  subtitleOnPaper: {
    color: colors.inkMuted,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.field,
    gap: spacing.sm,
  },
  emptyTitle: {
    fontFamily: "SourceSerif4_600SemiBold",
    fontSize: 22,
    color: colors.ink,
    textAlign: "center",
  },
  emptyBody: {
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    color: colors.inkMuted,
    textAlign: "center",
    lineHeight: 22,
  },
});
