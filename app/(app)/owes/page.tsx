import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { londonDate, pounds, shortDate, type CustomerBalance } from "@/lib/format";

export default async function OwesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("customer_balances")
    .select("id, name, mobile, balance_pence, next_due, last_activity")
    .order("balance_pence", { ascending: false });

  const customers = (data ?? []) as CustomerBalance[];
  const owing = customers.filter((c) => c.balance_pence > 0);
  const settled = customers.filter((c) => c.balance_pence <= 0);
  const total = owing.reduce((sum, c) => sum + c.balance_pence, 0);
  const today = londonDate();

  return (
    <main className="px-4 py-5">
      <h1 className="text-2xl font-semibold">Who owes me</h1>
      <p className="mt-1 text-muted-foreground">
        {owing.length === 0 ? (
          "Nobody owes you anything right now."
        ) : (
          <>
            {owing.length} {owing.length === 1 ? "person owes" : "people owe"} you{" "}
            <strong className="text-owed">{pounds(total)}</strong>
          </>
        )}
      </p>

      {owing.length > 0 && (
        <ul className="mt-4 divide-y overflow-hidden rounded-2xl bg-card shadow-sm">
          {owing.map((c) => {
            const overdue = c.next_due !== null && c.next_due < today;
            return (
              <li key={c.id}>
                <Link href={`/owes/${c.id}`} className="flex items-center gap-3 px-4 py-4 active:bg-muted">
                  <div className="flex-1">
                    <p className="font-medium">{c.name}</p>
                    {c.next_due && (
                      <p className={overdue ? "text-sm font-medium text-owed" : "text-sm text-muted-foreground"}>
                        {overdue ? "Overdue since" : "Due"} {shortDate(c.next_due)}
                      </p>
                    )}
                  </div>
                  <span className="text-lg font-semibold text-owed">{pounds(c.balance_pence)}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {settled.length > 0 && (
        <>
          <h2 className="mt-8 text-sm font-medium uppercase tracking-wide text-muted-foreground">All paid up</h2>
          <ul className="mt-2 divide-y overflow-hidden rounded-2xl bg-card shadow-sm">
            {settled.map((c) => (
              <li key={c.id}>
                <Link href={`/owes/${c.id}`} className="flex items-center gap-3 px-4 py-3 active:bg-muted">
                  <p className="flex-1">{c.name}</p>
                  <span className="text-sm text-muted-foreground">{pounds(0)}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {customers.length === 0 && (
        <Link href="/chat" className="mt-6 block rounded-2xl bg-card p-4 text-center text-brand shadow-sm">
          Record your first sale
        </Link>
      )}
    </main>
  );
}
