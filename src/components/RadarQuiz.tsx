import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RADAR_QUIZ } from "../data/stories";
import { colors, spacing } from "../theme";

type Props = {
  cardHeight: number;
  chromeHeight: number;
  onDone: () => void;
};

export function RadarQuiz({ cardHeight, chromeHeight, onDone }: Props) {
  const insets = useSafeAreaInsets();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>(() =>
    RADAR_QUIZ.map(() => null),
  );

  const finished = started && step >= RADAR_QUIZ.length;
  const question = RADAR_QUIZ[step];
  const picked = picks[step] ?? null;
  const score = picks.reduce<number>(
    (total, pick, index) =>
      pick === RADAR_QUIZ[index]?.answer ? total + 1 : total,
    0,
  );

  const choose = (index: number) => {
    if (picked != null) return;
    setPicks((current) => {
      const next = [...current];
      next[step] = index;
      return next;
    });
  };

  return (
    <View
      style={[
        styles.page,
        {
          height: cardHeight,
          paddingTop: chromeHeight + spacing.xl,
          paddingBottom: Math.max(insets.bottom, spacing.lg),
        },
      ]}
    >
      {finished ? (
        <View style={styles.block}>
          <Text style={styles.kicker}>Score</Text>
          <Text style={styles.score}>
            {score} / {RADAR_QUIZ.length}
          </Text>
          <Text style={styles.lede}>
            {score === RADAR_QUIZ.length
              ? "You had the radar."
              : score >= 3
                ? "Most of it landed."
                : "Worth another pass through the cards."}
          </Text>
          <Pressable
            style={styles.primaryBtn}
            onPress={onDone}
            accessibilityRole="button"
          >
            <Text style={styles.primaryBtnText}>Back to the radar</Text>
          </Pressable>
        </View>
      ) : !started || !question ? (
        <View style={styles.block}>
          <Text style={styles.kicker}>Check</Text>
          <Text style={styles.title}>Five from today’s radar</Text>
          <Text style={styles.lede}>
            Five questions from the stories you just read. Score at the end.
          </Text>
          <Pressable
            style={styles.primaryBtn}
            onPress={() => setStarted(true)}
            accessibilityRole="button"
          >
            <Text style={styles.primaryBtnText}>Start</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.block}>
          <Text style={styles.kicker}>
            {step + 1} of {RADAR_QUIZ.length}
          </Text>
          <Text style={styles.question}>{question.question}</Text>
          <View style={styles.choices}>
            {question.choices.map((choice, index) => {
              const selected = picked === index;
              const isAnswer = index === question.answer;
              return (
                <Pressable
                  key={choice}
                  disabled={picked != null}
                  onPress={() => choose(index)}
                  style={[
                    styles.choice,
                    picked != null && isAnswer && styles.choiceRight,
                    picked != null && selected && !isAnswer && styles.choiceWrong,
                  ]}
                  accessibilityRole="button"
                >
                  <Text style={styles.choiceText}>{choice}</Text>
                </Pressable>
              );
            })}
          </View>
          {picked != null ? (
            <Pressable
              style={styles.primaryBtn}
              onPress={() => setStep((current) => current + 1)}
              accessibilityRole="button"
            >
              <Text style={styles.primaryBtnText}>
                {step === RADAR_QUIZ.length - 1 ? "See score" : "Next"}
              </Text>
            </Pressable>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    width: "100%",
    backgroundColor: colors.field,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
  },
  block: {
    gap: spacing.md,
  },
  kicker: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.accent,
  },
  title: {
    fontFamily: "SourceSerif4_700Bold",
    fontSize: 34,
    lineHeight: 40,
    color: colors.ink,
  },
  question: {
    fontFamily: "SourceSerif4_700Bold",
    fontSize: 28,
    lineHeight: 34,
    color: colors.ink,
  },
  lede: {
    fontFamily: "DMSans_400Regular",
    fontSize: 16,
    lineHeight: 24,
    color: colors.inkMuted,
  },
  score: {
    fontFamily: "SourceSerif4_700Bold",
    fontSize: 64,
    lineHeight: 72,
    color: colors.ink,
  },
  choices: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  choice: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: colors.paperElevated,
  },
  choiceRight: {
    borderColor: colors.signal,
    backgroundColor: colors.signalSoft,
  },
  choiceWrong: {
    borderColor: colors.danger,
  },
  choiceText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 16,
    color: colors.ink,
  },
  primaryBtn: {
    marginTop: spacing.sm,
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
});
