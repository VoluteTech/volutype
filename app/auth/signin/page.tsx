"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Github, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleGitHubSignIn = async () => {
    window.location.href = `/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}&provider=github`;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isSignUp) {
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

        toast({
          title: "Account created!",
          description: "Now signing you in...",
        });
      }

      // Sign in with credentials
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      
      const response = await fetch("/api/auth/signin/credentials", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Signed in!",
          description: "Successfully signed in to your account.",
        });
        router.push("/");
      } else {
        setError(data.error || "Invalid email or password");
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Auth error:", err);
      setError("Something went wrong");
      setIsLoading(false);
    }
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
          {/* GitHub Button */}
          <Button
            onClick={handleGitHubSignIn}
            variant="outline"
            className="w-full flex items-center gap-2"
            style={{ borderColor: "var(--theme-secondary)", color: "var(--theme-fg)", cursor: "pointer" }}
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </Button>

          {/* Separator */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" style={{ borderColor: "var(--theme-secondary)" }} />
            </div>
          </div>

          {/* Email Form */}
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
                  style={{ cursor: "pointer" }}
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
              style={{ cursor: "pointer" }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isSignUp ? "Create Account" : "Sign In"
              )}
            </Button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <p className="text-center text-sm" style={{ color: "var(--theme-sub)" }}>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="underline hover:text-[var(--theme-fg)]"
              style={{ color: "var(--theme-primary)", cursor: "pointer" }}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "var(--theme-bg)" }}><Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--theme-sub)" }} /></div>}>
      <SignInForm />
    </Suspense>
  );
}