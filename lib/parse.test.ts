// Run with: node --test lib/parse.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseMessage } from "./parse.ts";

const SUNDAY_18_OCT = new Date(2026, 9, 18);

const cases: [string, Partial<ReturnType<typeof parseMessage>>][] = [
  ["Sold three cakes to Ada for forty-five pounds, she'll pay Friday",
    { kind: "sale", customer: "Ada", item: "cakes", quantity: 3, amountPence: 4500, paid: false, dueDate: "2026-10-23" }],
  ["Sold 3 cakes to Ada for £45, she'll pay Friday",
    { kind: "sale", customer: "Ada", item: "cakes", quantity: 3, amountPence: 4500, paid: false, dueDate: "2026-10-23" }],
  ["Ada paid me £20", { kind: "payment", customer: "Ada", amountPence: 2000, paid: true }],
  ["Got £15 from Kemi", { kind: "payment", customer: "Kemi", amountPence: 1500 }],
  ["Sold 2 loaves to Tom £8 paid cash", { kind: "sale", customer: "Tom", quantity: 2, item: "loaves", amountPence: 800, paid: true }],
  ["Box braids for Grace £120, she owes me", { kind: "sale", customer: "Grace", item: "box braids", amountPence: 12000, paid: false }],
  ["Deep clean for Mrs Patel £65 pays end of the month",
    { kind: "sale", customer: "Mrs Patel", item: "deep clean", amountPence: 6500, paid: false, dueDate: "2026-10-31" }],
  ["Sold a birthday cake to Funmi for £35.50 on credit",
    { kind: "sale", customer: "Funmi", item: "birthday cake", quantity: 1, amountPence: 3550, paid: false }],
  ["Sold 6 cupcakes to Ben for 12 quid, paying next week",
    { kind: "sale", customer: "Ben", item: "cupcakes", quantity: 6, amountPence: 1200, dueDate: "2026-10-25" }],
  ["Sunita sent me twenty pounds", { kind: "payment", customer: "Sunita", amountPence: 2000 }],
];

for (const [input, expected] of cases) {
  test(input, () => {
    const got = parseMessage(input, SUNDAY_18_OCT);
    for (const [k, v] of Object.entries(expected)) {
      assert.deepEqual(got[k as keyof typeof got], v, `${k} in ${JSON.stringify(got)}`);
    }
  });
}
