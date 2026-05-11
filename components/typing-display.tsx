"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useCaretStyle } from "@/hooks/use-caret-style";

interface TypingDisplayProps {
  mode: "text" | "code";
  words?: string[];
  lines?: string[];
  currentWordIndex?: number;
  currentLineIndex?: number;
  currentCharIndex: number;
  typedChars: Map<string, "correct" | "incorrect">;
  isActive: boolean;
  wordCount?: number;
}

export function TypingDisplay({
  mode,
  words,
  lines,
  currentWordIndex = 0,
  currentLineIndex = 0,
  currentCharIndex,
  typedChars,
  isActive,
  wordCount = 30,
}: TypingDisplayProps) {
  const { caretStyle } = useCaretStyle();

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

  // Text mode - word-based with spaces
  if (mode === "text" && words) {
    const visibleWords = words.slice(0, wordCount);
    const currentWordRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
      if (currentWordRef.current) {
        currentWordRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, [currentWordIndex]);

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

  // Code mode - line-based with line numbers
  if (mode === "code" && lines) {
    const visibleLines = lines;
    const currentLineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (currentLineRef.current) {
        currentLineRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, [currentLineIndex]);

    return (
      <div className="relative font-mono text-xl md:text-2xl leading-relaxed tracking-wide select-none whitespace-pre">
        {visibleLines.map((line, lineIdx) => {
          const isCurrentLine = lineIdx === currentLineIndex;

          return (
            <div
              ref={isCurrentLine ? currentLineRef : undefined}
              key={lineIdx}
              className={cn(
                "flex transition-colors duration-150 min-h-[1.5em]",
                isCurrentLine && "outline-none"
              )}
            >
              <span className="text-[var(--theme-sub)] select-none w-6 text-right mr-4 shrink-0">
                {lineIdx + 1}
              </span>
              <span className="inline-flex items-center whitespace-pre">
                {line.split("").map((char, charIdx) => {
                  const charKey = `${lineIdx}-${charIdx}`;
                  const charState = typedChars.get(charKey);
                  const isCurrent =
                    isCurrentLine && charIdx === currentCharIndex;
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
                {isCurrentLine && isActive && (
                  <span 
                    className={cn("relative inline-block", getCaretClasses())}
                    style={{ position: "relative", width: "1ch", height: "1em" }}
                  />
                )}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}