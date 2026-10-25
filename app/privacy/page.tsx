import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Tally collects, why, and who to contact.",
};

// Plain-words privacy note. Keep it in step with what the app really stores
// (tables: profiles, customers, entries, reminders).
export default function PrivacyPage() {
  const h2 = "mt-10 font-display text-2xl font-bold tracking-tight";
  const p = "mt-3 text-lg leading-relaxed";
  const li = "text-lg leading-relaxed";

  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5 pt-[env(safe-area-inset-top)]">
        <Link href="/" className="inline-flex min-h-11 items-center font-display text-2xl font-bold tracking-tight text-brand">
          Tally
        </Link>
        <Link href="/auth/login" className="-mr-2 inline-flex min-h-11 items-center px-2 font-medium text-brand">
          Sign in
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-16 pt-6">
        <h1 className="font-display text-4xl font-bold tracking-tight">Privacy</h1>
        <p className="mt-2 text-muted-foreground">Last updated 25 October 2026</p>
        <p className={p}>
          Tally is a pilot being built by Group 7 on the Hiram Initiative&apos;s Beginner to Builder programme. This
          page explains, in plain words, what we keep and why.
        </p>

        <h2 className={h2}>What we collect</h2>
        <ul className="mt-3 grid list-disc gap-2 pl-6">
          <li className={li}>
            <strong>Your email address</strong>, so we can send you a sign-in link.
          </li>
          <li className={li}>
            <strong>Your business name</strong>, which goes on the reminders you send.
          </li>
          <li className={li}>
            <strong>Your customers&apos; names</strong> and, only if you add them, their mobile numbers.
          </li>
          <li className={li}>
            <strong>What you record:</strong> items, amounts, whether they&apos;re paid, due dates, and the words of each
            voice note or message.
          </li>
          <li className={li}>
            <strong>When you send a reminder</strong>, a note of which customer and how much, so we can count how
            often reminders are used.
          </li>
          <li className={li}>
            <strong>Anonymous visit and speed stats</strong> from Vercel Analytics: which pages are opened and how fast
            they load. No cookies, and nothing that identifies you.
          </li>
        </ul>

        <h2 className={h2}>What we don&apos;t collect</h2>
        <ul className="mt-3 grid list-disc gap-2 pl-6">
          <li className={li}>
            <strong>Voice recordings.</strong> Your phone or browser&apos;s speech service (from Google or Apple) turns
            your voice into text. Tally only keeps the words.
          </li>
          <li className={li}>Passwords, card details or bank details.</li>
        </ul>

        <h2 className={h2}>Why</h2>
        <p className={p}>
          Only to run your slate: to sign you in, save what you record, work out who owes you, and write your
          reminders. The anonymous stats help us see whether Tally is working for people. We don&apos;t sell your data
          or use it for advertising.
        </p>

        <h2 className={h2}>Who can see it</h2>
        <p className={p}>
          Only you. Each trader&apos;s records are locked to their own account. Your data is stored by Supabase in
          London and the site runs on Vercel. Sign-in emails are sent through Gmail. Our small team can reach the
          database to fix problems, and we only look when we have to.
        </p>
        <p className={p}>
          Reminders open in your own WhatsApp and are sent by you. Tally never contacts your customers.
        </p>

        <h2 className={h2}>Your customers</h2>
        <p className={p}>
          Only add details your customers would expect you to keep, like a first name and the number they already
          message you on.
        </p>

        <h2 className={h2}>Keeping and deleting</h2>
        <p className={p}>
          We keep your records while you use Tally. You can delete any entry yourself. To delete your whole account
          and everything in it, contact us and we&apos;ll do it.
        </p>

        <h2 className={h2}>Contact</h2>
        <p className={p}>
          Questions about your data, or want it deleted?{" "}
          {CONTACT_EMAIL ? (
            <>
              Email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-brand underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
              .
            </>
          ) : (
            <>Tell the person who invited you to Tally and they&apos;ll pass it to our team.</>
          )}
        </p>

        <Link
          href="/"
          className="press mt-10 inline-flex h-12 items-center justify-center rounded-control bg-brand px-6 font-semibold text-cream"
        >
          Back to Tally
        </Link>
      </main>
    </div>
  );
}
