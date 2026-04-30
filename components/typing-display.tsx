"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useCaretStyle } from "@/hooks/use-caret-style";

interface TypingDisplayProps {
  words: string[];
  currentWordIndex: number;
  currentCharIndex: number;
  typedChars: Map<string, "correct" | "incorrect">;
  isActive: boolean;
  wordCount?: number;
}

export function TypingDisplay({
  words,
  currentWordIndex,
  currentCharIndex,
  typedChars,
  isActive,
  wordCount = 30,
}: TypingDisplayProps) {
  const visibleWords = words.slice(0, wordCount);
  const currentWordRef = useRef<HTMLSpanElement>(null);
  const { caretStyle } = useCaretStyle();

  useEffect(() => {
    if (currentWordRef.current) {
      currentWordRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentWordIndex]);

const getCaretClasses = () => {
    switch (caretStyle) {
      case "block":
        return "bg-[var(--theme-caret)] caret-blink rounded-sm -left-[2px] top-0 w-full h-full opacity-60";
      case "underline":
        return "bg-[var(--theme-caret)] rounded-sm left-0 bottom-0 w-full h-[3px] opacity-60";
      case "bar":
        return "bg-[var(--theme-caret)] caret-blink rounded-full left-0 top-0 w-[2px] h-full opacity-60";
      case "outline":
        return "border-2 border-[var(--theme-caret)] rounded-sm left-0 top-0 w-full h-full opacity-60";
      default:
        return "bg-[var(--theme-caret)] caret-blink rounded-full -left-[2px] top-0 w-[3px] h-full opacity-60";
    }
  };

  return (
    <div className="relative font-mono text-2xl md:text-3xl leading-relaxed tracking-wide select-none">
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {visibleWords.map((word, wordIdx) => {
          const isCurrentWord = wordIdx === currentWordIndex;

          return (
            <span
              ref={isCurrentWord ? currentWordRef : undefined}
              key={`${wordIdx}-${word}`}
              className="inline-flex transition-colors duration-150"
            >
              {word.split("").map((char, charIdx) => {
                const charKey = `${wordIdx}-${charIdx}`;
                const charState = typedChars.get(charKey);
                const isCurrent =
                  isCurrentWord && charIdx === currentCharIndex;
                const isTyped = charState !== undefined;

                return (
                  <span
                    key={charIdx}
                    className={cn(
                      "relative transition-colors duration-75",
                      !isTyped && !isCurrent && "text-[var(--theme-sub)]",
                      charState === "correct" && "text-[var(--theme-primary)]",
                      charState === "incorrect" && "text-[var(--theme-error)]",
                      isCurrent && "text-[var(--theme-fg)]"
                    )}
                  >
                    {isCurrent && isActive && caretStyle !== "bar" && (
                      <span className={cn("absolute", getCaretClasses())} />
                    )}
                    {char}
                    {isCurrent && isActive && caretStyle === "bar" && (
                      <span className={cn("absolute", getCaretClasses())} />
                    )}
                  </span>
                );
              })}
              {isCurrentWord && currentCharIndex >= word.length && isActive && (
                <span className="relative">
                  <span className={cn("absolute", getCaretClasses())} />
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}