"use client";

import { useEffect, useRef } from "react";
import { RotateCcw, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTypingTest, TestMode } from "@/hooks/use-typing-test";
import { TypingDisplay } from "@/components/typing-display";
import { TypingResults } from "@/components/typing-results";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LANGUAGES, CodeLanguage } from "@/lib/code-snippets";

const TEXT_OPTIONS = [30, 100];
const CODE_OPTIONS = [10, 15, 20, 25, 30, 35, 40, 45, 50];

export function TypingTest() {
  const {
    lines,
    currentLineIndex,
    currentCharIndex,
    typedChars,
    status,
    mode,
    wordCount,
    lineCount,
    language,
    words,
    contentLines,
    result,
    handleKeyDown,
    reset,
    setWordCount,
    setLineCount,
    setLanguage,
    setMode,
  } = useTypingTest(30, 10, "javascript");

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

      if (e.key === "Tab") {
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
      {/* Header controls - hidden in zen mode */}
      <div
        className={cn(
          "flex items-center justify-between mb-8 transition-all duration-300",
          isZenMode && "opacity-0 select-none pointer-events-none"
        )}
        style={{ visibility: isZenMode ? "hidden" : "visible" }}
      >
        {/* Mode selector and options */}
        <div className="flex items-center gap-4">
          {/* Mode toggle */}
          <div className="flex items-center gap-1 bg-[var(--theme-bg-alt)] rounded-lg p-1">
            <button
              onClick={() => setMode("text")}
              className={cn(
                "px-3 py-1.5 text-sm cursor-pointer rounded-md transition-all",
                mode === "text"
                  ? "text-[var(--theme-fg)] bg-[var(--theme-bg)] shadow-sm"
                  : "text-[var(--theme-sub)] hover:text-[var(--theme-fg)]"
              )}
              disabled={status === "running"}
            >
              Text
            </button>
            <button
              onClick={() => setMode("code")}
              className={cn(
                "px-3 py-1.5 text-sm cursor-pointer rounded-md transition-all",
                mode === "code"
                  ? "text-[var(--theme-fg)] bg-[var(--theme-bg)] shadow-sm"
                  : "text-[var(--theme-sub)] hover:text-[var(--theme-fg)]"
              )}
              disabled={status === "running"}
            >
              Code
            </button>
          </div>

          {/* Count selector or Language selector */}
          {mode === "text" ? (
            <div className="flex items-center gap-1">
              {TEXT_OPTIONS.map((count) => (
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
          ) : (
            <div className="flex items-center gap-3">
              {/* Line count selector */}
              <div className="flex items-center gap-1">
                {CODE_OPTIONS.filter(o => o <= 30).map((count) => (
                  <button
                    key={count}
                    onClick={() => setLineCount(count)}
                    disabled={status === "running"}
                    className={cn(
                      "px-2 py-1 text-xs cursor-pointer rounded-md transition-all",
                      lineCount === count
                        ? "text-[var(--theme-fg)]"
                        : "text-[var(--theme-sub)] hover:text-[var(--theme-fg)]",
                      status === "running" && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {count}
                  </button>
                ))}
              </div>

{/* Language selector - using native select to avoid keyboard issues */}
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value as CodeLanguage);
                  setTimeout(() => {
                    containerRef.current?.focus();
                  }, 10);
                }}
                disabled={status === "running"}
                className="h-8 px-2 text-sm rounded-md cursor-pointer"
                style={{ 
                  background: "var(--theme-bg)",
                  borderColor: "var(--theme-secondary)",
                  color: "var(--theme-fg)",
                  borderWidth: "1px",
                  borderStyle: "solid"
                }}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          )}
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
            mode={mode}
            words={words}
            lines={contentLines}
            currentWordIndex={mode === "text" ? currentLineIndex : undefined}
            currentLineIndex={mode === "code" ? currentLineIndex : undefined}
            currentCharIndex={currentCharIndex}
            typedChars={typedChars}
            isActive={status !== "finished"}
            wordCount={wordCount}
          />
        </div>
      </div>

      {/* Footer hint - hidden in zen mode */}
      <div
        className={cn(
          "mt-8 flex justify-center transition-all duration-300",
          isZenMode && "opacity-0 select-none pointer-events-none"
        )}
        style={{ visibility: isZenMode ? "hidden" : "visible" }}
      >
        <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--theme-sub)" }}>
          Press Tab to restart
        </span>
      </div>
    </div>
  );
}