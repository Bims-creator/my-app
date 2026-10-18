import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { describeEntry, pounds, shortDate, type CustomerBalance, type Entry } from "@/lib/format";
import { ReminderButton } from "@/components/reminder-button";
import { MobileForm } from "@/components/mobile-form";

export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: customer }, { data: entries }, { data: claims }] = await Promise.all([
    supabase
      .from("customer_balances")
      .select("id, name, mobile, balance_pence, next_due, last_activity")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("entries").select("*").eq("customer_id", id).order("created_at", { ascending: false }),
    supabase.auth.getClaims(),
  ]);
  if (!customer) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("business_name")
    .eq("id", claims?.claims?.sub ?? "")
    .maybeSingle();

  const c = customer as CustomerBalance;
  const history = (entries ?? []) as Entry[];

  return (
    <main className="px-4 py-4">
      <Link href="/owes" className="inline-flex items-center gap-1 text-sm text-brand">
        <ChevronLeft className="h-4 w-4" aria-hidden /> Who owes me
      </Link>

      <div className="mt-3 rounded-2xl bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-semibold">{c.name}</h1>
        {c.balance_pence > 0 ? (
          <>
            <p className="mt-1 text-muted-foreground">Owes you</p>
            <p className="text-4xl font-bold text-owed">{pounds(c.balance_pence)}</p>
            {c.next_due && <p className="mt-1 text-sm text-muted-foreground">Due {shortDate(c.next_due)}</p>}
            <ReminderButton
              customerId={c.id}
              name={c.name}
              mobile={c.mobile}
              balancePence={c.balance_pence}
              dueDate={c.next_due}
              businessName={profile?.business_name ?? ""}
            />
          </>
        ) : (
          <p className="mt-1 text-lg text-brand">All paid up</p>
        )}
        <MobileForm customerId={c.id} mobile={c.mobile} />
      </div>

      <h2 className="mt-6 text-sm font-medium uppercase tracking-wide text-muted-foreground">History</h2>
      <ul className="mt-2 divide-y overflow-hidden rounded-2xl bg-card shadow-sm">
        {history.map((e) => (
          <li key={e.id} className="px-4 py-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className={e.kind === "payment" ? "font-medium text-brand" : e.paid ? "" : "font-medium text-owed"}>
                {describeEntry(e)}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">{shortDate(e.created_at)}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        To record a payment, go to Record a sale and say &ldquo;{c.name} paid me £20&rdquo;.
      </p>
    </main>
  );
}
