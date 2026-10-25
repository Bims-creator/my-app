import { notFound } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";
import { Chat } from "@/components/chat";
import { CustomerView } from "@/components/customer-view";
import { OwedSummary } from "@/components/owed-summary";
import { OwesList } from "@/components/owes-list";
import { londonDate, type CustomerBalance, type Entry } from "@/lib/format";
import { slateTotals } from "@/lib/slate";

// Design preview with made-up data, so the signed-in screens can be checked without an account.
// Development only: returns 404 in production, and the proxy only lets /dev through in development.
//   /dev/preview?screen=chat|owes|customer&data=demo|worst|empty

type Data = { business: string; customers: CustomerBalance[]; entries: Entry[] };

function day(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return londonDate(d);
}

function entry(id: string, customer_id: string, e: Partial<Entry>): Entry {
  return {
    id,
    customer_id,
    kind: "sale",
    item: null,
    quantity: null,
    amount_pence: 0,
    paid: true,
    due_date: null,
    source_text: null,
    created_at: new Date().toISOString(),
    ...e,
  };
}

const DEMO: Data = {
  business: "Bisi's Kitchen",
  customers: [
    { id: "c1", name: "Mrs Patel", mobile: "07700 900789", balance_pence: 6000, next_due: day(4), last_activity: null },
    { id: "c2", name: "Funmi", mobile: "07700 900654", balance_pence: 2000, next_due: day(1), last_activity: null },
    { id: "c3", name: "Kemi", mobile: "07700 900456", balance_pence: 1400, next_due: day(-2), last_activity: null },
    { id: "c4", name: "Grace", mobile: "07700 900321", balance_pence: 1200, next_due: day(7), last_activity: null },
    { id: "c5", name: "Tom", mobile: null, balance_pence: 0, next_due: null, last_activity: null },
  ],
  entries: [
    entry("e0", "c1", { item: "celebration cake", quantity: 1, amount_pence: 6000, paid: false, due_date: day(4), source_text: "Celebration cake for Mrs Patel, £60, she'll pay end of the month", created_at: new Date(Date.now() - 9 * 864e5).toISOString() }),
    entry("e1", "c5", { item: "sourdough loaves", quantity: 2, amount_pence: 900, paid: true, source_text: "Sold 2 sourdough loaves to Tom £9 paid" }),
    entry("e2", "c4", { item: "cinnamon rolls", quantity: 4, amount_pence: 1200, paid: false, due_date: day(7), source_text: "4 cinnamon rolls to Grace for £12, pays next week" }),
    entry("e3", "c3", { kind: "payment", amount_pence: 1000, source_text: "Kemi paid me £10" }),
  ],
};

const WORST: Data = {
  business: "Ọlábísí's Cakes, Small Chops & Celebration Catering (Peckham)",
  customers: [
    { id: "w1", name: "Oluwadamilola Folasade Adebayo-Ogunleye", mobile: "07700 900111", balance_pence: 125000050, next_due: day(-30), last_activity: null },
    { id: "w2", name: "Ọlábísí Àjàyí", mobile: null, balance_pence: 435000, next_due: day(3), last_activity: null },
    { id: "w3", name: "Bo", mobile: "07700 900222", balance_pence: 1, next_due: null, last_activity: null },
    { id: "w4", name: "Christopher Alexander Montgomery-Hughes III", mobile: null, balance_pence: 0, next_due: null, last_activity: null },
    { id: "w5", name: "J", mobile: null, balance_pence: -500, next_due: null, last_activity: null },
  ],
  entries: [
    entry("x1", "w1", {
      item: "wedding cake, three tiers, ivory buttercream with gold leaf and sugar flowers",
      quantity: 120,
      amount_pence: 125000050,
      paid: false,
      due_date: day(-30),
      source_text:
        "ok so the wedding cake for Oluwadamilola three tiers ivory buttercream gold leaf sugar flowers and the small chops for 120 guests comes to one million two hundred and fifty thousand pounds and fifty pence she said she will pay after the reception",
    }),
    entry("x2", "w3", { item: "chin chin", quantity: 1, amount_pence: 1, paid: false, source_text: "chin chin to Bo 1p" }),
    entry("x3", "w2", { kind: "payment", amount_pence: 435000, source_text: "Ọlábísí paid £4,350" }),
  ],
};

const EMPTY: Data = { business: "Ada's Cakes", customers: [], entries: [] };

export default async function Preview({
  searchParams,
}: {
  searchParams: Promise<{ screen?: string; data?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const { screen = "chat", data = "demo" } = await searchParams;
  const d = data === "worst" ? WORST : data === "empty" ? EMPTY : DEMO;
  const today = londonDate();

  let content: React.ReactNode;
  if (screen === "owes") {
    content = <OwesList customers={d.customers} today={today} />;
  } else if (screen === "customer" && d.customers[0]) {
    const c = d.customers[0];
    content = (
      <CustomerView
        customer={c}
        history={d.entries.filter((e) => e.customer_id === c.id)}
        businessName={d.business}
        today={today}
      />
    );
  } else {
    const todays = d.entries.filter((e) => londonDate(new Date(e.created_at)) === today);
    content = (
      <>
        <OwedSummary {...slateTotals(d.customers, todays, today)} />
        <Chat customers={d.customers} todays={todays} />
      </>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <AppHeader businessName={d.business} />
      <div className="flex flex-1 flex-col pb-[var(--nav-h)]">{content}</div>
      <BottomNav />
    </div>
  );
}
