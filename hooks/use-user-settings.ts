"use client";

import { useEffect, useState, useCallback } from "react";
import { auth } from "@/lib/auth";
import { useCaretStyle } from "./use-caret-style";
import { useColorTheme } from "./use-color-theme";

const settingsState = {
  data: {
    theme: "default",
    caretStyle: "block",
    wordCount: 30,
  },
  listeners: new Set<() => void>(),
  loaded: false,

  setData(data: { theme: string; caretStyle: string; wordCount: number }) {
    this.data = data;
    this.listeners.forEach(fn => fn());
  },

  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  },

  getData() {
    return this.data;
  },

  async fetch(userId: string) {
    try {
      const res = await fetch(`/api/user/settings`);
      if (res.ok) {
        const data = await res.json();
        this.setData(data);
      }
    } catch (e) {
      console.error("Failed to fetch settings", e);
    }
    this.loaded = true;
  },

  async save(settings: { theme?: string; caretStyle?: string; wordCount?: number }) {
    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        const data = await res.json();
        this.setData(data);
      }
    } catch (e) {
      console.error("Failed to save settings", e);
    }
  }
};

export function useUserSettings() {
  const [, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = settingsState.subscribe(() => {
      setTick(t => t + 1);
    });

    auth().then(session => {
      if (session?.user?.id) {
        settingsState.fetch(session.user.id);
      } else {
        settingsState.loaded = true;
      }
    }).catch(() => {
      settingsState.loaded = true;
    });

    return unsubscribe;
  }, []);

  const saveTheme = useCallback(async (theme: string) => {
    await settingsState.save({ theme });
  }, []);

  const saveCaretStyle = useCallback(async (caretStyle: string) => {
    await settingsState.save({ caretStyle });
  }, []);

  const saveWordCount = useCallback(async (wordCount: number) => {
    await settingsState.save({ wordCount });
  }, []);

  return {
    settings: settingsState.getData(),
    saveTheme,
    saveCaretStyle,
    saveWordCount,
    loaded: settingsState.loaded,
    mounted,
  };
}