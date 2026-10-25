"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AUTH_GOOGLE, AUTH_PHONE } from "@/lib/site";
import { cn } from "@/lib/utils";

// Ways in: an emailed code (or link), email and password, a texted code, or Google.
// Google and phone only appear once they're switched on (see lib/site.ts).

type Method = "code" | "password" | "phone";

const NEXT = "/chat";

function friendly(message: string) {
  if (/invalid login credentials/i.test(message)) return "That email and password don't match. Try again, or get a code instead.";
  if (/token has expired|invalid.*(otp|token)/i.test(message)) return "That code didn't work. Check it, or ask for a new one.";
  if (/rate limit|too many/i.test(message)) return "Too many tries. Wait a minute and try again.";
  if (/password should be/i.test(message)) return "Use at least 8 characters for your password.";
  if (/already registered/i.test(message)) return "There's already an account with that email. Sign in instead.";
  if (/fetch|network/i.test(message)) return "Can't reach the sign-in service. Check your connection and try again.";
  return message;
}

// "07700 900123" -> "+447700900123". Numbers already starting with + or 00 are kept as they are.
function toE164(raw: string) {
  const digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  if (digits.startsWith("0")) return `+44${digits.slice(1)}`;
  return `+${digits}`;
}

export function LoginForm() {
  const router = useRouter();
  const [method, setMethod] = useState<Method>("code");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false); // password mode: new account vs sign in
  const [code, setCode] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null); // where the code went
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const supabase = createClient();
  const redirectTo = () => `${window.location.origin}/auth/confirm?next=${NEXT}`;

  const switchMethod = (m: Method) => {
    setMethod(m);
    setSentTo(null);
    setCode("");
    setError(null);
    setNotice(null);
  };

  const run = async (fn: () => Promise<string | null | void>) => {
    setBusy(true);
    setError(null);
    try {
      const problem = await fn();
      if (problem) setError(friendly(problem));
    } finally {
      setBusy(false);
    }
  };

  const signedIn = () => {
    router.replace(NEXT);
    router.refresh();
  };

  const sendCode = () =>
    run(async () => {
      if (method === "phone") {
        const to = toE164(phone);
        const { error } = await supabase.auth.signInWithOtp({ phone: to });
        if (error) return error.message;
        setSentTo(to);
      } else {
        const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo() } });
        if (error) return error.message;
        setSentTo(email);
      }
    });

  const verifyCode = () =>
    run(async () => {
      const token = code.replace(/\s/g, "");
      const { error } =
        method === "phone"
          ? await supabase.auth.verifyOtp({ phone: sentTo!, token, type: "sms" })
          : await supabase.auth.verifyOtp({ email: sentTo!, token, type: "email" });
      if (error) return error.message;
      signedIn();
    });

  const withPassword = () =>
    run(async () => {
      if (creating) {
        if (password.length < 8) return "Password should be at least 8 characters.";
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectTo() },
        });
        if (error) return error.message;
        if (data.session) return signedIn();
        setNotice(`Nearly there. We've emailed ${email} a link to confirm it's you. Tap it, and you're in.`);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return error.message;
        signedIn();
      }
    });

  const withGoogle = () =>
    run(async () => {
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: redirectTo() } });
      if (error) return error.message;
    });

  const tabs: [Method, string][] = [
    ["code", "Email code"],
    ["password", "Password"],
    ...(AUTH_PHONE ? ([["phone", "Phone"]] as [Method, string][]) : []),
  ];

  return (
    <div>
      <h2 className="font-semibold">Sign in or start</h2>

      {AUTH_GOOGLE && (
        <>
          <Button type="button" variant="outline" onClick={withGoogle} disabled={busy} className="mt-3 h-12 w-full text-base">
            <GoogleMark />
            Continue with Google
          </Button>
          <p className="my-4 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </p>
        </>
      )}

      <div role="tablist" aria-label="How to sign in" className={cn("flex rounded-control bg-muted p-1", !AUTH_GOOGLE && "mt-3")}>
        {tabs.map(([m, label]) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={method === m}
            onClick={() => switchMethod(m)}
            className={cn(
              "press min-h-11 flex-1 rounded-[7px] text-sm font-semibold",
              method === m ? "bg-card text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "text-muted-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Step 2 for email and phone codes: type the code (the email link still works too). */}
      {sentTo && method !== "password" ? (
        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            verifyCode();
          }}
        >
          <p className="text-sm text-muted-foreground">
            {method === "phone" ? (
              <>We texted a code to <strong className="text-foreground">{sentTo}</strong>.</>
            ) : (
              <>
                We emailed a code to <strong className="text-foreground">{sentTo}</strong>. Type it here, or tap the link
                in the email on this phone.
              </>
            )}
          </p>
          <Label htmlFor="code" className="mt-4 block">
            Code
          </Label>
          <Input
            id="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            maxLength={10}
            className="mt-2 text-center text-xl tracking-[0.3em] tabular-nums"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^\d\s]/g, ""))}
          />
          <Button type="submit" className="mt-4 h-12 w-full text-base" disabled={busy || code.replace(/\s/g, "").length < 6}>
            {busy ? "Checking…" : "Sign in"}
          </Button>
          <div className="mt-2 flex flex-wrap justify-between gap-x-4">
            <button type="button" onClick={sendCode} disabled={busy} className="min-h-11 text-sm font-medium text-brand underline underline-offset-4">
              Send a new code
            </button>
            <button
              type="button"
              onClick={() => switchMethod(method)}
              className="min-h-11 text-sm font-medium text-muted-foreground underline underline-offset-4"
            >
              {method === "phone" ? "Use a different number" : "Use a different email"}
            </button>
          </div>
        </form>
      ) : method === "password" ? (
        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            withPassword();
          }}
        >
          <p className="text-sm text-muted-foreground">
            {creating ? "Choose a password of at least 8 characters." : "Signed in with a code before? Use “Forgot password” to set one."}
          </p>
          <Label htmlFor="email-pw" className="mt-4 block">
            Email
          </Label>
          <Input id="email-pw" type="email" autoComplete="email" required className="mt-2" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Label htmlFor="password" className="mt-4 block">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete={creating ? "new-password" : "current-password"}
            required
            minLength={creating ? 8 : undefined}
            className="mt-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="mt-4 h-12 w-full text-base" disabled={busy}>
            {busy ? "Just a moment…" : creating ? "Create account" : "Sign in"}
          </Button>
          <div className="mt-2 flex flex-wrap justify-between gap-x-4">
            <button
              type="button"
              onClick={() => {
                setCreating(!creating);
                setError(null);
                setNotice(null);
              }}
              className="min-h-11 text-sm font-medium text-brand underline underline-offset-4"
            >
              {creating ? "I already have an account" : "New here? Create an account"}
            </button>
            {!creating && (
              <Link href="/auth/forgot-password" className="inline-flex min-h-11 items-center text-sm font-medium text-muted-foreground underline underline-offset-4">
                Forgot password?
              </Link>
            )}
          </div>
        </form>
      ) : (
        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            sendCode();
          }}
        >
          {method === "phone" ? (
            <>
              <p className="text-sm text-muted-foreground">We&apos;ll text you a code. Standard text rates may apply.</p>
              <Label htmlFor="phone" className="mt-4 block">
                Mobile number
              </Label>
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="07700 900123"
                required
                className="mt-2 tabular-nums"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">We&apos;ll email you a code. No password needed.</p>
              <Label htmlFor="email" className="mt-4 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                className="mt-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </>
          )}
          <Button type="submit" className="mt-4 h-12 w-full text-base" disabled={busy}>
            {busy ? "Sending…" : method === "phone" ? "Text me a code" : "Email me a code"}
          </Button>
        </form>
      )}

      {notice && <p className="mt-3 text-sm font-medium text-brand">{notice}</p>}
      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-owed">
          {error}
        </p>
      )}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className="!size-5">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
