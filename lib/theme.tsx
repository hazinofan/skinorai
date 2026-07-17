"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark";
type ThemeSetter = (nextTheme: ThemeMode | ((currentTheme: ThemeMode) => ThemeMode)) => void;

type ThemeContextValue = {
  theme: ThemeMode;
  isDarkTheme: boolean;
  setTheme: ThemeSetter;
};

export const THEME_STORAGE_KEY = "skinorai_chat_theme";

const SERVER_THEME_SNAPSHOT: ThemeMode = "light";
const themeStoreListeners = new Set<() => void>();
const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return SERVER_THEME_SNAPSHOT;
  }

  return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
}

function notifyThemeStoreListeners() {
  themeStoreListeners.forEach((listener) => listener());
}

function subscribeThemeStore(listener: () => void) {
  themeStoreListeners.add(listener);

  const handleStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    themeStoreListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribeThemeStore, readStoredTheme, () => SERVER_THEME_SNAPSHOT);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const setTheme = useCallback<ThemeSetter>((nextTheme) => {
    const currentTheme = readStoredTheme();
    const resolvedTheme = typeof nextTheme === "function" ? nextTheme(currentTheme) : nextTheme;
    window.localStorage.setItem(THEME_STORAGE_KEY, resolvedTheme);
    notifyThemeStoreListeners();
  }, []);

  const value = useMemo(
    () => ({
      theme,
      isDarkTheme: theme === "dark",
      setTheme,
    }),
    [setTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
