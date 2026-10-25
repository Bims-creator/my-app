import Link from "next/link";
import { Check, Mic } from "lucide-react";

// Public landing page for traders who aren't signed in yet.
// Every example below is something Tally really does; no invented customers, numbers or quotes.

function StartButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/auth/login"
      className={`press inline-flex h-12 items-center justify-center rounded-control bg-brand px-6 text-base font-semibold text-cream ${className}`}
    >
      Start your slate
    </Link>
  );
}

function SaidBubble({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-[88%] self-end rounded-panel rounded-br-[4px] bg-accent px-4 py-2.5 text-[15px]">
      &ldquo;{children}&rdquo;
    </p>
  );
}

function SlateLine({ name, amount, detail, owes }: { name: string; amount: string; detail: string; owes?: boolean }) {
  return (
    <div className="w-[88%] self-start rounded-panel rounded-bl-[4px] border bg-card px-4 py-2.5 text-[15px]">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-semibold">{name}</span>
        <span className={`font-semibold tabular-nums ${owes ? "text-owed" : ""}`}>{amount}</span>
      </div>
      <p className="text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}

export function Landing() {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 pt-[env(safe-area-inset-top)]">
        <p className="font-display text-2xl font-bold tracking-tight text-brand">Tally</p>
        <Link href="/auth/login" className="-mr-2 inline-flex min-h-11 items-center px-2 font-medium text-brand">
          Sign in
        </Link>
      </header>

      <main>
        {/* First screen: what it is, the one action, and Tally working. */}
        <section className="mx-auto grid max-w-5xl gap-10 px-5 pb-12 pt-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pb-20 lg:pt-12">
          <div>
            <h1 className="font-display text-[clamp(2.5rem,9vw,4.25rem)] font-bold leading-[1.02] tracking-tight">
              Say what you sold. See who owes you.
            </h1>
            <p className="mt-5 max-w-[34rem] text-lg leading-relaxed">
              Tally is a slate for small traders who let regulars pay later. Tap the mic, say what happened, and Tally
              keeps track of who owes you and how much.
            </p>
            <StartButton className="mt-7 w-full sm:w-auto" />
            <p className="mt-3 text-sm text-muted-foreground">
              Free while we test it. Works in your phone&apos;s browser, nothing to download.
            </p>
          </div>

          {/* The slate: a deep green band with the real app view on it. */}
          <figure className="-mx-5 bg-brand px-5 py-8 sm:mx-0 sm:rounded-panel sm:px-8">
            <div className="mx-auto flex max-w-sm flex-col gap-2 rounded-panel bg-background p-4">
              {/* The total includes Ada's £45 below, so the example adds up. */}
              <p className="text-sm text-muted-foreground">5 people owe you</p>
              <p className="font-display text-4xl font-bold leading-none tabular-nums text-owed">£151.00</p>
              <hr className="my-2" />
              <SaidBubble>Sold 3 cakes to Ada for £45, she&apos;ll pay Friday</SaidBubble>
              <SlateLine name="Ada" amount="£45.00" detail="3 × cakes · owes you, due Friday" owes />
              <p className="self-start rounded-panel rounded-bl-[4px] border bg-card px-4 py-2.5 text-[15px] font-medium">
                Saved. Ada now owes you £45.00.
              </p>
            </div>
            <figcaption className="mx-auto mt-4 max-w-sm text-sm text-cream/85">
              What Tally shows after one voice note.
            </figcaption>
          </figure>
        </section>

        {/* How it works: a real sequence, so the steps are numbered. */}
        <section aria-labelledby="how" className="mx-auto max-w-5xl px-5 py-12 lg:py-16">
          <h2 id="how" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            From voice note to reminder
          </h2>

          <ol className="mt-8">
            <li className="grid gap-5 border-t py-8 md:grid-cols-2 md:gap-12">
              <div>
                <p className="font-display text-lg font-semibold text-brand">1. Say it</p>
                <p className="mt-2 text-lg leading-relaxed">
                  Tap the mic and talk like you&apos;d text a friend. Tally turns it into a line on your slate.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <SaidBubble>Kemi paid me £10</SaidBubble>
                <SlateLine name="Kemi" amount="−£10.00" detail="Paid you" />
              </div>
            </li>

            <li className="grid gap-5 border-t py-8 md:grid-cols-2 md:gap-12">
              <div>
                <p className="font-display text-lg font-semibold text-brand">2. Check it</p>
                <p className="mt-2 text-lg leading-relaxed">
                  Before anything is saved, you see what Tally heard. Fix a name or an amount, then tap Save. If it
                  heard you wrong, nothing goes on your slate.
                </p>
              </div>
              <div
                aria-label="Example of the check before saving"
                className="rounded-panel border bg-card p-4 shadow-[0_10px_30px_-14px_rgba(11,60,42,0.45)]"
              >
                <p className="font-display font-semibold">Check this, then save</p>
                <div className="mt-3 grid grid-cols-[1fr_7rem] gap-2 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Customer</p>
                    <p className="mt-1 rounded-control border bg-background px-3 py-2.5 text-base">Kemi</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Amount</p>
                    <p className="mt-1 rounded-control border bg-background px-3 py-2.5 text-base tabular-nums">£10.00</p>
                  </div>
                </div>
                <p className="mt-3 flex h-11 items-center justify-center rounded-control bg-brand font-semibold text-cream">
                  Save
                </p>
              </div>
            </li>

            <li className="grid gap-5 border-y py-8 md:grid-cols-2 md:gap-12">
              <div>
                <p className="font-display text-lg font-semibold text-brand">3. Chase it</p>
                <p className="mt-2 text-lg leading-relaxed">
                  When a payment&apos;s late, Tally writes a polite reminder. It opens in WhatsApp, ready to send from
                  your own number.
                </p>
              </div>
              <div className="flex flex-col">
                <p className="max-w-[92%] self-end rounded-panel rounded-br-[4px] bg-[#d9fdd3] px-4 py-3 text-[15px] leading-normal text-[#111b21]">
                  Hi Kemi, hope you&apos;re well. Just a friendly reminder that £14.00 is still owing (due Friday).
                  Thank you! - Bisi&apos;s Kitchen
                </p>
                <p className="mt-2 self-end text-sm text-muted-foreground">Sent from your WhatsApp, not ours</p>
              </div>
            </li>
          </ol>
        </section>

        {/* Who it's for. */}
        <section aria-labelledby="who" className="mx-auto max-w-5xl px-5 py-12 lg:py-16">
          <div className="max-w-[40rem]">
            <h2 id="who" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              For anyone who hears &ldquo;I&apos;ll pay you Friday&rdquo;
            </h2>
            <p className="mt-4 text-lg leading-relaxed">
              Home bakers, market stalls, mobile hairdressers, cleaners, tailors. If you keep track of who owes you in
              your head, a notebook or old WhatsApp chats, Tally puts it all on one slate and tells you the total.
            </p>
          </div>
        </section>

        {/* Trust: the real answers to "is my stuff safe?". */}
        <section aria-labelledby="trust" className="bg-card">
          <div className="mx-auto max-w-5xl px-5 py-12 lg:py-16">
            <h2 id="trust" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Your records stay yours
            </h2>
            <ul className="mt-6 grid max-w-[44rem] gap-4 text-lg leading-relaxed">
              {[
                "Only you can see your records. Each trader signs in with their own email, no password.",
                "Nothing is saved until you tap Save.",
                "Your phone’s speech service turns your voice into text. Tally keeps the words, never the recording.",
                "Reminders go from your own WhatsApp. Tally never messages your customers.",
                "We only ask for your email, your business name and your customers’ first names. Their phone numbers are optional.",
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <Check className="mt-1.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Cost and how to start, with the action attached. */}
        <section aria-labelledby="start" className="mx-auto max-w-5xl px-5 py-14 lg:py-20">
          <div className="max-w-[40rem]">
            <h2 id="start" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Free while we test it
            </h2>
            <p className="mt-4 text-lg leading-relaxed">
              Tally is free for our first traders. Sign in with your email, name your business, and record your first
              sale. On your phone, add it to your home screen and it opens like an app. No app store, no card details.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              <StartButton className="w-full sm:w-auto" />
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mic className="h-4 w-4 shrink-0" aria-hidden />
                Voice works in Chrome and Safari. You can always type.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-sm text-muted-foreground">
          <p>Tally is being built by Group 7 on the Hiram Initiative&apos;s Beginner to Builder programme.</p>
          <Link href="/auth/login" className="inline-flex min-h-11 items-center font-medium text-brand">
            Sign in
          </Link>
        </div>
      </footer>
    </div>
  );
}
