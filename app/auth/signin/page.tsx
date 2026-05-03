"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Github, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleGitHubSignIn = () => {
    signIn("github", { callbackUrl: "/" });
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (isSignUp) {
      // Custom signup
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        setIsLoading(false);
        return;
      }
      // Fall through to sign in
    }

    // Sign in with credentials via NextAuth
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
    setIsLoading(false);
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--theme-bg)", color: "var(--theme-fg)" }}
    >
      <Card className="w-full max-w-md" style={{ background: "var(--theme-bg)", borderColor: "var(--theme-secondary)" }}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-light tracking-wide">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <p className="text-sm mt-2" style={{ color: "var(--theme-sub)" }}>
            {isSignUp ? "Sign up with your email" : "Sign in to continue"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGitHubSignIn}
            variant="outline"
            className="w-full flex items-center gap-2"
            style={{ borderColor: "var(--theme-secondary)", color: "var(--theme-fg)" }}
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" style={{ borderColor: "var(--theme-secondary)" }} />
            </div>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" style={{ color: "var(--theme-fg)" }}>Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  style={{ 
                    background: "var(--theme-bg)",
                    borderColor: "var(--theme-secondary)",
                    color: "var(--theme-fg)"
                  }}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: "var(--theme-fg)" }}>Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{ 
                  background: "var(--theme-bg)",
                  borderColor: "var(--theme-secondary)",
                  color: "var(--theme-fg)"
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: "var(--theme-fg)" }}>Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="pr-10"
                  style={{ 
                    background: "var(--theme-bg)",
                    borderColor: "var(--theme-secondary)",
                    color: "var(--theme-fg)"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" style={{ color: "var(--theme-sub)" }} />
                  ) : (
                    <Eye className="w-4 h-4" style={{ color: "var(--theme-sub)" }} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm" style={{ color: "var(--theme-error)" }}>
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isSignUp ? "Create Account" : "Sign In"
              )}
            </Button>
          </form>

          <p className="text-center text-sm" style={{ color: "var(--theme-sub)" }}>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="underline"
              style={{ color: "var(--theme-primary)" }}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}