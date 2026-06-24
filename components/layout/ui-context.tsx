"use client";

// ─── Shared UI state ─────────────────────────────────────────────────────────
// Holds the two pieces of chrome state that several sibling components need to
// agree on: the color theme (light/dark) and whether the sidebar is collapsed
// (so the main content can go fullscreen). Both persist to localStorage; the
// theme class is applied to <html> so Tailwind's `.dark` tokens cascade.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface UIContextValue {
  theme: Theme;
  toggleTheme: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const THEME_KEY = "euphoria-theme";
const SIDEBAR_KEY = "euphoria-sidebar-collapsed";

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Hydrate from what the no-flash script already applied / from storage. This
  // runs once after mount, so the first client render still matches the SSR
  // defaults (light, expanded) — no hydration mismatch — and the real
  // preference is synced in right after. Syncing state from an external store
  // (localStorage/DOM) on mount is the intended use here.
  useEffect(() => {
    const isDark =
      document.documentElement.classList.contains("dark") ||
      localStorage.getItem(THEME_KEY) === "dark";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(isDark ? "dark" : "light");
    setSidebarCollapsed(localStorage.getItem(SIDEBAR_KEY) === "1");
  }, []);

  // Reflect theme to the DOM + storage whenever it changes.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    []
  );

  const toggleSidebar = useCallback(
    () =>
      setSidebarCollapsed((c) => {
        const next = !c;
        localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
        return next;
      }),
    []
  );

  return (
    <UIContext.Provider
      value={{ theme, toggleTheme, sidebarCollapsed, toggleSidebar }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within a UIProvider");
  return ctx;
}
