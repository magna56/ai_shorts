export type Account = {
  provider: "apple" | "google";
  id: string;
  email: string | null;
  name: string | null;
};

export const ACCOUNT_KEY = "aic-shorts-account";
