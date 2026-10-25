import Link from "next/link";
import { LoginForm } from "@/components/login-form";

// The first screen a new trader sees: what Tally does, shown working, then the one action.
export default function Page() {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(2.5rem,env(safe-area-inset-top))]">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-5xl font-bold tracking-tight text-brand">Tally</h1>
        <p className="mt-2 font-display text-xl font-semibold leading-snug">
          Say what you sold. See who owes you.
        </p>

        <figure aria-label="How it works" className="mt-6 flex flex-col gap-2">
          <p className="max-w-[88%] self-end rounded-panel rounded-br-[4px] bg-accent px-4 py-2.5 text-[15px]">
            &ldquo;Sold 3 cakes to Ada for £45, she&apos;ll pay Friday&rdquo;
          </p>
          <div className="w-[88%] self-start rounded-panel rounded-bl-[4px] border bg-card px-4 py-2.5 text-[15px]">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-semibold">Ada</span>
              <span className="font-semibold tabular-nums text-owed">£45.00</span>
            </div>
            <p className="text-sm text-muted-foreground">3 × cakes · owes you, due Friday</p>
          </div>
          <figcaption className="sr-only">
            You say what happened; Tally writes it on your slate and keeps track of who owes you.
          </figcaption>
        </figure>

        <div className="mt-8">
          <LoginForm />
        </div>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Only you can see your records.{" "}
          <Link href="/privacy" className="inline-flex min-h-11 items-center font-medium text-brand underline underline-offset-4">
            Privacy
          </Link>
        </p>
      </div>
    </main>
  );
}
