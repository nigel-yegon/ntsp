"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type TextSize = "normal" | "large" | "xlarge";

type AccessibilitySettings = {
  textSize: TextSize;
  highContrast: boolean;
  grayscale: boolean;
  readableFont: boolean;
  increasedSpacing: boolean;
  reducedMotion: boolean;
};

type AccessibilityContextType = AccessibilitySettings & {
  setTextSize: (value: TextSize) => void;
  toggleHighContrast: () => void;
  toggleGrayscale: () => void;
  toggleReadableFont: () => void;
  toggleIncreasedSpacing: () => void;
  toggleReducedMotion: () => void;
  resetAccessibility: () => void;
};

const STORAGE_KEY = "wilcom-accessibility";

const defaultSettings: AccessibilitySettings = {
  textSize: "normal",
  highContrast: false,
  grayscale: false,
  readableFont: false,
  increasedSpacing: false,
  reducedMotion: false,
};

const AccessibilityContext =
  createContext<AccessibilityContextType | null>(null);

/** Class names applied to <html>, keyed by the setting they reflect. */
const CLASS_MAP = {
  "accessibility-large-text": (s: AccessibilitySettings) =>
    s.textSize === "large",
  "accessibility-xlarge-text": (s: AccessibilitySettings) =>
    s.textSize === "xlarge",
  "accessibility-high-contrast": (s: AccessibilitySettings) => s.highContrast,
  "accessibility-grayscale": (s: AccessibilitySettings) => s.grayscale,
  "accessibility-readable-font": (s: AccessibilitySettings) => s.readableFont,
  "accessibility-increased-spacing": (s: AccessibilitySettings) =>
    s.increasedSpacing,
  "accessibility-reduced-motion": (s: AccessibilitySettings) =>
    s.reducedMotion,
} as const;

function applyClasses(settings: AccessibilitySettings) {
  const root = document.documentElement;
  for (const [className, predicate] of Object.entries(CLASS_MAP)) {
    root.classList.toggle(className, predicate(settings));
  }
}

export function AccessibilityProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [settings, setSettings] =
    useState<AccessibilitySettings>(defaultSettings);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<AccessibilitySettings>;
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch {
      // Ignore malformed localStorage data
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    applyClasses(settings);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Storage may be unavailable (private mode, quota); safe to ignore
    }
  }, [settings, mounted]);

  const value = useMemo<AccessibilityContextType>(
    () => ({
      ...settings,
      setTextSize: (value) =>
        setSettings((current) => ({ ...current, textSize: value })),
      toggleHighContrast: () =>
        setSettings((current) => ({
          ...current,
          highContrast: !current.highContrast,
        })),
      toggleGrayscale: () =>
        setSettings((current) => ({
          ...current,
          grayscale: !current.grayscale,
        })),
      toggleReadableFont: () =>
        setSettings((current) => ({
          ...current,
          readableFont: !current.readableFont,
        })),
      toggleIncreasedSpacing: () =>
        setSettings((current) => ({
          ...current,
          increasedSpacing: !current.increasedSpacing,
        })),
      toggleReducedMotion: () =>
        setSettings((current) => ({
          ...current,
          reducedMotion: !current.reducedMotion,
        })),
      resetAccessibility: () => {
        setSettings(defaultSettings);
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignore
        }
      },
    }),
    [settings]
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within AccessibilityProvider"
    );
  }
  return context;
}