import type { CustomerBalance, Entry } from "@/lib/format";

// Totals for the top of the chat screen. Shared by the real page and the dev preview.
export function slateTotals(customers: CustomerBalance[], todays: Entry[], today: string) {
  const owing = customers.filter((c) => c.balance_pence > 0);
  return {
    owedPence: owing.reduce((sum, c) => sum + c.balance_pence, 0),
    owingCount: owing.length,
    overdueCount: owing.filter((c) => c.next_due !== null && c.next_due < today).length,
    salesTodayPence: todays.filter((e) => e.kind === "sale").reduce((sum, e) => sum + e.amount_pence, 0),
  };
}
