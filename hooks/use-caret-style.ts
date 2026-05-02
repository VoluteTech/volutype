"use client";

import { useEffect, useState, useCallback } from "react";

export type CaretStyle = "block" | "underline" | "bar" | "outline";

export interface CaretStyleOption {
  id: CaretStyle;
  name: string;
}

export const caretStyles: CaretStyleOption[] = [
  { id: "block", name: "Block" },
  { id: "underline", name: "Underline" },
  { id: "bar", name: "Bar" },
  { id: "outline", name: "Outline" },
];

const caretStyleState = {
  style: "block" as CaretStyle,
  listeners: new Set<() => void>(),
  loadedFromDb: false,
  
  setStyle(style: CaretStyle, saveToDb = true) {
    this.style = style;
    localStorage.setItem("volutype-caret-style", style);
    this.listeners.forEach(fn => fn());
    
    if (saveToDb) {
      fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caretStyle: style }),
      }).catch(() => {
        // User not logged in, that's fine
      });
    }
  },
  
  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  },
  
  getStyle() {
    return this.style;
  }
};

export function useCaretStyle() {
  const [, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // First load from localStorage
    const saved = localStorage.getItem("volutype-caret-style");
    if (saved && caretStyles.some((s) => s.id === saved)) {
      caretStyleState.setStyle(saved as CaretStyle, false);
    }
    
    // Then try to load from DB
    fetch("/api/user/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.caretStyle && caretStyles.some((s) => s.id === data.caretStyle)) {
          caretStyleState.setStyle(data.caretStyle as CaretStyle, false);
        }
        caretStyleState.loadedFromDb = true;
      })
      .catch(() => {
        caretStyleState.loadedFromDb = true;
      });
  }, []);

  useEffect(() => {
    const unsubscribe = caretStyleState.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsubscribe;
  }, []);

  const selectCaretStyle = useCallback((style: CaretStyle) => {
    caretStyleState.setStyle(style, true);
  }, []);

  return {
    caretStyle: caretStyleState.getStyle(),
    caretStyles,
    selectCaretStyle,
    mounted,
  };
}