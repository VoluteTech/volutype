"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export type ThemeMode = "light" | "dark" | "system";

export interface ColorTheme {
  id: string;
  name: string;
  style: "colorful" | "dark" | "monochrome" | "bw";
  colors: {
    bg: string;
    fg: string;
    bgAlt: string;
    sub: string;
    primary: string;
    secondary: string;
    caret: string;
    error: string;
    errorExtra: string;
  };
}

export const themes: ColorTheme[] = [
  {
    id: "default",
    name: "Default",
    style: "colorful",
    colors: {
      bg: "#ffffff",
      fg: "#1f1f1f",
      bgAlt: "#f7f7f7",
      sub: "#6b7280",
      primary: "#374151",
      secondary: "#e5e7eb",
      caret: "#374151",
      error: "#dc2626",
      errorExtra: "#fecaca",
    },
  },
  {
    id: "soft",
    name: "Soft",
    style: "colorful",
    colors: {
      bg: "#f5f5ff",
      fg: "#2e2e42",
      bgAlt: "#eaeaef",
      sub: "#85859e",
      primary: "#4a4a6a",
      secondary: "#dcdcef",
      caret: "#4a4a6a",
      error: "#e05555",
      errorExtra: "#fad2d2",
    },
  },
  {
    id: "blue",
    name: "Blue",
    style: "colorful",
    colors: {
      bg: "#dbeafe",
      fg: "#1e3a5f",
      bgAlt: "#bfdbfe",
      sub: "#64748b",
      primary: "#2563eb",
      secondary: "#93c5fd",
      caret: "#2563eb",
      error: "#dc2626",
      errorExtra: "#fecaca",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    style: "dark",
    colors: {
      bg: "#0f172a",
      fg: "#e2e8f0",
      bgAlt: "#1e293b",
      sub: "#64748b",
      primary: "#38bdf8",
      secondary: "#1e293b",
      caret: "#38bdf8",
      error: "#f87171",
      errorExtra: "#7f1d1d",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    style: "dark",
    colors: {
      bg: "#0a0a0f",
      fg: "#c4c4d4",
      bgAlt: "#14141f",
      sub: "#5c5c6e",
      primary: "#a855f7",
      secondary: "#1c1c2e",
      caret: "#a855f7",
      error: "#f87171",
      errorExtra: "#2e1a1a",
    },
  },
  {
    id: "rose",
    name: "Rose",
    style: "dark",
    colors: {
      bg: "#1a1012",
      fg: "#f5d0d6",
      bgAlt: "#2a1518",
      sub: "#8b5a62",
      primary: "#fb7185",
      secondary: "#2d151a",
      caret: "#fb7185",
      error: "#fbbfbf",
      errorExtra: "#3d1f22",
    },
  },
  {
    id: "forest",
    name: "Forest",
    style: "dark",
    colors: {
      bg: "#0a120a",
      fg: "#c8d4c8",
      bgAlt: "#121a12",
      sub: "#5c6e5c",
      primary: "#4ade80",
      secondary: "#141c14",
      caret: "#4ade80",
      error: "#86efac",
      errorExtra: "#1a2e1a",
    },
  },
  {
    id: "slate",
    name: "Slate",
    style: "dark",
    colors: {
      bg: "#1e1e2e",
      fg: "#cdd6f4",
      bgAlt: "#2a2a3e",
      sub: "#6c7086",
      primary: "#89b4fa",
      secondary: "#313244",
      caret: "#89b4fa",
      error: "#f38ba8",
      errorExtra: "#3d2a35",
    },
  },
];

export function useColorTheme() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [colorTheme, setColorTheme] = useState<string>("default");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("volutype-theme");
    if (saved) {
      setColorTheme(saved);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const currentTheme = themes.find((t) => t.id === colorTheme) || themes[0];
    document.documentElement.style.setProperty("--theme-bg", currentTheme.colors.bg);
    document.documentElement.style.setProperty("--theme-fg", currentTheme.colors.fg);
    document.documentElement.style.setProperty(
      "--theme-bg-alt",
      currentTheme.colors.bgAlt
    );
    document.documentElement.style.setProperty("--theme-sub", currentTheme.colors.sub);
    document.documentElement.style.setProperty(
      "--theme-primary",
      currentTheme.colors.primary
    );
    document.documentElement.style.setProperty(
      "--theme-secondary",
      currentTheme.colors.secondary
    );
    document.documentElement.style.setProperty(
      "--theme-caret",
      currentTheme.colors.caret
    );
    document.documentElement.style.setProperty(
      "--theme-error",
      currentTheme.colors.error
    );
    document.documentElement.style.setProperty(
      "--theme-error-extra",
      currentTheme.colors.errorExtra
    );
    localStorage.setItem("volutype-theme", colorTheme);
  }, [colorTheme, mounted]);

  const selectTheme = (themeId: string) => {
    setColorTheme(themeId);
  };

  return {
    theme: colorTheme,
    themes,
    selectTheme,
    mounted,
  };
}