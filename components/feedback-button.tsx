"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { MessageSquare, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Opens a short sheet where a trader can tell us what's confusing, broken or missing.
// Messages go to the feedback table; only the team can read them (Supabase dashboard).
export function FeedbackButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const textRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    textRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    setOpen(false);
    if (state === "sent") {
      setMessage("");
      setState("idle");
    }
    buttonRef.current?.focus();
  }

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setState("sending");
    const { error } = await createClient()
      .from("feedback")
      .insert({ page: pathname.slice(0, 200), message: message.trim().slice(0, 2000) });
    setState(error ? "error" : "sent");
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 shrink-0 items-center gap-1.5 px-2 text-sm font-medium text-brand"
      >
        <MessageSquare className="h-4 w-4" aria-hidden />
        Feedback
      </button>

      {/* Rendered at the end of <body> so the sticky header can't trap it under the tab bar. */}
      {open && createPortal(
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="presentation">
          <div className="absolute inset-0 bg-[#17241f]/40" onClick={close} aria-hidden />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
            className="relative w-full max-w-md rounded-t-panel bg-card p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_-14px_rgba(11,60,42,0.45)] sm:rounded-panel"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 id="feedback-title" className="font-display text-xl font-semibold">
                {state === "sent" ? "Thank you" : "Tell us what you think"}
              </h2>
              <button type="button" onClick={close} aria-label="Close" className="-mr-2 -mt-2 flex h-11 w-11 items-center justify-center text-muted-foreground">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            {state === "sent" ? (
              <>
                <p className="mt-2 text-muted-foreground">We read every message. It helps us decide what to fix next.</p>
                <button type="button" onClick={close} className="press mt-5 h-12 w-full rounded-control bg-brand font-semibold text-cream">
                  Done
                </button>
              </>
            ) : (
              <form onSubmit={send}>
                <label htmlFor="feedback-message" className="mt-1 block text-sm text-muted-foreground">
                  What&apos;s confusing, broken or missing? Anything helps.
                </label>
                <textarea
                  id="feedback-message"
                  ref={textRef}
                  rows={4}
                  maxLength={2000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. It heard “fifteen” as “fifty”"
                  className="mt-3 w-full resize-none rounded-control border border-input bg-background px-3 py-3 text-base leading-snug outline-none focus-visible:outline-2 focus-visible:outline-ring"
                />
                {state === "error" && (
                  <p role="alert" className="mt-2 text-sm font-medium text-owed">
                    Couldn&apos;t send that. Your message is still here, so try again.
                  </p>
                )}
                <div className="mt-4 grid grid-cols-[1fr_2fr] gap-2">
                  <button type="button" onClick={close} className="press h-12 rounded-control border border-input font-medium">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!message.trim() || state === "sending"}
                    className="press h-12 rounded-control bg-brand font-semibold text-cream disabled:opacity-40"
                  >
                    {state === "sending" ? "Sending…" : "Send feedback"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
