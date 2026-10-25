import { createClient } from "@/lib/supabase/server";
import { Chat } from "@/components/chat";
import { OwedSummary } from "@/components/owed-summary";
import { londonDate, type CustomerBalance, type Entry } from "@/lib/format";
import { slateTotals } from "@/lib/slate";

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

  return (
    <>
      <OwedSummary {...slateTotals(customers, todays, today)} />
      <Chat customers={customers} todays={todays} />
    </>
  );
}
