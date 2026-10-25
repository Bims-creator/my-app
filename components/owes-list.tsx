import Link from "next/link";
import { AlertCircle, ChevronRight } from "lucide-react";
import { plural, pounds, shortDate, type CustomerBalance } from "@/lib/format";

// Who owes me: overdue first, then the biggest debts. Paid-up customers go quiet at the bottom.
export function OwesList({ customers, today }: { customers: CustomerBalance[]; today: string }) {
  const isOverdue = (c: CustomerBalance) => c.balance_pence > 0 && c.next_due !== null && c.next_due < today;
  const owing = customers
    .filter((c) => c.balance_pence > 0)
    .sort((a, b) => Number(isOverdue(b)) - Number(isOverdue(a)) || b.balance_pence - a.balance_pence);
  const settled = customers.filter((c) => c.balance_pence <= 0).sort((a, b) => a.name.localeCompare(b.name, "en-GB"));
  const total = owing.reduce((sum, c) => sum + c.balance_pence, 0);

  return (
    <main className="px-4 pb-8 pt-5">
      <h1 className="font-display text-3xl font-bold tracking-tight">Who owes me</h1>

      {owing.length > 0 ? (
        <div className="mt-2">
          <p className="text-muted-foreground">{plural(owing.length, "person owes", "people owe")} you</p>
          <p className="font-display text-4xl font-bold leading-tight tabular-nums text-owed">{pounds(total)}</p>
        </div>
      ) : (
        <p className="mt-2 text-muted-foreground">Nobody owes you anything right now.</p>
      )}

      {owing.length > 0 && (
        <ul className="mt-5 divide-y border-y">
          {owing.map((c) => {
            const overdue = isOverdue(c);
            return (
              <li key={c.id}>
                <Link href={`/owes/${c.id}`} className="flex min-h-16 items-center gap-2 py-3 active:bg-muted">
                  {/* Name and amount share a line when they fit; a long name pushes the amount underneath. */}
                  <div className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-3">
                    <p className="min-w-0 break-words text-[17px] font-semibold leading-snug">{c.name}</p>
                    <span className="ml-auto shrink-0 text-lg font-semibold tabular-nums text-owed">
                      {pounds(c.balance_pence)}
                    </span>
                    {overdue ? (
                      <p className="mt-0.5 flex basis-full items-center gap-1 text-sm font-medium text-owed">
                        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
                        Overdue since {shortDate(c.next_due!)}
                      </p>
                    ) : (
                      <p className="mt-0.5 basis-full text-sm text-muted-foreground">
                        {c.next_due ? `Due ${shortDate(c.next_due)}` : "No date agreed"}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {settled.length > 0 && (
        <section className="mt-8">
          <h2 className="font-semibold">Wiped clean</h2>
          <p className="text-sm text-muted-foreground">These customers are all paid up.</p>
          <ul className="mt-2 divide-y border-y">
            {settled.map((c) => (
              <li key={c.id}>
                <Link href={`/owes/${c.id}`} className="flex min-h-12 items-center gap-3 py-2.5 active:bg-muted">
                  <p className="min-w-0 flex-1 break-words text-muted-foreground">{c.name}</p>
                  <span className="shrink-0 text-sm text-muted-foreground">Paid up</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {customers.length === 0 && (
        <div className="mt-6">
          <p className="text-muted-foreground">
            When you record a sale someone hasn&apos;t paid for yet, they&apos;ll show up here.
          </p>
          <Link
            href="/chat"
            className="press mt-4 flex h-12 items-center justify-center rounded-control bg-brand font-semibold text-cream"
          >
            Record your first sale
          </Link>
        </div>
      )}
    </main>
  );
}
