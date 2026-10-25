import Link from "next/link";
import { pounds, plural } from "@/lib/format";

// The slate total: the first thing a trader sees.
export function OwedSummary({
  owedPence,
  salesTodayPence,
  owingCount,
  overdueCount,
}: {
  owedPence: number;
  salesTodayPence: number;
  owingCount: number;
  overdueCount: number;
}) {
  return (
    // Pinned under the header on normal-height phones so the total stays in view while the chat scrolls.
    // On short screens (or with the keyboard open) it scrolls away to leave room for the confirm card.
    <section
      aria-label="Your slate"
      className="z-10 border-b bg-background px-4 pb-3 pt-4 [@media(min-height:700px)]:sticky [@media(min-height:700px)]:top-[calc(3.5rem+env(safe-area-inset-top))]"
    >
      {owedPence > 0 ? (
        <>
          <p className="text-sm text-muted-foreground">
            {plural(owingCount, "person owes", "people owe")} you
          </p>
          <p className="mt-1 font-display text-[clamp(2.25rem,11vw,3rem)] font-bold leading-none tracking-tight tabular-nums text-owed">
            {pounds(owedPence)}
          </p>
        </>
      ) : (
        <p className="font-display text-2xl font-semibold leading-tight">
          Nobody owes you anything. Slate&apos;s clean.
        </p>
      )}
      <p className="mt-2 flex flex-wrap items-center gap-x-1 text-[15px]">
        <span>
          <span className="tabular-nums">{pounds(salesTodayPence)}</span> in sales today.
        </span>
        {overdueCount > 0 && (
          <Link
            href="/owes"
            className="inline-flex min-h-11 items-center font-semibold text-owed underline underline-offset-4"
          >
            {plural(overdueCount, "payment", "payments")} overdue
          </Link>
        )}
      </p>
    </section>
  );
}
