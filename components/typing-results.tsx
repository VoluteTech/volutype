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
        <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          words per minute
        </span>
        <span className="text-8xl md:text-9xl font-light text-primary tabular-nums">
          {wpm}
        </span>
      </div>

      <div className="flex gap-16 md:gap-24">
        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl md:text-5xl font-light text-foreground tabular-nums">
            {accuracy}%
          </span>
          <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            accuracy
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl md:text-5xl font-light text-foreground tabular-nums">
            {correctChars}
          </span>
          <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            correct
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl md:text-5xl font-light text-incorrect tabular-nums">
            {incorrectChars}
          </span>
          <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            errors
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 text-muted-foreground">
        <span className="text-sm">
          Test completed in {time} seconds
        </span>
      </div>

      <Button
        onClick={onReset}
        variant="ghost"
        size="lg"
        className="gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        <span className="text-sm uppercase tracking-[0.1em]">Try again</span>
      </Button>
    </div>
  );
}
