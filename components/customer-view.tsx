import Link from "next/link";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { entryDetail, pounds, shortDate, type CustomerBalance, type Entry } from "@/lib/format";
import { ReminderButton } from "@/components/reminder-button";
import { MobileForm } from "@/components/mobile-form";

export function CustomerView({
  customer: c,
  history,
  businessName,
  today,
}: {
  customer: CustomerBalance;
  history: Entry[];
  businessName: string;
  today: string;
}) {
  const overdue = c.balance_pence > 0 && c.next_due !== null && c.next_due < today;

  return (
    <main className="px-4 pb-8 pt-2">
      <Link href="/owes" className="-ml-1 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-brand">
        <ChevronLeft className="h-4 w-4" aria-hidden /> Who owes me
      </Link>

      <h1 className="mt-1 break-words font-display text-3xl font-bold leading-tight tracking-tight">{c.name}</h1>

      {c.balance_pence > 0 ? (
        <div className="mt-3">
          <p className="text-muted-foreground">Owes you</p>
          <p className="font-display text-[clamp(2.25rem,11vw,3rem)] font-bold leading-none tabular-nums text-owed">
            {pounds(c.balance_pence)}
          </p>
          {c.next_due &&
            (overdue ? (
              <p className="mt-2 flex items-center gap-1 text-sm font-medium text-owed">
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden /> Overdue since {shortDate(c.next_due)}
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Due {shortDate(c.next_due)}</p>
            ))}
          <ReminderButton
            customerId={c.id}
            name={c.name}
            mobile={c.mobile}
            balancePence={c.balance_pence}
            dueDate={c.next_due}
            businessName={businessName}
          />
        </div>
      ) : (
        <p className="mt-2 text-lg font-medium text-brand">All paid up. Wiped clean.</p>
      )}

      <MobileForm customerId={c.id} mobile={c.mobile} />

      <h2 className="mt-8 font-semibold">History</h2>
      {history.length === 0 ? (
        <p className="mt-1 text-sm text-muted-foreground">Nothing recorded yet.</p>
      ) : (
        <ul className="mt-2 divide-y border-y">
          {history.map((e) => {
            const owes = e.kind === "sale" && !e.paid;
            return (
              <li key={e.id} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="break-words">{entryDetail(e)}</p>
                  <p className="text-sm text-muted-foreground">{shortDate(e.created_at)}</p>
                </div>
                <p
                  className={
                    "shrink-0 font-semibold tabular-nums " +
                    (e.kind === "payment" ? "text-brand" : owes ? "text-owed" : "")
                  }
                >
                  {e.kind === "payment" ? "−" : ""}
                  {pounds(e.amount_pence)}
                </p>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-4 text-sm text-muted-foreground">
        To record a payment, go to Record a sale and say &ldquo;{c.name} paid me £20&rdquo;.
      </p>
    </main>
  );
}
