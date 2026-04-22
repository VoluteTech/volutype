"use client";

import { useEffect, useRef } from "react";
import { RotateCcw, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTypingTest } from "@/hooks/use-typing-test";
import { TypingDisplay } from "@/components/typing-display";
import { TypingResults } from "@/components/typing-results";
import { Button } from "@/components/ui/button";

const TIME_OPTIONS = [15, 30, 60, 120];

export function TypingTest() {
  const {
    words,
    currentWordIndex,
    currentCharIndex,
    typedChars,
    status,
    timeLeft,
    duration,
    result,
    handleKeyDown,
    reset,
    setDuration,
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
      className="w-full max-w-4xl mx-auto px-4 outline-none"
    >
      {/* Header controls */}
      <div className="flex items-center justify-between mb-12">
        {/* Time selector */}
        <div className="flex items-center gap-1">
          {TIME_OPTIONS.map((time) => (
            <button
              key={time}
              onClick={() => setDuration(time)}
              disabled={status === "running"}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition-all",
                duration === time
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground",
                status === "running" && "opacity-50 cursor-not-allowed"
              )}
            >
              {time}
            </button>
          ))}
        </div>

        {/* Timer display */}
        <div className="flex items-center gap-6">
          <span
            className={cn(
              "text-4xl font-light tabular-nums transition-colors",
              status === "running" ? "text-primary" : "text-muted-foreground"
            )}
          >
            {timeLeft}
          </span>

          {/* Reset button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={reset}
            className="text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
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
          />
        </div>
      </div>

      {/* Footer hint */}
      <div className="mt-12 flex justify-center">
        <span className="text-xs text-muted-foreground/60 uppercase tracking-[0.15em]">
          Press Tab + Enter to restart
        </span>
      </div>
    </div>
  );
}
