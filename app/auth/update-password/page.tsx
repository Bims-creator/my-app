"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// The password-reset email signs the trader in and lands here.
export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return setError("Use at least 8 characters.");
    setBusy(true);
    setError(null);
    const { error } = await createClient().auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setError(
        /session|not authenticated|jwt/i.test(error.message)
          ? "This link has expired. Ask for a new one from the sign-in page."
          : error.message,
      );
      return;
    }
    router.replace("/chat");
    router.refresh();
  };

  return (
    <main className="flex min-h-dvh w-full items-center justify-center px-5 py-10">
      <form onSubmit={save} className="w-full max-w-sm">
        <p className="font-display text-3xl font-bold tracking-tight text-brand">Tally</p>
        <h1 className="mt-6 font-display text-2xl font-semibold">Choose a password</h1>
        <p className="mt-2 text-muted-foreground">At least 8 characters. You can still sign in with an email code any time.</p>
        <Label htmlFor="password" className="mt-5 block">
          New password
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          autoFocus
          className="mt-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <p role="alert" className="mt-3 text-sm font-medium text-owed">
            {error}
          </p>
        )}
        <Button type="submit" className="mt-4 h-12 w-full text-base" disabled={busy}>
          {busy ? "Saving…" : "Save password"}
        </Button>
        <Link href="/auth/login" className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-brand underline underline-offset-4">
          Back to sign in
        </Link>
      </form>
    </main>
  );
}
