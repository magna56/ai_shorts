import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Category } from "../data/stories";
import { colors, radius, spacing } from "../theme";

type Props = {
  categories: Category[];
  selected: Category;
  onSelect: (category: Category) => void;
  onPaper?: boolean;
};

export function CategoryBar({ categories, selected, onSelect, onPaper }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {categories.map((category) => {
        const active = category === selected;
        return (
          <Pressable
            key={category}
            onPress={() => onSelect(category)}
            style={[
              styles.chip,
              onPaper && styles.chipOnPaper,
              active && styles.chipActive,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text
              style={[
                styles.label,
                onPaper && styles.labelOnPaper,
                active && styles.labelActive,
              ]}
            >
              {category}
            </Text>
          </Pressable>
        );
      })}
      <View style={{ width: spacing.sm }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    backgroundColor: "rgba(14,26,23,0.35)",
  },
  chipOnPaper: {
    backgroundColor: colors.paperElevated,
    borderColor: colors.line,
  },
  chipActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  label: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: "rgba(255,255,255,0.88)",
    letterSpacing: 0.2,
  },
  labelOnPaper: {
    color: colors.inkMuted,
  },
  labelActive: {
    color: colors.paper,
  },
});
