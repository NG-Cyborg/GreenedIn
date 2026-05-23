import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import type { Language } from "@/constants/i18n";

export type UserRole = "student" | "farmer" | "enthusiast";

export type User = {
  id: string;
  firstName: string;
  surname: string;
  phone: string;
  countryCode: string;
  email?: string;
  role: UserRole;
};

type StoredCredential = {
  userId: string;
  passwordHash: string;
};

type AppContextType = {
  user: User | null;
  hasOnboarded: boolean;
  language: Language;
  isOffline: boolean;
  setUser: (user: User | null) => Promise<void>;
  setHasOnboarded: (value: boolean) => Promise<void>;
  setLanguage: (lang: Language) => Promise<void>;
  signOut: () => Promise<void>;
  registerCredentials: (phone: string, countryCode: string, password: string, userId: string) => Promise<void>;
  validateCredentials: (phone: string, countryCode: string, password: string) => Promise<string | null>;
  updateUser: (updated: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
};

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  USER: "@greenedin_user",
  ONBOARDED: "@greenedin_onboarded",
  LANGUAGE: "@greenedin_language",
  CREDENTIALS: "@greenedin_credentials",
};

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

function credentialKey(phone: string, countryCode: string): string {
  return `${countryCode}${phone}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [hasOnboarded, setHasOnboardedState] = useState(false);
  const [language, setLanguageState] = useState<Language>("en");
  const [isOffline, setIsOffline] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [storedUser, storedOnboarded, storedLang] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.USER),
          AsyncStorage.getItem(STORAGE_KEYS.ONBOARDED),
          AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
        ]);
        if (storedUser) setUserState(JSON.parse(storedUser));
        if (storedOnboarded) setHasOnboardedState(true);
        if (storedLang) setLanguageState(storedLang as Language);
      } catch {
      } finally {
        setLoaded(true);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const checkConnectivity = () => {
      fetch("https://dns.google/resolve?name=google.com&type=A", {
        cache: "no-store",
      })
        .then(() => setIsOffline(false))
        .catch(() => setIsOffline(true));
    };

    checkConnectivity();
    const interval = setInterval(checkConnectivity, 30000);
    return () => clearInterval(interval);
  }, []);

  const setUser = useCallback(async (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, []);

  const setHasOnboarded = useCallback(async (value: boolean) => {
    setHasOnboardedState(value);
    if (value) {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDED, "true");
    }
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }, []);

  const signOut = useCallback(async () => {
    setUserState(null);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  }, []);

  const registerCredentials = useCallback(
    async (phone: string, countryCode: string, password: string, userId: string) => {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.CREDENTIALS);
      const credentials: Record<string, StoredCredential> = raw ? JSON.parse(raw) : {};
      const key = credentialKey(phone, countryCode);
      credentials[key] = { userId, passwordHash: simpleHash(password) };
      await AsyncStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(credentials));
    },
    []
  );

  const validateCredentials = useCallback(
    async (phone: string, countryCode: string, password: string): Promise<string | null> => {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.CREDENTIALS);
      if (!raw) return null;
      const credentials: Record<string, StoredCredential> = JSON.parse(raw);
      const key = credentialKey(phone, countryCode);
      const stored = credentials[key];
      if (!stored) return null;
      if (stored.passwordHash !== simpleHash(password)) return null;
      return stored.userId;
    },
    []
  );

  const updateUser = useCallback(
    async (updated: Partial<User>) => {
      if (!user) return;
      const newUser = { ...user, ...updated };
      setUserState(newUser);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    },
    [user]
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
      if (!user) return { success: false, error: "Not logged in" };
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.CREDENTIALS);
      if (!raw) return { success: false, error: "No credentials found" };
      const credentials: Record<string, StoredCredential> = JSON.parse(raw);
      const key = credentialKey(user.phone, user.countryCode);
      const stored = credentials[key];
      if (!stored) return { success: false, error: "No credentials found" };
      if (stored.passwordHash !== simpleHash(currentPassword)) {
        return { success: false, error: "Current password is incorrect" };
      }
      credentials[key] = { ...stored, passwordHash: simpleHash(newPassword) };
      await AsyncStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(credentials));
      return { success: true };
    },
    [user]
  );

  if (!loaded) return null;

  return (
    <AppContext.Provider
      value={{
        user,
        hasOnboarded,
        language,
        isOffline,
        setUser,
        setHasOnboarded,
        setLanguage,
        signOut,
        registerCredentials,
        validateCredentials,
        updateUser,
        changePassword,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
