"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Send } from "lucide-react";
import { parseMessage, type Draft } from "@/lib/parse";
import { entryDetail, plural, pounds } from "@/lib/format";
import { cn } from "@/lib/utils";

// A live demo on the landing page: visitors type what they sold and watch it land on a slate.
// Uses the same rules the app uses (lib/parse). Runs in the browser only; nothing is sent or saved.

type Line = { id: number; said: string; draft: Draft };

const STARTER = "Sold 3 cakes to Ada for £45, she'll pay Friday";
const IDEAS = ["Box braids for Grace £120, she owes me", "Ada paid me £20", "Sold 2 loaves to Tom £8 paid cash"];

let nextId = 1;
const line = (said: string): Line => ({ id: nextId++, said, draft: parseMessage(said) });

export function TryIt() {
  const [lines, setLines] = useState<Line[]>(() => [line(STARTER)]);
  const [text, setText] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  // Same balance rules as the app: unpaid sales add to what someone owes, payments take it away.
  const { owed, owing } = useMemo(() => {
    const balances = new Map<string, number>();
    for (const { draft: d } of lines) {
      const key = d.customer.toLowerCase();
      const change = d.kind === "payment" ? -(d.amountPence ?? 0) : d.paid ? 0 : (d.amountPence ?? 0);
      balances.set(key, (balances.get(key) ?? 0) + change);
    }
    const positive = [...balances.values()].filter((b) => b > 0);
    return { owed: positive.reduce((s, b) => s + b, 0), owing: positive.length };
  }, [lines]);

  const add = (said: string) => {
    const clean = said.trim();
    if (!clean) return;
    const next = line(clean);
    if (!next.draft.customer || !next.draft.amountPence) {
      setHint("Try adding a name and an amount, like “Sold 2 loaves to Tom £8”.");
      return;
    }
    setHint(null);
    setTouched(true);
    setText("");
    setLines((ls) => [next, ...ls].slice(0, 5));
  };

  const reset = () => {
    setLines([line(STARTER)]);
    setHint(null);
    setTouched(false);
    setText("");
  };

  return (
    <section aria-label="Try Tally" className="-mx-5 bg-brand px-5 py-7 sm:mx-0 sm:rounded-panel sm:px-7">
      <div className="mx-auto max-w-sm">
        <p className="font-display text-xl font-semibold text-cream">Try it. Type what you sold.</p>

        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            add(text);
          }}
        >
          <label htmlFor="try-it" className="sr-only">
            What did you sell?
          </label>
          <input
            id="try-it"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Sold 2 loaves to Tom £8"
            autoComplete="off"
            maxLength={160}
            className="h-12 min-w-0 flex-1 rounded-control border-0 bg-card px-4 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
          />
          <button
            type="submit"
            aria-label="Add to the slate"
            className="press flex h-12 w-12 shrink-0 items-center justify-center rounded-control bg-cream text-brand focus-visible:outline-cream"
          >
            <Send className="h-5 w-5" aria-hidden />
          </button>
        </form>

        <div className="mt-2 flex flex-wrap gap-x-3">
          {IDEAS.map((idea) => (
            <button
              key={idea}
              type="button"
              onClick={() => add(idea)}
              className="min-h-11 text-left text-sm text-cream/90 underline decoration-cream/40 underline-offset-4"
            >
              {idea}
            </button>
          ))}
        </div>
        {hint && (
          <p role="status" className="mt-1 text-sm font-medium text-cream">
            {hint}
          </p>
        )}

        {/* The slate. */}
        <div className="mt-4 rounded-panel bg-background p-4" aria-live="polite">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">
                {owed > 0 ? `${plural(owing, "person owes", "people owe")} you` : "Nobody owes you anything"}
              </p>
              <p className={cn("font-display text-4xl font-bold leading-none tabular-nums", owed > 0 ? "text-owed" : "text-brand")}>
                {pounds(owed)}
              </p>
            </div>
            {touched && (
              <button
                type="button"
                onClick={reset}
                className="-mr-2 -mt-1 inline-flex min-h-11 items-center gap-1 px-2 text-sm font-medium text-muted-foreground"
              >
                <RotateCcw className="h-4 w-4" aria-hidden /> Start again
              </button>
            )}
          </div>

          <ul className="mt-3 flex flex-col gap-2">
            {lines.map(({ id, said, draft: d }, i) => {
              const owes = d.kind === "sale" && !d.paid;
              return (
                <li key={id} className={cn("flex flex-col gap-1.5", i === 0 && touched && "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 motion-safe:duration-300")}>
                  <p className="max-w-[90%] self-end break-words rounded-panel rounded-br-[4px] bg-accent px-3.5 py-2 text-sm">
                    &ldquo;{said}&rdquo;
                  </p>
                  <div className="w-[90%] self-start rounded-panel rounded-bl-[4px] border bg-card px-3.5 py-2 text-[15px]">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className="min-w-0 break-words font-semibold">{d.customer}</span>
                      <span className={cn("ml-auto shrink-0 font-semibold tabular-nums", owes && "text-owed")}>
                        {d.kind === "payment" ? "−" : ""}
                        {pounds(d.amountPence ?? 0)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {entryDetail({ kind: d.kind, item: d.item || null, quantity: d.quantity, paid: d.paid, due_date: d.dueDate })}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="mt-3 text-sm text-cream/85">
          This is a demo, so nothing is saved. In the app you can also just say it, and you check every line before it
          goes on your slate.
        </p>
      </div>
    </section>
  );
}
