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
  
  setStyle(style: CaretStyle) {
    this.style = style;
    localStorage.setItem("volutype-caret-style", style);
    this.listeners.forEach(fn => fn());
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
    const saved = localStorage.getItem("volutype-caret-style");
    if (saved && caretStyles.some((s) => s.id === saved)) {
      caretStyleState.setStyle(saved as CaretStyle);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = caretStyleState.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsubscribe;
  }, []);

  const selectCaretStyle = useCallback((style: CaretStyle) => {
    caretStyleState.setStyle(style);
  }, []);

  return {
    caretStyle: caretStyleState.getStyle(),
    caretStyles,
    selectCaretStyle,
    mounted,
  };
}