import * as AppleAuthentication from "expo-apple-authentication";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useAccount } from "../hooks/useAccount";
import { colors, spacing } from "../theme";

export function AccountScreen() {
  const { account, busy, message, signInWithApple, signInWithGoogle, signOut } = useAccount();
  const [appleAvailable, setAppleAvailable] = useState(Platform.OS === "ios");

  useEffect(() => {
    if (Platform.OS !== "ios") return;
    AppleAuthentication.isAvailableAsync().then(setAppleAvailable).catch(() => setAppleAvailable(false));
  }, []);

  return (
    <View style={styles.root}>
      <Text style={styles.kicker}>Account</Text>
      <Text style={styles.title}>{account ? account.name || "Signed in" : "Sign in"}</Text>
      <Text style={styles.body}>
        {account
          ? `${account.email || "No email shared"} · ${account.provider === "apple" ? "Apple" : "Google"}`
          : "Use Google or Apple. The feed stays open either way."}
      </Text>

      {account ? (
        <Pressable
          onPress={() => signOut().then(() => router.back())}
          disabled={busy}
          style={styles.signOut}
          accessibilityRole="button"
        >
          <Text style={styles.signOutLabel}>Sign out</Text>
        </Pressable>
      ) : (
        <View style={styles.actions}>
          {appleAvailable ? (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={12}
              style={styles.apple}
              onPress={() => {
                signInWithApple().then((ok) => {
                  if (ok) router.back();
                });
              }}
            />
          ) : (
            <Pressable
              onPress={() => {
                signInWithApple().then((ok) => {
                  if (ok) router.back();
                });
              }}
              disabled={busy}
              style={styles.appleFallback}
              accessibilityRole="button"
              accessibilityLabel="Sign in with Apple"
            >
              <Text style={styles.appleFallbackLabel}>Sign in with Apple</Text>
            </Pressable>
          )}
          <Pressable
            onPress={() => {
              signInWithGoogle().then((ok) => {
                if (ok) router.back();
              });
            }}
            disabled={busy}
            style={styles.google}
            accessibilityRole="button"
            accessibilityLabel="Sign in with Google"
          >
            <Text style={styles.googleLabel}>Sign in with Google</Text>
          </Pressable>
        </View>
      )}

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.paper,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.sm,
  },
  kicker: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: colors.inkMuted,
  },
  title: {
    fontFamily: "SourceSerif4_700Bold",
    fontSize: 32,
    color: colors.ink,
  },
  body: {
    fontFamily: "DMSans_400Regular",
    fontSize: 16,
    lineHeight: 24,
    color: colors.inkMuted,
    marginBottom: spacing.md,
  },
  actions: {
    gap: spacing.sm,
  },
  apple: {
    width: "100%",
    height: 48,
  },
  appleFallback: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  appleFallbackLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 16,
    color: colors.paper,
  },
  google: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.paperElevated,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  googleLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 16,
    color: colors.ink,
  },
  signOut: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.ink,
  },
  signOutLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: colors.paper,
  },
  message: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: colors.danger,
    marginTop: spacing.sm,
  },
});
