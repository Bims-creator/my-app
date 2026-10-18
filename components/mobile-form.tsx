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
      <p className="mt-4 text-sm text-muted-foreground">
        {mobile ? `Mobile: ${mobile}` : "No mobile saved."}{" "}
        <button onClick={() => setEditing(true)} className="text-brand underline underline-offset-4">
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
        className="h-11 flex-1 rounded-lg border border-input bg-cream/50 px-3 text-base outline-none focus:ring-2 focus:ring-ring"
      />
      <button disabled={saving} className="h-11 rounded-lg bg-brand px-4 font-medium text-cream">
        {saving ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
