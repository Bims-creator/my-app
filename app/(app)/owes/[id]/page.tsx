import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { londonDate, type CustomerBalance, type Entry } from "@/lib/format";
import { CustomerView } from "@/components/customer-view";

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

  return (
    <CustomerView
      customer={customer as CustomerBalance}
      history={(entries ?? []) as Entry[]}
      businessName={profile?.business_name ?? ""}
      today={londonDate()}
    />
  );
}
