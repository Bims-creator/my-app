import { createClient } from "@/lib/supabase/server";
import { Chat } from "@/components/chat";
import { londonDate, pounds, type CustomerBalance, type Entry } from "@/lib/format";

export default async function ChatPage() {
  const supabase = await createClient();
  const since = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();

  const [{ data: balances }, { data: recent }] = await Promise.all([
    supabase.from("customer_balances").select("id, name, mobile, balance_pence, next_due, last_activity"),
    supabase.from("entries").select("*").gte("created_at", since).order("created_at"),
  ]);

  const customers = (balances ?? []) as CustomerBalance[];
  const today = londonDate();
  const todays = ((recent ?? []) as Entry[]).filter((e) => londonDate(new Date(e.created_at)) === today);
  const owedPence = customers.reduce((sum, c) => sum + Math.max(0, c.balance_pence), 0);
  const salesTodayPence = todays
    .filter((e) => e.kind === "sale")
    .reduce((sum, e) => sum + e.amount_pence, 0);

  return (
    <>
      <div className="sticky top-[60px] z-10 flex justify-center gap-2 border-b bg-cream/95 px-4 py-2 text-sm backdrop-blur">
        <span>
          Owed to you <strong className="text-owed">{pounds(owedPence)}</strong>
        </span>
        <span aria-hidden className="text-muted-foreground">·</span>
        <span>
          Sales today <strong>{pounds(salesTodayPence)}</strong>
        </span>
      </div>
      <Chat customers={customers} todays={todays} />
    </>
  );
}
