import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AppleAuthentication from "expo-apple-authentication";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Platform } from "react-native";
import { ACCOUNT_KEY, type Account } from "../lib/account";

WebBrowser.maybeCompleteAuthSession();

const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const googleAndroidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;

const googleDiscovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  userInfoEndpoint: "https://openidconnect.googleapis.com/v1/userinfo",
};

type AccountContextValue = {
  account: Account | null;
  ready: boolean;
  busy: boolean;
  message: string | null;
  signInWithApple: () => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<void>;
};

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ACCOUNT_KEY)
      .then((raw) => {
        if (!raw) return;
        setAccount(JSON.parse(raw) as Account);
      })
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  const save = useCallback(async (next: Account | null) => {
    setAccount(next);
    if (next) {
      await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify(next));
    } else {
      await AsyncStorage.removeItem(ACCOUNT_KEY);
    }
  }, []);

  const signInWithApple = useCallback(async () => {
    setMessage(null);
    if (Platform.OS !== "ios") {
      setMessage("Sign in with Apple opens on iPhone.");
      return false;
    }
    setBusy(true);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const given = credential.fullName?.givenName;
      const family = credential.fullName?.familyName;
      const name = [given, family].filter(Boolean).join(" ") || null;
      await save({
        provider: "apple",
        id: credential.user,
        email: credential.email,
        name,
      });
      return true;
    } catch (error) {
      const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
      if (code !== "ERR_REQUEST_CANCELED") {
        setMessage("Apple sign-in did not finish. Try again.");
      }
      return false;
    } finally {
      setBusy(false);
    }
  }, [save]);

  const signInWithGoogle = useCallback(async () => {
    setMessage(null);
    const clientId = Platform.select({
      ios: googleIosClientId || googleWebClientId,
      android: googleAndroidClientId || googleWebClientId,
      default: googleWebClientId,
    });
    if (!clientId) {
      setMessage("Add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID before Google sign-in can open.");
      return false;
    }
    setBusy(true);
    try {
      const redirectUri = AuthSession.makeRedirectUri();
      const request = new AuthSession.AuthRequest({
        clientId,
        redirectUri,
        responseType: AuthSession.ResponseType.Token,
        scopes: ["openid", "profile", "email"],
        usePKCE: false,
      });
      const result = await request.promptAsync(googleDiscovery);
      if (result.type !== "success") return false;
      const accessToken = result.authentication?.accessToken || result.params.access_token;
      if (!accessToken || !googleDiscovery.userInfoEndpoint) {
        setMessage("Google did not return an account.");
        return false;
      }
      const profile = await fetch(googleDiscovery.userInfoEndpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then((response) => response.json());
      if (!profile?.sub) {
        setMessage("Google did not return an account.");
        return false;
      }
      await save({
        provider: "google",
        id: String(profile.sub),
        email: profile.email ? String(profile.email) : null,
        name: profile.name ? String(profile.name) : null,
      });
      return true;
    } catch {
      setMessage("Google sign-in did not finish. Try again.");
      return false;
    } finally {
      setBusy(false);
    }
  }, [save]);

  const signOut = useCallback(async () => {
    setBusy(true);
    setMessage(null);
    try {
      await save(null);
    } finally {
      setBusy(false);
    }
  }, [save]);

  const value = useMemo(
    () => ({
      account,
      ready,
      busy,
      message,
      signInWithApple,
      signInWithGoogle,
      signOut,
    }),
    [account, ready, busy, message, signInWithApple, signInWithGoogle, signOut],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const value = useContext(AccountContext);
  if (!value) throw new Error("useAccount must be used inside AccountProvider");
  return value;
}
