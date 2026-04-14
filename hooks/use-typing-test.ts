"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { generateWords } from "@/lib/words";

export type TestStatus = "idle" | "running" | "finished";

interface TypingTestState {
  words: string[];
  currentWordIndex: number;
  currentCharIndex: number;
  typedChars: Map<string, "correct" | "incorrect">;
  status: TestStatus;
  startTime: number | null;
  endTime: number | null;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
}

interface TypingTestActions {
  handleKeyDown: (e: KeyboardEvent) => void;
  reset: () => void;
  setDuration: (duration: number) => void;
}

interface TypingTestResult {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  time: number;
}

export function useTypingTest(initialDuration: number = 30) {
  const [duration, setDuration] = useState(initialDuration);
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [state, setState] = useState<TypingTestState>({
    words: generateWords(100),
    currentWordIndex: 0,
    currentCharIndex: 0,
    typedChars: new Map(),
    status: "idle",
    startTime: null,
    endTime: null,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeLeft(duration);
    setState({
      words: generateWords(100),
      currentWordIndex: 0,
      currentCharIndex: 0,
      typedChars: new Map(),
      status: "idle",
      startTime: null,
      endTime: null,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
    });
  }, [duration]);

  const handleDurationChange = useCallback((newDuration: number) => {
    setDuration(newDuration);
    setTimeLeft(newDuration);
    setState(prev => ({
      ...prev,
      words: generateWords(100),
      currentWordIndex: 0,
      currentCharIndex: 0,
      typedChars: new Map(),
      status: "idle",
      startTime: null,
      endTime: null,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
    }));
  }, []);

  useEffect(() => {
    if (state.status === "running" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setState((s) => ({
              ...s,
              status: "finished",
              endTime: Date.now(),
            }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [state.status, timeLeft]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (state.status === "finished") return;

      const key = e.key;

      // Start the test on first keypress
      if (state.status === "idle" && key.length === 1) {
        setState((prev) => ({
          ...prev,
          status: "running",
          startTime: Date.now(),
        }));
      }

      if (state.status === "idle" && key.length !== 1) return;

      const currentWord = state.words[state.currentWordIndex];
      const currentChar = currentWord[state.currentCharIndex];

      if (key === "Backspace") {
        e.preventDefault();
        setState((prev) => {
          if (prev.currentCharIndex > 0) {
            const newTypedChars = new Map(prev.typedChars);
            const charKey = `${prev.currentWordIndex}-${prev.currentCharIndex - 1}`;
            const wasCorrect = newTypedChars.get(charKey) === "correct";
            newTypedChars.delete(charKey);
            
            return {
              ...prev,
              currentCharIndex: prev.currentCharIndex - 1,
              typedChars: newTypedChars,
              correctChars: wasCorrect ? prev.correctChars - 1 : prev.correctChars,
              incorrectChars: !wasCorrect ? prev.incorrectChars - 1 : prev.incorrectChars,
              totalChars: prev.totalChars - 1,
            };
          }
          return prev;
        });
        return;
      }

      if (key === " ") {
        e.preventDefault();
        // Move to next word if we've typed at least one character
        if (state.currentCharIndex > 0) {
          setState((prev) => ({
            ...prev,
            currentWordIndex: prev.currentWordIndex + 1,
            currentCharIndex: 0,
          }));
        }
        return;
      }

      if (key.length === 1) {
        e.preventDefault();
        const isCorrect = key === currentChar;
        const charKey = `${state.currentWordIndex}-${state.currentCharIndex}`;

        setState((prev) => ({
          ...prev,
          currentCharIndex: prev.currentCharIndex + 1,
          typedChars: new Map(prev.typedChars).set(
            charKey,
            isCorrect ? "correct" : "incorrect"
          ),
          correctChars: isCorrect ? prev.correctChars + 1 : prev.correctChars,
          incorrectChars: !isCorrect ? prev.incorrectChars + 1 : prev.incorrectChars,
          totalChars: prev.totalChars + 1,
        }));
      }
    },
    [state]
  );

  const result: TypingTestResult | null =
    state.status === "finished"
      ? {
          wpm: Math.round((state.correctChars / 5) / (duration / 60)),
          accuracy:
            state.totalChars > 0
              ? Math.round((state.correctChars / state.totalChars) * 100)
              : 0,
          correctChars: state.correctChars,
          incorrectChars: state.incorrectChars,
          time: duration,
        }
      : null;

  return {
    words: state.words,
    currentWordIndex: state.currentWordIndex,
    currentCharIndex: state.currentCharIndex,
    typedChars: state.typedChars,
    status: state.status,
    timeLeft,
    duration,
    result,
    handleKeyDown,
    reset,
    setDuration: handleDurationChange,
  };
}
