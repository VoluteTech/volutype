"use client";

import { cn } from "@/lib/utils";

interface TypingDisplayProps {
  words: string[];
  currentWordIndex: number;
  currentCharIndex: number;
  typedChars: Map<string, "correct" | "incorrect">;
  isActive: boolean;
}

export function TypingDisplay({
  words,
  currentWordIndex,
  currentCharIndex,
  typedChars,
  isActive,
}: TypingDisplayProps) {
  // Show only a subset of words around the current word
  const visibleWordCount = 35;
  const startIndex = Math.max(0, currentWordIndex - 5);
  const endIndex = Math.min(words.length, startIndex + visibleWordCount);
  const visibleWords = words.slice(startIndex, endIndex);

  return (
    <div className="relative font-mono text-2xl md:text-3xl leading-relaxed tracking-wide select-none">
      <div className="flex flex-wrap gap-x-3 gap-y-2">
        {visibleWords.map((word, wordIdx) => {
          const actualWordIndex = startIndex + wordIdx;
          const isCurrentWord = actualWordIndex === currentWordIndex;
          const isPastWord = actualWordIndex < currentWordIndex;

          return (
            <span
              key={`${actualWordIndex}-${word}`}
              className={cn(
                "inline-flex transition-colors duration-150",
                isPastWord && "opacity-40"
              )}
            >
              {word.split("").map((char, charIdx) => {
                const charKey = `${actualWordIndex}-${charIdx}`;
                const charState = typedChars.get(charKey);
                const isCurrent =
                  isCurrentWord && charIdx === currentCharIndex;
                const isTyped = charState !== undefined;

                return (
                  <span
                    key={charIdx}
                    className={cn(
                      "relative transition-colors duration-75",
                      // Default state
                      !isTyped && !isCurrent && "text-muted-foreground",
                      // Correct state
                      charState === "correct" && "text-correct",
                      // Incorrect state
                      charState === "incorrect" && "text-incorrect",
                      // Current character cursor
                      isCurrent && "text-foreground"
                    )}
                  >
                    {isCurrent && isActive && (
                      <span className="absolute -left-[2px] top-0 w-[3px] h-full bg-cursor caret-blink rounded-full" />
                    )}
                    {char}
                  </span>
                );
              })}
              {/* Show cursor at end of word if we've typed past it */}
              {isCurrentWord && currentCharIndex >= word.length && isActive && (
                <span className="relative">
                  <span className="absolute left-0 top-0 w-[3px] h-full bg-cursor caret-blink rounded-full" />
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
