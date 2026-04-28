import { TypingTest } from "@/components/typing-test";
import { ThemeSelector } from "@/components/theme-selector";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: "var(--theme-bg)", color: "var(--theme-fg)" }}>
      {/* Header */}
      <header className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-light tracking-[0.1em]" style={{ color: "var(--theme-fg)" }}>
            Volutype
          </h1>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center py-8">
        <TypingTest />
      </div>

      {/* Footer */}
      <footer className="py-6 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-6 text-xs" style={{ color: "var(--theme-sub)" }}>
          <span className="uppercase tracking-[0.1em]">Tab + Enter</span>
          <span className="w-1 h-1 rounded-full" style={{ background: "var(--theme-sub)", opacity: 0.3 }} />
          <span className="uppercase tracking-[0.1em]">Restart test</span>
        </div>
      </footer>

      <ThemeSelector />
    </main>
  );
}
