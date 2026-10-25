"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Draft } from "@/lib/parse";
import { pounds, type CustomerBalance } from "@/lib/format";
import { cn } from "@/lib/utils";

// Every field is editable. Nothing is saved until the trader taps Save.
export function ConfirmCard({
  draft,
  sourceText,
  customers,
  onCancel,
  onSaved,
}: {
  draft: Draft;
  sourceText: string;
  customers: CustomerBalance[];
  onCancel: () => void;
  onSaved: (message: string) => void;
}) {
  const [kind, setKind] = useState(draft.kind);
  const [customer, setCustomer] = useState(draft.customer);
  const [item, setItem] = useState(draft.item);
  const [quantity, setQuantity] = useState(draft.quantity ? String(draft.quantity) : "");
  const [amount, setAmount] = useState(draft.amountPence ? (draft.amountPence / 100).toFixed(2) : "");
  const [paid, setPaid] = useState(draft.paid);
  const [dueDate, setDueDate] = useState(draft.dueDate ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amountPence = Math.round(Number(amount.replace(/[£,\s]/g, "")) * 100);
  const qty = quantity ? Math.max(1, Math.floor(Number(quantity))) : null;
  const owes = kind === "sale" && !paid;
  const name = customer.trim().replace(/\s+/g, " ");
  const canSave = name.length > 0 && Number.isFinite(amountPence) && amountPence > 0 && !saving;

  const save = async () => {
    setSaving(true);
    setError(null);
    const supabase = createClient();

    let existing = customers.find((c) => c.name.toLowerCase() === name.toLowerCase());
    let customerId = existing?.id;
    if (!customerId) {
      let { data, error } = await supabase.from("customers").insert({ name }).select("id").single();
      if (error?.code === "23505") {
        // Same name added from another tab since this page loaded: use that customer.
        ({ data, error } = await supabase.from("customers").select("id").ilike("name", name).single());
      }
      if (error || !data) {
        setSaving(false);
        setError("Couldn't save the customer. Please try again.");
        return;
      }
      customerId = data.id;
      existing = undefined;
    }

    const { error } = await supabase.from("entries").insert({
      customer_id: customerId,
      kind,
      item: kind === "sale" ? item.trim() || null : null,
      quantity: kind === "sale" ? qty : null,
      amount_pence: amountPence,
      paid: kind === "payment" ? true : paid,
      due_date: owes && dueDate ? dueDate : null,
      source_text: sourceText.slice(0, 500),
    });
    setSaving(false);
    if (error) {
      setError("Couldn't save that. Please try again.");
      return;
    }

    const before = existing?.balance_pence ?? 0;
    const after = before + (owes ? amountPence : kind === "payment" ? -amountPence : 0);
    if (kind === "sale" && paid) onSaved(`Saved. ${name} paid ${pounds(amountPence)}.`);
    else if (after > 0) onSaved(`Saved. ${name} now owes you ${pounds(after)}.`);
    else onSaved(`Saved. ${name} is all paid up.`);
  };

  return (
    <div className="self-stretch rounded-panel border border-brand/40 bg-card p-4 shadow-[0_10px_30px_-14px_rgba(11,60,42,0.45)]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="font-display text-lg font-semibold">Check this, then save</p>
        <Toggle
          options={[
            ["sale", "Sale"],
            ["payment", "Payment"],
          ]}
          value={kind}
          onChange={(v) => setKind(v as Draft["kind"])}
        />
      </div>

      <div className="grid gap-3">
        <Field label="Customer">
          <input
            list="customer-names"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="First name"
            maxLength={60}
            className={inputClass(!name)}
          />
          <datalist id="customer-names">
            {customers.map((c) => (
              <option key={c.id} value={c.name} />
            ))}
          </datalist>
        </Field>

        {kind === "sale" && (
          <div className="grid grid-cols-[4.5rem_1fr] gap-2">
            <Field label="Qty">
              <input
                inputMode="numeric"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value.replace(/\D/g, ""))}
                placeholder="1"
                className={inputClass(false)}
              />
            </Field>
            <Field label="Item">
              <input
                value={item}
                onChange={(e) => setItem(e.target.value)}
                placeholder="e.g. cakes"
                maxLength={80}
                className={inputClass(false)}
              />
            </Field>
          </div>
        )}

        <Field label="Amount">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className={cn(inputClass(!(amountPence > 0)), "pl-7")}
            />
          </div>
        </Field>

        {kind === "sale" && (
          <Toggle
            full
            options={[
              ["paid", "Paid"],
              ["owes", "Owes me"],
            ]}
            value={paid ? "paid" : "owes"}
            onChange={(v) => setPaid(v === "paid")}
          />
        )}

        {owes && (
          <Field label="Due date (optional)">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputClass(false)}
            />
          </Field>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-owed">{error}</p>}
      {!name && <p className="mt-3 text-sm text-muted-foreground">Add the customer&apos;s name to save.</p>}
      {name && !(amountPence > 0) && <p className="mt-3 text-sm text-muted-foreground">Add the amount to save.</p>}

      <div className="mt-4 grid grid-cols-[1fr_2fr] gap-2">
        <button onClick={onCancel} className="press h-12 rounded-control border border-input font-medium">
          Cancel
        </button>
        <button
          onClick={save}
          disabled={!canSave}
          className="press h-12 rounded-control bg-brand font-semibold text-cream disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

function inputClass(missing: boolean) {
  return cn(
    "h-12 w-full rounded-control border bg-background px-3 text-base tabular-nums outline-none focus-visible:outline-2 focus-visible:outline-ring",
    missing ? "border-owed/60" : "border-input",
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid min-w-0 gap-1 text-sm font-medium text-muted-foreground">
      {label}
      {children}
    </label>
  );
}

function Toggle({
  options,
  value,
  onChange,
  full,
}: {
  options: [string, string][];
  value: string;
  onChange: (v: string) => void;
  full?: boolean;
}) {
  return (
    <div role="radiogroup" className={cn("flex rounded-control bg-muted p-1", full && "w-full")}>
      {options.map(([v, label]) => {
        const active = v === value;
        const owedStyle = v === "owes" && active;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(v)}
            className={cn(
              "press min-h-11 rounded-[7px] px-4 text-sm font-semibold",
              full && "flex-1 text-base",
              active ? (owedStyle ? "bg-owed text-white" : "bg-brand text-cream") : "text-muted-foreground",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
