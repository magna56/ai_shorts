import { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewToken,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CATEGORIES,
  STORIES,
  type Category,
  type Story,
} from "../data/stories";
import { useSavedStories } from "../hooks/useSavedStories";
import { colors, spacing } from "../theme";
import { CategoryBar } from "./CategoryBar";
import { StoryCard, useCardHeight } from "./StoryCard";

export function Feed() {
  const insets = useSafeAreaInsets();
  const cardHeight = useCardHeight();
  const listRef = useRef<FlatList<Story>>(null);
  const [category, setCategory] = useState<Category>("All");
  const [showSaved, setShowSaved] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [chromeHeight, setChromeHeight] = useState(0);
  const { savedIds, toggle, ready } = useSavedStories();

  const stories = useMemo(() => {
    const byCategory =
      category === "All"
        ? STORIES
        : STORIES.filter((s) => s.category === category);
    if (!showSaved) return byCategory;
    return byCategory.filter((s) => savedIds.has(s.id));
  }, [category, showSaved, savedIds]);

  useEffect(() => {
    setActiveIndex(0);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [category, showSaved]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  if (!ready) {
    return <View style={styles.centered} />;
  }

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
            <Text style={[styles.kicker, stories.length === 0 && styles.kickerOnPaper]}>
              Shorts
            </Text>
            <Text style={[styles.title, stories.length === 0 && styles.titleOnPaper]}>
              The AI Commit
            </Text>
          </View>
          <Pressable
            onPress={() => setShowSaved((on) => !on)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityState={{ selected: showSaved }}
            accessibilityLabel={showSaved ? "Show all stories" : "Show saved stories"}
            style={[
              styles.savedChip,
              stories.length === 0 && styles.savedChipOnPaper,
              showSaved && styles.savedChipActive,
            ]}
          >
            <Text
              style={[
                styles.savedLabel,
                stories.length === 0 && !showSaved && styles.savedLabelOnPaper,
                showSaved && styles.savedLabelActive,
              ]}
            >
              {showSaved ? "Saved" : `Saved ${savedIds.size}`}
            </Text>
          </Pressable>
        </View>

        <CategoryBar
          categories={CATEGORIES}
          selected={category}
          onSelect={setCategory}
          onPaper={stories.length === 0}
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
          data={stories}
          keyExtractor={(item) => item.id}
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
          onMomentumScrollEnd={(
            e: NativeSyntheticEvent<NativeScrollEvent>,
          ) => {
            const next = Math.round(
              e.nativeEvent.contentOffset.y / cardHeight,
            );
            setActiveIndex(next);
          }}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          renderItem={({ item, index }) => (
            <StoryCard
              story={item}
              index={index}
              total={stories.length}
              saved={savedIds.has(item.id)}
              onToggleSave={() => toggle(item.id)}
              cardHeight={cardHeight}
              chromeHeight={chromeHeight}
            />
          )}
        />
      )}

      {stories.length > 0 ? (
        <View style={styles.floatingBadge} pointerEvents="none">
          <Text style={styles.floatingText}>
            {activeIndex + 1}/{stories.length}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.paper,
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
  savedChip: {
    marginBottom: 2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(14,26,23,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },
  savedChipOnPaper: {
    backgroundColor: colors.paperElevated,
    borderColor: colors.line,
  },
  savedChipActive: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
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
    color: colors.ink,
  },
  kicker: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.7)",
  },
  title: {
    fontFamily: "SourceSerif4_600SemiBold",
    fontSize: 20,
    color: "#FFFFFF",
  },
  kickerOnPaper: {
    color: colors.inkMuted,
  },
  titleOnPaper: {
    color: colors.ink,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.paper,
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
  floatingBadge: {
    position: "absolute",
    right: spacing.md,
    bottom: spacing.xl,
    backgroundColor: "rgba(14,26,23,0.75)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  floatingText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
    color: "#fff",
  },
});
