"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TypingResultsProps {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  time: number;
  onReset: () => void;
}

export function TypingResults({
  wpm,
  accuracy,
  correctChars,
  incorrectChars,
  time,
  onReset,
}: TypingResultsProps) {
  return (
    <div className="flex flex-col items-center gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm uppercase tracking-[0.2em]" style={{ color: "var(--theme-sub)" }}>
          words per minute
        </span>
        <span className="text-8xl md:text-9xl font-light tabular-nums" style={{ color: "var(--theme-primary)" }}>
          {wpm}
        </span>
      </div>

      <div className="flex gap-16 md:gap-24">
        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl md:text-5xl font-light tabular-nums" style={{ color: "var(--theme-fg)" }}>
            {accuracy}%
          </span>
          <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--theme-sub)" }}>
            accuracy
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl md:text-5xl font-light tabular-nums" style={{ color: "var(--theme-fg)" }}>
            {correctChars}
          </span>
          <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--theme-sub)" }}>
            correct
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl md:text-5xl font-light tabular-nums" style={{ color: "var(--theme-error)" }}>
            {incorrectChars}
          </span>
          <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--theme-sub)" }}>
            errors
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1" style={{ color: "var(--theme-sub)" }}>
        <span className="text-sm">
          Test completed in {time} seconds
        </span>
      </div>

      <Button
        onClick={onReset}
        variant="ghost"
        size="lg"
        className="gap-2 transition-colors"
        style={{ color: "var(--theme-sub)" }}
      >
        <RotateCcw className="w-4 h-4" />
        <span className="text-sm uppercase tracking-[0.1em]">Try again</span>
      </Button>
    </div>
  );
}
