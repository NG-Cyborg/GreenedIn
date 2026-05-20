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

type AppContextType = {
  user: User | null;
  hasOnboarded: boolean;
  language: Language;
  isOffline: boolean;
  setUser: (user: User | null) => Promise<void>;
  setHasOnboarded: (value: boolean) => Promise<void>;
  setLanguage: (lang: Language) => Promise<void>;
  signOut: () => Promise<void>;
};

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  USER: "@greenedin_user",
  ONBOARDED: "@greenedin_onboarded",
  LANGUAGE: "@greenedin_language",
};

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
