"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Shown once, the first time a trader signs in.
export function BusinessNameForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("profiles")
      .insert({ id: data.user?.id, business_name: name.trim() });
    setSaving(false);
    if (error) setError("Couldn't save that. Please try again.");
    else router.refresh();
  };

  return (
    <form onSubmit={save} className="m-4 rounded-2xl bg-card p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Welcome to Tally</h1>
      <p className="mt-1 text-muted-foreground">
        What&apos;s your business called? It goes on the payment reminders you send.
      </p>
      <div className="mt-5 grid gap-2">
        <Label htmlFor="business">Business name</Label>
        <Input
          id="business"
          required
          maxLength={80}
          placeholder="e.g. Bisi's Kitchen"
          className="h-12 text-base"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      {error && <p className="mt-3 text-sm text-owed">{error}</p>}
      <Button type="submit" className="mt-5 h-12 w-full text-base" disabled={saving || !name.trim()}>
        {saving ? "Saving…" : "Start"}
      </Button>
    </form>
  );
}
