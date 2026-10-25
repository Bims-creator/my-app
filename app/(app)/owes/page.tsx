import { createClient } from "@/lib/supabase/server";
import { OwesList } from "@/components/owes-list";
import { londonDate, type CustomerBalance } from "@/lib/format";

export default async function OwesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("customer_balances")
    .select("id, name, mobile, balance_pence, next_due, last_activity")
    .order("balance_pence", { ascending: false });

  return <OwesList customers={(data ?? []) as CustomerBalance[]} today={londonDate()} />;
}
