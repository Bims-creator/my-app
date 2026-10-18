import type { SupabaseClient } from "@supabase/supabase-js";

// A realistic week for a home baker. Mobiles use Ofcom's reserved drama
// range (07700 900xxx), so no reminder can reach a real person.
const CUSTOMERS = [
  { name: "Kemi", mobile: "07700 900456" },
  { name: "Mrs Patel", mobile: "07700 900789" },
  { name: "Tom", mobile: null },
  { name: "Grace", mobile: "07700 900321" },
  { name: "Funmi", mobile: "07700 900654" },
];

type Sample = {
  customer: string;
  daysAgo: number;
  kind: "sale" | "payment";
  item?: string;
  quantity?: number;
  pence: number;
  paid?: boolean;
  dueInDays?: number;
  said: string;
};

const ENTRIES: Sample[] = [
  { customer: "Mrs Patel", daysAgo: 9, kind: "sale", item: "celebration cake", quantity: 1, pence: 6000, dueInDays: 13,
    said: "Celebration cake for Mrs Patel, £60, she'll pay end of the month" },
  { customer: "Kemi", daysAgo: 6, kind: "sale", item: "cupcakes", quantity: 12, pence: 2400, dueInDays: 4,
    said: "Sold 12 cupcakes to Kemi for £24, paying in 4 days" },
  { customer: "Grace", daysAgo: 4, kind: "sale", item: "brownies", quantity: 6, pence: 1500, paid: true,
    said: "6 brownies to Grace £15 paid cash" },
  { customer: "Kemi", daysAgo: 3, kind: "payment", pence: 1000, said: "Kemi paid me £10" },
  { customer: "Funmi", daysAgo: 2, kind: "sale", item: "chin chin bags", quantity: 5, pence: 2000, dueInDays: 3,
    said: "Sold 5 bags of chin chin to Funmi for £20, she'll pay in 3 days" },
  { customer: "Tom", daysAgo: 0, kind: "sale", item: "sourdough loaves", quantity: 2, pence: 900, paid: true,
    said: "Sold 2 sourdough loaves to Tom £9 paid" },
  { customer: "Grace", daysAgo: 0, kind: "sale", item: "cinnamon rolls", quantity: 4, pence: 1200, dueInDays: 7,
    said: "4 cinnamon rolls to Grace for £12, pays next week" },
];

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function loadSampleData(supabase: SupabaseClient) {
  const { data: customers, error } = await supabase
    .from("customers")
    .insert(CUSTOMERS)
    .select("id, name");
  if (error || !customers) return error ?? new Error("No customers");

  const idFor = Object.fromEntries(customers.map((c) => [c.name, c.id]));
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const rows = ENTRIES.map((e, i) => {
    // Spread entries through the day so "today" ones sit before anything the trader adds.
    const created = new Date(now - e.daysAgo * day - (ENTRIES.length - i) * 60 * 1000);
    return {
      customer_id: idFor[e.customer],
      kind: e.kind,
      item: e.item ?? null,
      quantity: e.quantity ?? null,
      amount_pence: e.pence,
      paid: e.kind === "payment" ? true : Boolean(e.paid),
      due_date: e.dueInDays !== undefined ? isoDate(new Date(created.getTime() + e.dueInDays * day)) : null,
      source_text: e.said,
      created_at: created.toISOString(),
    };
  });

  const { error: entriesError } = await supabase.from("entries").insert(rows);
  return entriesError;
}
