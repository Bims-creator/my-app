// Turns a typed or spoken message into a draft sale or payment.
// No AI service: plain rules for the way traders actually say things, e.g.
// "Sold 3 cakes to Ada for £45, she'll pay Friday" or "Ada paid me £20".
// The trader checks every field on the confirm card before anything is saved.

export type Draft = {
  kind: "sale" | "payment";
  customer: string;
  item: string;
  quantity: number | null;
  amountPence: number | null;
  paid: boolean;
  dueDate: string | null; // YYYY-MM-DD
};

const UNITS: Record<string, number> = {
  a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60,
  seventy: 70, eighty: 80, ninety: 90, dozen: 12,
};

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const TITLES = ["mr", "mrs", "ms", "miss", "auntie", "aunty", "uncle", "mama", "papa", "dr"];
const NOT_NAMES = new Set([
  "me", "her", "him", "them", "you", "cash", "card", "the", "today", "tomorrow",
  "friday", "monday", "tuesday", "wednesday", "thursday", "saturday", "sunday",
  "next", "later", "free", "it", "this", "that", "week", "month",
]);

// "forty-five" -> "45", "a hundred and twenty" -> "120". Leaves other words alone.
export function wordsToNumbers(text: string): string {
  const tokens = text.replace(/-/g, " ").split(/(\s+)/);
  const out: string[] = [];
  let current: number | null = null;
  let total = 0;
  let pendingSpace = "";

  const flush = () => {
    if (current !== null || total) {
      out.push(String(total + (current ?? 0)));
      current = null;
      total = 0;
    }
  };

  for (let i = 0; i < tokens.length; i++) {
    const raw = tokens[i];
    if (/^\s+$/.test(raw)) {
      pendingSpace = raw;
      continue;
    }
    const word = raw.toLowerCase().replace(/[.,!?]$/, "");
    const trailing = raw.slice(word.length).match(/[.,!?]$/) ? raw.slice(-1) : "";
    const inNumber = current !== null || total > 0;

    // "a cake" becomes "1 cake"; "a" inside a number ("forty a") is left alone
    if (word in UNITS && !((word === "a" || word === "an") && inNumber)) {
      if (!inNumber && pendingSpace && out.length) out.push(pendingSpace);
      current = (current ?? 0) + UNITS[word];
    } else if (word === "hundred" && inNumber) {
      current = (current ?? 1) * 100;
    } else if (word === "thousand" && inNumber) {
      total += (current ?? 1) * 1000;
      current = 0;
    } else if (word === "and" && inNumber && i + 2 < tokens.length && tokens[i + 2].toLowerCase() in UNITS) {
      // "a hundred and twenty": swallow "and"
    } else {
      flush();
      if (pendingSpace && out.length) out.push(pendingSpace);
      out.push(raw);
      pendingSpace = "";
      continue;
    }
    if (trailing) {
      flush();
      out.push(trailing);
    }
    pendingSpace = "";
  }
  flush();
  return out.join("");
}

function findAmountPence(text: string): { pence: number; match: string } | null {
  const patterns: RegExp[] = [
    /£\s?(\d+(?:,\d{3})*)(?:\.(\d{1,2}))?/i,
    /(\d+(?:,\d{3})*)(?:\.(\d{1,2}))?\s?(?:pounds?|quid|gbp)(?:\s(?:and\s)?(\d{1,2})(?:\s?(?:p|pence))?)?/i,
    /(\d+)\s?(?:p|pence)\b/i,
  ];
  for (let i = 0; i < patterns.length; i++) {
    const m = text.match(patterns[i]);
    if (!m) continue;
    if (i === 2) return { pence: Number(m[1]), match: m[0] };
    const pounds = Number(m[1].replace(/,/g, ""));
    const decimals = m[2] ?? m[3] ?? "0";
    const pence = decimals.length === 1 ? Number(decimals) * 10 : Number(decimals);
    return { pence: pounds * 100 + pence, match: m[0] };
  }
  return null;
}

function cleanName(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

const NAME = `((?:(?:${TITLES.join("|")})\\.?\\s)?[A-Za-z][A-Za-z'’]+)`;

function findCustomer(text: string, kind: Draft["kind"]): string {
  const candidates: RegExp[] =
    kind === "payment"
      ? [
          new RegExp(`^${NAME}\\s(?:has\\s|just\\s)?(?:paid|gave|sent|transferred|cleared|settled)`, "i"),
          new RegExp(`\\bfrom\\s${NAME}`, "i"),
          new RegExp(`\\b${NAME}\\s(?:has\\s|just\\s)?(?:paid|gave|sent|transferred|cleared|settled)`, "i"),
        ]
      : [
          new RegExp(`\\bto\\s${NAME}`, "i"),
          new RegExp(`\\bfor\\s${NAME}`, "i"),
          new RegExp(`^${NAME}\\s(?:bought|took|had|got|wants)`, "i"),
        ];
  for (const re of candidates) {
    const m = text.match(re);
    if (m && !NOT_NAMES.has(m[1].toLowerCase()) && !/^\d/.test(m[1])) {
      return cleanName(m[1]);
    }
  }
  return "";
}

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

function findDueDate(text: string, today: Date): string | null {
  const t = text.toLowerCase();
  if (/\btomorrow\b/.test(t)) return toISO(addDays(today, 1));
  if (/\bnext week\b/.test(t)) return toISO(addDays(today, 7));
  if (/\b(end of (the )?month|month end)\b/.test(t)) {
    return toISO(new Date(today.getFullYear(), today.getMonth() + 1, 0));
  }
  const inDays = t.match(/\bin (\d+) days?\b/);
  if (inDays) return toISO(addDays(today, Number(inDays[1])));
  const inWeeks = t.match(/\bin (\d+) weeks?\b/);
  if (inWeeks) return toISO(addDays(today, Number(inWeeks[1]) * 7));

  for (let i = 0; i < DAYS.length; i++) {
    const day = DAYS[i];
    if (new RegExp(`\\b(next )?${day}\\b`).test(t)) {
      let diff = (i - today.getDay() + 7) % 7;
      if (diff === 0) diff = 7;
      return toISO(addDays(today, diff));
    }
  }

  const ordinal = t.match(/\b(?:on |by )?(?:the )?(\d{1,2})(?:st|nd|rd|th)\b/);
  if (ordinal) {
    const dayNum = Number(ordinal[1]);
    if (dayNum >= 1 && dayNum <= 31) {
      let d = new Date(today.getFullYear(), today.getMonth(), dayNum);
      if (d <= today) d = new Date(today.getFullYear(), today.getMonth() + 1, dayNum);
      return toISO(d);
    }
  }
  if (/\btoday\b/.test(t) && /\bpay\b/.test(t)) return toISO(today);
  return null;
}

const OWES_WORDS =
  /\b(owes?|owing|will pay|'ll pay|’ll pay|pay(?:s|ing)? (?:me )?(?:on|by|next|later|tomorrow|friday|monday|tuesday|wednesday|thursday|saturday|sunday|end|in)|pay later|on credit|on tab|on account|not paid|hasn'?t paid|unpaid|later)\b/i;
const PAID_WORDS = /\b(paid|cash|card|bank transfer|transferred|settled|paid in full)\b/i;

function findItem(text: string, customer: string): { item: string; quantity: number | null } {
  // Strip the lead-in verb and look at the words before "to/for <name>" or the price.
  let t = text.replace(/^\s*(i\s+)?(just\s+)?(sold|sell|did|made|done)\s+/i, "");
  const stopRe = new RegExp(
    `\\s(?:to|for)\\s(?:${customer ? customer.replace(/\s+/g, "\\s") + "|" : ""}£|\\d)|\\s£|\\s\\d+(?:\\.\\d+)?\\s?(?:pounds?|quid)|,|\\s(?:at|each)\\s`,
    "i",
  );
  const stop = t.search(stopRe);
  if (stop >= 0) t = t.slice(0, stop);
  t = t.trim().replace(/[.,!?]+$/, "");

  const qty = t.match(/^(\d+)\s*(?:x\s*)?(.+)$/i);
  if (qty) return { quantity: Number(qty[1]), item: qty[2].trim().toLowerCase() };
  if (!t || customer && t.toLowerCase() === customer.toLowerCase()) return { quantity: null, item: "" };
  return { quantity: null, item: t.toLowerCase() };
}

export function parseMessage(input: string, today: Date = new Date()): Draft {
  const text = wordsToNumbers(input.trim());
  const isSale = /\b(sold|sell|selling|bought|took|did|made|for)\b/i.test(text) && !/^\s*(got|received)\b/i.test(text);
  const isPaymentVerb = /\b(paid( me)?|gave me|sent me|transferred|cleared|settled|got|received)\b/i.test(text);
  const kind: Draft["kind"] =
    isPaymentVerb && !/\b(sold|sell|bought|took)\b/i.test(text) && !(isSale && OWES_WORDS.test(text))
      ? "payment"
      : "sale";

  const amount = findAmountPence(text);
  const customer = findCustomer(text, kind);
  const dueDate = kind === "sale" ? findDueDate(text, today) : null;

  if (kind === "payment") {
    return { kind, customer, item: "", quantity: null, amountPence: amount?.pence ?? null, paid: true, dueDate: null };
  }

  const withoutAmount = amount ? text.replace(amount.match, " ") : text;
  const { item, quantity } = findItem(withoutAmount, customer);
  const owes = OWES_WORDS.test(text) || dueDate !== null;
  const paid = !owes && PAID_WORDS.test(text);

  return {
    kind,
    customer,
    item,
    quantity,
    amountPence: amount?.pence ?? null,
    // When the trader doesn't say, assume they're owed: that's the risky case to catch.
    paid,
    dueDate,
  };
}
