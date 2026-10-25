"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function MobileForm({ customerId, mobile }: { customerId: string; mobile: string | null }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(mobile ?? "");
  const [saving, setSaving] = useState(false);

  if (!editing) {
    return (
      <p className="mt-3 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
        <span className="tabular-nums">{mobile ? `Mobile: ${mobile}` : "No mobile saved, so WhatsApp will ask who to send it to."}</span>
        <button
          onClick={() => setEditing(true)}
          className="min-h-11 font-medium text-brand underline underline-offset-4"
        >
          {mobile ? "Change" : "Add mobile"}
        </button>
      </p>
    );
  }

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    await createClient()
      .from("customers")
      .update({ mobile: value.trim() || null })
      .eq("id", customerId);
    setSaving(false);
    setEditing(false);
    router.refresh();
  };

  return (
    <form onSubmit={save} className="mt-4 flex gap-2">
      <input
        type="tel"
        inputMode="tel"
        autoFocus
        maxLength={20}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="07700 900123"
        aria-label="Customer's mobile"
        className="h-12 min-w-0 flex-1 rounded-control border border-input bg-card px-3 text-base tabular-nums outline-none focus-visible:outline-2 focus-visible:outline-ring"
      />
      <button disabled={saving} className="press h-12 min-w-24 rounded-control bg-brand px-5 font-semibold text-cream">
        {saving ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
