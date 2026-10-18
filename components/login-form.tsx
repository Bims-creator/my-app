"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

// Email-only sign-in: we send a link, no password to remember.
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm?next=/chat` },
    });
    setIsLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="rounded-2xl bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Check your email</h2>
        <p className="mt-2 text-muted-foreground">
          We sent a sign-in link to <strong className="text-foreground">{email}</strong>. Open it on
          this phone and you&apos;re in.
        </p>
        <button
          className="mt-4 text-sm text-primary underline underline-offset-4"
          onClick={() => setSent(false)}
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin} className="rounded-2xl bg-card p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Sign in</h2>
      <p className="mt-1 text-muted-foreground">
        Enter your email. We&apos;ll send you a link. No password needed.
      </p>
      <div className="mt-5 grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          className="h-12 text-base"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {error && <p className="mt-3 text-sm text-owed">{error}</p>}
      <Button type="submit" className="mt-5 h-12 w-full text-base" disabled={isLoading}>
        {isLoading ? "Sending…" : "Send me a link"}
      </Button>
    </form>
  );
}
