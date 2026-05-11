"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { generateWords } from "@/lib/words";
import { generateCodeSnippet, CodeLanguage } from "@/lib/code-snippets";

export type TestStatus = "idle" | "running" | "finished";
export type TestMode = "text" | "code";

interface TypingTestState {
  lines: string[];
  currentLineIndex: number;
  currentCharIndex: number;
  typedChars: Map<string, "correct" | "incorrect">;
  status: TestStatus;
  startTime: number | null;
  endTime: number | null;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  currentWordIndex: number;
}

interface TypingTestActions {
  handleKeyDown: (e: KeyboardEvent) => void;
  reset: () => void;
  setWordCount: (count: number) => void;
  setLineCount: (count: number) => void;
  setLanguage: (language: CodeLanguage) => void;
  setMode: (mode: TestMode) => void;
}

interface TypingTestResult {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  time: number;
}

export function useTypingTest(
  initialWordCount: number = 30,
  initialLineCount: number = 10,
  initialLanguage: CodeLanguage = "javascript"
) {
  const [mode, setModeState] = useState<TestMode>("text");
  const [wordCount, setWordCount] = useState(initialWordCount);
  const [lineCount, setLineCount] = useState(initialLineCount);
  const [language, setLanguage] = useState<CodeLanguage>(initialLanguage);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [state, setState] = useState<TypingTestState>({
    lines: generateWords(100),
    currentLineIndex: 0,
    currentCharIndex: 0,
    typedChars: new Map(),
    status: "idle",
    startTime: null,
    endTime: null,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0,
    currentWordIndex: 0,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

const getContent = useCallback(() => {
    if (mode === "code") {
      const lines: string[] = [];
      for (let i = 0; i < lineCount; i++) {
        lines.push(...generateCodeSnippet(language));
      }
      return lines.slice(0, lineCount);
    } else {
      return generateWords(100);
    }
  }, [mode, language, lineCount]);

  const getVisibleCount = useCallback(() => {
    return mode === "text" ? wordCount : lineCount;
  }, [mode, wordCount, lineCount]);

  const getDisplayMode = useCallback(() => {
    return mode;
  }, [mode]);

  const getContentAsLines = useCallback(() => {
    if (mode === "text") {
      const words = generateWords(100);
      const lines: string[] = [];
      let currentLine = "";
      words.forEach((w, i) => {
        if (i % wordCount === 0 && currentLine.length > 0) {
          lines.push(currentLine.trim());
          currentLine = "";
        }
        currentLine += w + (i % wordCount === wordCount - 1 ? "" : " ");
      });
      if (currentLine.trim()) lines.push(currentLine.trim());
      return lines.slice(0, wordCount);
    }
    return Array(lineCount).fill("").map((_, i) => {
      const snippet = generateCodeSnippet(language);
      return snippet[i % snippet.length] || "";
    });
  }, [mode, language, lineCount, wordCount]);

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setElapsedTime(0);
    const words = generateWords(100);
    const lines = getContentAsLines();
    setState({
      lines: mode === "text" ? words : lines,
      currentLineIndex: 0,
      currentCharIndex: 0,
      typedChars: new Map(),
      status: "idle",
      startTime: null,
      endTime: null,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
      currentWordIndex: 0,
    });
  }, [mode, getContentAsLines]);

  const handleWordCountChange = useCallback((newWordCount: number) => {
    setWordCount(newWordCount);
    setElapsedTime(0);
    setModeState("text");
    const words = generateWords(100);
    setState({
      lines: words,
      currentLineIndex: 0,
      currentCharIndex: 0,
      typedChars: new Map(),
      status: "idle",
      startTime: null,
      endTime: null,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
      currentWordIndex: 0,
    });
  }, []);

  const handleLineCountChange = useCallback((newLineCount: number) => {
    setLineCount(newLineCount);
    setElapsedTime(0);
    setModeState("code");
    const lines = Array(newLineCount).fill("").map((_, i) => {
      const snippet = generateCodeSnippet(language);
      return snippet[i % snippet.length] || "";
    });
    setState({
      lines,
      currentLineIndex: 0,
      currentCharIndex: 0,
      typedChars: new Map(),
      status: "idle",
      startTime: null,
      endTime: null,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
      currentWordIndex: 0,
    });
  }, [language]);

  const handleLanguageChange = useCallback((newLanguage: CodeLanguage) => {
    setLanguage(newLanguage);
    setElapsedTime(0);
    const lines = Array(lineCount).fill("").map((_, i) => {
      const snippet = generateCodeSnippet(newLanguage);
      return snippet[i % snippet.length] || "";
    });
    setState({
      lines,
      currentLineIndex: 0,
      currentCharIndex: 0,
      typedChars: new Map(),
      status: "idle",
      startTime: null,
      endTime: null,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
      currentWordIndex: 0,
    });
  }, [lineCount]);

  const handleModeChange = useCallback((newMode: TestMode) => {
    setModeState(newMode);
    setElapsedTime(0);
    if (newMode === "text") {
      const words = generateWords(100);
      setState({
        lines: words,
        currentLineIndex: 0,
        currentCharIndex: 0,
        typedChars: new Map(),
        status: "idle",
        startTime: null,
        endTime: null,
        correctChars: 0,
        incorrectChars: 0,
        totalChars: 0,
        currentWordIndex: 0,
      });
    } else {
      const lines = Array(lineCount).fill("").map((_, i) => {
        const snippet = generateCodeSnippet(language);
        return snippet[i % snippet.length] || "";
      });
      setState({
        lines,
        currentLineIndex: 0,
        currentCharIndex: 0,
        typedChars: new Map(),
        status: "idle",
        startTime: null,
        endTime: null,
        correctChars: 0,
        incorrectChars: 0,
        totalChars: 0,
        currentWordIndex: 0,
      });
    }
  }, [wordCount, lineCount, language]);

  useEffect(() => {
    if (state.status === "running") {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [state.status]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (state.status === "finished") return;

      const key = e.key;

      if (state.status === "idle" && (key.length === 1 || key === "Enter")) {
        setState((prev) => ({
          ...prev,
          status: "running",
          startTime: Date.now(),
        }));
      }

      if (state.status === "idle" && key.length !== 1 && key !== "Enter") return;

      const currentLine = state.lines[state.currentLineIndex];
      const currentChar = currentLine[state.currentCharIndex];

      if (key === "Backspace") {
        e.preventDefault();
        setState((prev) => {
          if (prev.currentCharIndex > 0) {
            const newTypedChars = new Map(prev.typedChars);
            const charKey = `${prev.currentLineIndex}-${prev.currentCharIndex - 1}`;
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
          } else if (prev.currentLineIndex > 0) {
            const prevLine = prev.lines[prev.currentLineIndex - 1];
            const newTypedChars = new Map(prev.typedChars);
            const charKey = `${prev.currentLineIndex - 1}-${prevLine.length - 1}`;
            const wasCorrect = newTypedChars.get(charKey) === "correct";
            if (wasCorrect) newTypedChars.delete(charKey);
            
            return {
              ...prev,
              currentLineIndex: prev.currentLineIndex - 1,
              currentCharIndex: prevLine.length > 0 ? prevLine.length - 1 : 0,
              typedChars: newTypedChars,
              correctChars: wasCorrect ? prev.correctChars - 1 : prev.correctChars,
              incorrectChars: !wasCorrect && newTypedChars.get(charKey) === "incorrect" ? prev.incorrectChars - 1 : prev.incorrectChars,
              totalChars: prev.totalChars - 1,
            };
          }
          return prev;
        });
        return;
      }

      if (key === "Enter") {
        e.preventDefault();
        
        const nextLineIndex = state.currentLineIndex + 1;
        const isLastLine = nextLineIndex >= getVisibleCount();
        
        if (isLastLine && state.currentLineIndex >= getVisibleCount() - 1) {
          setState((prev) => ({
            ...prev,
            status: "finished",
            endTime: Date.now(),
          }));
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return;
        }
        
        setState((prev) => ({
          ...prev,
          currentLineIndex: nextLineIndex,
          currentCharIndex: 0,
        }));
        return;
      }

      if (key === " ") {
        e.preventDefault();
        // In code mode, space is a regular character to type
        if (mode === "code") {
          const isCorrect = true; // space is always "correct" since it matches
          const charKey = `${state.currentLineIndex}-${state.currentCharIndex}`;
          
          const isLastChar = state.currentCharIndex + 1 >= currentLine.length;
          const isLastLine = isLastChar && state.currentLineIndex >= getVisibleCount() - 1;

          if (isLastLine) {
            setState((prev) => ({
              ...prev,
              currentCharIndex: prev.currentCharIndex + 1,
              typedChars: new Map(prev.typedChars).set(charKey, "correct"),
              correctChars: prev.correctChars + 1,
              totalChars: prev.totalChars + 1,
              status: "finished",
              endTime: Date.now(),
            }));
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            return;
          }

          if (isLastChar) {
            setState((prev) => ({
              ...prev,
              currentLineIndex: prev.currentLineIndex + 1,
              currentCharIndex: 0,
              typedChars: new Map(prev.typedChars).set(charKey, "correct"),
              correctChars: prev.correctChars + 1,
              totalChars: prev.totalChars + 1,
            }));
            return;
          }

          setState((prev) => ({
            ...prev,
            currentCharIndex: prev.currentCharIndex + 1,
            typedChars: new Map(prev.typedChars).set(charKey, "correct"),
            correctChars: prev.correctChars + 1,
            totalChars: prev.totalChars + 1,
          }));
          return;
        }
        
        // In text mode, space moves to next word
        if (state.currentCharIndex > 0) {
          setState((prev) => ({
            ...prev,
            currentLineIndex: prev.currentLineIndex + 1,
            currentCharIndex: 0,
          }));
        }
        return;
      }

      if (key.length === 1) {
        e.preventDefault();
        const isCorrect = key === currentChar;
        const charKey = `${state.currentLineIndex}-${state.currentCharIndex}`;

        const isLastChar = state.currentCharIndex + 1 >= currentLine.length;
        const isLastLine = isLastChar && state.currentLineIndex >= getVisibleCount() - 1;

        if (isLastLine) {
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
            status: "finished",
            endTime: Date.now(),
          }));
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return;
        }

        // In code mode, don't auto-advance to next line - user must press Enter
        if (isLastChar && mode === "code") {
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
          return;
        }

        if (isLastChar) {
          setState((prev) => ({
            ...prev,
            currentLineIndex: prev.currentLineIndex + 1,
            currentCharIndex: 0,
            typedChars: new Map(prev.typedChars).set(
              charKey,
              isCorrect ? "correct" : "incorrect"
            ),
            correctChars: isCorrect ? prev.correctChars + 1 : prev.correctChars,
            incorrectChars: !isCorrect ? prev.incorrectChars + 1 : prev.incorrectChars,
            totalChars: prev.totalChars + 1,
          }));
          return;
        }

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
    [state, getVisibleCount, mode]
  );

  const result: TypingTestResult | null =
    state.status === "finished"
      ? {
          wpm: Math.round((state.correctChars / 5) / (elapsedTime / 60)) || 0,
          accuracy:
            state.totalChars > 0
              ? Math.round((state.correctChars / state.totalChars) * 100)
              : 0,
          correctChars: state.correctChars,
          incorrectChars: state.incorrectChars,
          time: elapsedTime,
        }
      : null;

  return {
    lines: state.lines,
    currentLineIndex: state.currentLineIndex,
    currentCharIndex: state.currentCharIndex,
    typedChars: state.typedChars,
    status: state.status,
    elapsedTime,
    mode,
    wordCount,
    lineCount,
    language,
    result,
    handleKeyDown,
    reset,
    setWordCount: handleWordCountChange,
    setLineCount: handleLineCountChange,
    setLanguage: handleLanguageChange,
    setMode: handleModeChange,
    displayMode: mode,
    words: mode === "text" ? state.lines.slice(0, wordCount) : [],
    contentLines: mode === "code" ? state.lines : [],
  };
}