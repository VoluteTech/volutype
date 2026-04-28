"use client";

import { useEffect, useRef } from "react";
import { RotateCcw, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTypingTest } from "@/hooks/use-typing-test";
import { TypingDisplay } from "@/components/typing-display";
import { TypingResults } from "@/components/typing-results";
import { Button } from "@/components/ui/button";

const WORD_OPTIONS = [30, 100];

export function TypingTest() {
  const {
    words,
    currentWordIndex,
    currentCharIndex,
    typedChars,
    status,
    elapsedTime,
    wordCount,
    result,
    handleKeyDown,
    reset,
    setWordCount,
  } = useTypingTest(30);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      handleKeyDown(e);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKeyDown]);

  // Focus management
  useEffect(() => {
    containerRef.current?.focus();
  }, [status]);

  if (status === "finished" && result) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <TypingResults
          wpm={result.wpm}
          accuracy={result.accuracy}
          correctChars={result.correctChars}
          incorrectChars={result.incorrectChars}
          time={result.time}
          onReset={reset}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="w-full max-w-4xl mx-auto px-2 outline-none"
    >
      {/* Header controls */}
      <div className="flex items-center justify-between mb-12">
        {/* Word count selector */}
        <div className="flex items-center gap-1">
          {WORD_OPTIONS.map((count) => (
            <button
              key={count}
              onClick={() => setWordCount(count)}
              disabled={status === "running"}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition-all",
                wordCount === count
                  ? "text-[var(--theme-fg)]"
                  : "text-[var(--theme-sub)] hover:text-[var(--theme-fg)]",
                status === "running" && "opacity-50 cursor-not-allowed"
              )}
            >
              {count} words
            </button>
          ))}
        </div>

        {/* Reset button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={reset}
          className="text-[var(--theme-sub)] hover:text-[var(--theme-fg)]"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      {/* Typing area */}
      <div className="relative">
        <div
          className={cn(
            "transition-opacity duration-300",
            status === "idle" && "opacity-60"
          )}
        >
          <TypingDisplay
            words={words}
            currentWordIndex={currentWordIndex}
            currentCharIndex={currentCharIndex}
            typedChars={typedChars}
            isActive={status !== "finished"}
            wordCount={wordCount}
          />
        </div>
      </div>

      {/* Footer hint */}
      <div className="mt-12 flex justify-center">
        <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--theme-sub)" }}>
          Press Tab + Enter to restart
        </span>
      </div>
    </div>
  );
}
