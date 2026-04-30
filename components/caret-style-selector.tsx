"use client";

import { useCaretStyle, caretStyles, type CaretStyle } from "@/hooks/use-caret-style";
import { cn } from "@/lib/utils";

export function CaretStyleSelector() {
  const { caretStyle, selectCaretStyle, mounted } = useCaretStyle();

  if (!mounted) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 rounded-lg bg-muted/50 backdrop-blur-sm">
        <div className="flex items-center gap-1 px-2 py-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Caret
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 rounded-lg bg-muted/50 backdrop-blur-sm z-50">
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground uppercase tracking-wider px-2">
          Caret
        </span>
        <div className="w-px h-4 bg-border" />
      </div>
      {caretStyles.map((style) => (
        <CaretStyleButton
          key={style.id}
          style={style.id}
          isActive={caretStyle === style.id}
          onClick={() => selectCaretStyle(style.id)}
        />
      ))}
    </div>
  );
}

function CaretStyleButton({
  style,
  isActive,
  onClick,
}: {
  style: CaretStyle;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-6 h-6 rounded-md transition-all duration-150 flex items-center justify-center",
        "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
        isActive && "bg-secondary ring-2 ring-ring ring-offset-1 ring-offset-transparent"
      )}
      title={style}
    >
      <CaretPreview style={style} />
    </button>
  );
}

function CaretPreview({ style }: { style: CaretStyle }) {
  switch (style) {
    case "block":
      return (
        <div className="w-3 h-4 bg-[var(--theme-caret)] rounded-sm" />
      );
    case "underline":
      return (
        <div className="w-3 h-4 flex items-end">
          <div className="w-full h-[3px] bg-[var(--theme-caret)] rounded-sm" />
        </div>
      );
    case "bar":
      return (
        <div className="w-[2px] h-4 bg-[var(--theme-caret)] rounded-full" />
      );
    case "outline":
      return (
        <div className="w-3 h-4 rounded-sm border-2 border-[var(--theme-caret)]" />
      );
    default:
      return null;
  }
}