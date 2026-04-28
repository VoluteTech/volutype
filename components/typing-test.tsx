"use client";

import { useEffect, useRef, useCallback } from "react";
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

  const isZenMode = status === "running";

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        reset();
        return;
      }

      handleKeyDown(e);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKeyDown, reset]);

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
      {/* Header controls - hidden in zen mode (keep space, just hide visually) */}
      <div
        className={cn(
          "flex items-center justify-between mb-12 transition-all duration-300",
          isZenMode && "opacity-0 select-none pointer-events-none"
        )}
        style={{ visibility: isZenMode ? "hidden" : "visible" }}
      >
        {/* Word count selector */}
        <div className="flex items-center gap-1">
          {WORD_OPTIONS.map((count) => (
            <button
              key={count}
              onClick={() => setWordCount(count)}
              disabled={status === "running"}
              className={cn(
                "px-3 py-1.5 text-sm cursor-pointer rounded-md transition-all",
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
          className="text-[var(--theme-sub)] hover:text-[var(--theme-fg)] cursor-pointer"
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

      {/* Footer hint - hidden in zen mode (keep space, just hide visually) */}
      <div
        className={cn(
          "mt-12 flex justify-center transition-all duration-300",
          isZenMode && "opacity-0 select-none pointer-events-none"
        )}
        style={{ visibility: isZenMode ? "hidden" : "visible" }}
      >
        <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--theme-sub)" }}>
          Press Tab or Enter to restart
        </span>
      </div>
    </div>
  );
}
