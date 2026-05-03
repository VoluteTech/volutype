"use client";

import { useEffect, useState, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { Loader2, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignIn = () => {
    window.location.href = "/auth/signin";
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  if (status === "loading") {
    return (
      <div className="fixed top-6 right-6 z-50">
        <Loader2 className="w-5 h-5 animate-spin text-[var(--theme-sub)]" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignIn}
          className="text-[var(--theme-sub)] hover:text-[var(--theme-fg)]"
          style={{ cursor: "pointer" }}
        >
          Sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-6 right-6 z-50" ref={menuRef}>
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--theme-bg-alt)] transition-colors"
          style={{ color: "var(--theme-fg)", cursor: "pointer" }}
        >
          {session.user.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[var(--theme-secondary)] flex items-center justify-center">
              <User className="w-4 h-4 text-[var(--theme-sub)]" />
            </div>
          )}
          <span className="text-sm font-medium">
            {session.user.name || session.user.email?.split("@")[0]}
          </span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 py-2 rounded-lg bg-[var(--theme-bg)] border border-[var(--theme-sub)]/20 shadow-lg">
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left text-sm text-[var(--theme-sub)] hover:bg-[var(--theme-bg-alt)] hover:text-[var(--theme-fg)] flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}