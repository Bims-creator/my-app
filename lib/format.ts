export function pounds(pence: number): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(pence / 100);
}

// "2026-10-23" -> "Fri 23 Oct"
export function shortDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

// Today's date in the UK, as YYYY-MM-DD, whatever timezone the server runs in.
export function londonDate(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(d);
}

// UK mobile "07700 900123" -> "447700900123" for wa.me links.
export function whatsappNumber(mobile: string | null): string {
  if (!mobile) return "";
  const digits = mobile.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits.slice(1);
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return "44" + digits.slice(1);
  return digits;
}

export type Entry = {
  id: string;
  customer_id: string;
  kind: "sale" | "payment";
  item: string | null;
  quantity: number | null;
  amount_pence: number;
  paid: boolean;
  due_date: string | null;
  source_text: string | null;
  created_at: string;
};

export type CustomerBalance = {
  id: string;
  name: string;
  mobile: string | null;
  balance_pence: number;
  next_due: string | null;
  last_activity: string | null;
};

export function describeEntry(e: Pick<Entry, "kind" | "item" | "quantity" | "amount_pence" | "paid" | "due_date">): string {
  if (e.kind === "payment") return `Paid you ${pounds(e.amount_pence)}`;
  const what = e.item ? `${e.quantity ? `${e.quantity} × ` : ""}${e.item} · ` : "";
  const status = e.paid ? "paid" : `owes you${e.due_date ? ` · due ${shortDate(e.due_date)}` : ""}`;
  return `${what}${pounds(e.amount_pence)} · ${status}`;
}
