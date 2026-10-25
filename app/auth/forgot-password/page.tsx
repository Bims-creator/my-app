"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";

// Also how someone who has only ever used a code sets a password for the first time.
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm?next=/auth/update-password`,
    });
    setBusy(false);
    if (error) setError(/rate limit/i.test(error.message) ? "Too many tries. Wait a minute and try again." : error.message);
    else setSent(true);
  };

  return (
    <main className="flex min-h-dvh w-full items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">
        <Link href="/" aria-label="Tally home" className="inline-flex min-h-11 items-center">
          <Logo className="text-3xl" />
        </Link>
        <h1 className="mt-6 font-display text-2xl font-semibold">Set or reset your password</h1>
        {sent ? (
          <p className="mt-3 text-muted-foreground">
            If there&apos;s a Tally account for <strong className="text-foreground">{email}</strong>, we&apos;ve sent it a
            link. Open it on this phone to choose a new password.
          </p>
        ) : (
          <form onSubmit={send} className="mt-3">
            <p className="text-muted-foreground">Enter your email and we&apos;ll send you a link to choose a password.</p>
            <Label htmlFor="email" className="mt-5 block">
              Email
            </Label>
            <Input id="email" type="email" autoComplete="email" required className="mt-2" value={email} onChange={(e) => setEmail(e.target.value)} />
            {error && (
              <p role="alert" className="mt-3 text-sm font-medium text-owed">
                {error}
              </p>
            )}
            <Button type="submit" className="mt-4 h-12 w-full text-base" disabled={busy}>
              {busy ? "Sending…" : "Send me a link"}
            </Button>
          </form>
        )}
        <Link href="/auth/login" className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-brand underline underline-offset-4">
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
