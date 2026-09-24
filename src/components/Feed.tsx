import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
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
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const { savedIds, toggle, ready } = useSavedStories();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  const stories = useMemo(() => {
    if (category === "All") return STORIES;
    return STORIES.filter((s) => s.category === category);
  }, [category]);

  useEffect(() => {
    setActiveIndex(0);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [category]);

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

  if (loading || !ready) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.signal} size="large" />
        <Text style={styles.loadingText}>Loading today’s AI radar…</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <View>
          <Text style={styles.kicker}>Shorts</Text>
          <Text style={styles.title}>The AI Commit</Text>
        </View>
        <Text style={styles.subtitle}>TLDR for your pocket</Text>
      </View>

      <View style={styles.categoryWrap}>
        <CategoryBar
          categories={CATEGORIES}
          selected={category}
          onSelect={setCategory}
        />
      </View>

      {stories.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>No stories in {category}</Text>
          <Text style={styles.emptyBody}>
            Try another category — today’s radar is thin here.
          </Text>
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
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
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
  subtitle: {
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
    color: "rgba(255,255,255,0.72)",
    marginBottom: 4,
  },
  categoryWrap: {
    position: "absolute",
    top: 102,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.paper,
    gap: spacing.sm,
  },
  loadingText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 15,
    color: colors.inkMuted,
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
