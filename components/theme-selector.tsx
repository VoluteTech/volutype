"use client";

import { useColorTheme, themes, type ColorTheme } from "@/hooks/use-color-theme";
import { cn } from "@/lib/utils";

export function ThemeSelector() {
  const { theme: activeTheme, selectTheme, mounted } = useColorTheme();

  if (!mounted) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 rounded-lg bg-muted/50 backdrop-blur-sm">
        <div className="flex items-center gap-1 px-2 py-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Theme
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 rounded-lg bg-muted/50 backdrop-blur-sm">
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground uppercase tracking-wider px-2">
          Theme
        </span>
        <div className="w-px h-4 bg-border" />
      </div>
      {themes.map((t) => (
        <ColorThemeButton
          key={t.id}
          theme={t}
          isActive={activeTheme === t.id}
          onClick={() => selectTheme(t.id)}
        />
      ))}
    </div>
  );
}

function ColorThemeButton({
  theme,
  isActive,
  onClick,
}: {
  theme: ColorTheme;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-6 h-6 rounded-md transition-all duration-150",
        "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
        isActive && "ring-2 ring-ring ring-offset-1 ring-offset-transparent"
      )}
      style={{
        background: theme.colors.bg,
        border: `2px solid ${theme.colors.primary}`,
      }}
      title={theme.name}
    >
      <span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
        style={{ background: theme.colors.caret }}
      />
    </button>
  );
}