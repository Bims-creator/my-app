"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, Send, Square } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { parseMessage, type Draft } from "@/lib/parse";
import { entryDetail, pounds, type CustomerBalance, type Entry } from "@/lib/format";
import { loadSampleData } from "@/lib/sample-data";
import { ConfirmCard } from "@/components/confirm-card";
import { cn } from "@/lib/utils";

// Minimal types for the browser's built-in speech-to-text (Chrome, Safari).
type SpeechResultEvent = { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> };
type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechResultEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};
type RecognitionCtor = new () => Recognition;

function getRecognition(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function Chat({ customers, todays }: { customers: CustomerBalance[]; todays: Entry[] }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [draftId, setDraftId] = useState(0);
  const [saved, setSaved] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [voiceOk, setVoiceOk] = useState(false);
  const [loadingSample, setLoadingSample] = useState(false);
  const recRef = useRef<Recognition | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVoiceOk(getRecognition() !== null);
  }, []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [draft, saved, todays.length]);

  const makeDraft = (message: string) => {
    const clean = message.trim();
    if (!clean) return;
    setSaved(null);
    setNotice(null);
    setSourceText(clean);
    setDraft(parseMessage(clean));
    setDraftId((n) => n + 1); // fresh confirm card for every new message
    setText("");
  };

  const toggleMic = () => {
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const Ctor = getRecognition();
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = "en-GB";
    rec.interimResults = true;
    rec.continuous = false;
    let finalText = "";
    rec.onresult = (e) => {
      let heard = "";
      for (let i = 0; i < e.results.length; i++) heard += e.results[i][0].transcript;
      setText(heard);
      if (e.results[e.results.length - 1].isFinal) finalText = heard;
    };
    rec.onerror = (e) => {
      setNotice(
        e.error === "not-allowed"
          ? "Tally needs your microphone. Allow it in your browser settings, or type instead."
          : "Didn't catch that. Try again, or type it.",
      );
    };
    rec.onend = () => {
      setListening(false);
      recRef.current = null;
      // Voice note -> text only. The audio is never saved or sent to us.
      if (finalText) makeDraft(finalText);
    };
    recRef.current = rec;
    setSaved(null);
    setNotice(null);
    setListening(true);
    rec.start();
  };

  const onSaved = (message: string) => {
    setDraft(null);
    setSaved(message);
    router.refresh();
  };

  const trySample = async () => {
    setLoadingSample(true);
    const error = await loadSampleData(createClient());
    setLoadingSample(false);
    if (error) setNotice("Couldn't add the sample entries. Please try again.");
    else router.refresh();
  };

  return (
    <>
      <div className="flex flex-1 flex-col gap-3 px-3 py-4">
        <Bubble from="tally">
          Tell me what you sold, or who paid you. For example:{" "}
          <em>&ldquo;Sold 3 cakes to Ada for £45, she&apos;ll pay Friday&rdquo;</em>
        </Bubble>

        {customers.length === 0 && todays.length === 0 && (
          <Bubble from="tally">
            Want to see how it works first?
            <button
              onClick={trySample}
              disabled={loadingSample}
              className="press mt-3 flex h-11 w-full items-center justify-center rounded-control border border-brand font-semibold text-brand disabled:opacity-60"
            >
              {loadingSample ? "Adding…" : "Fill with sample entries"}
            </button>
          </Bubble>
        )}

        {todays.length > 0 && (
          <p className="mt-1 text-center text-sm font-medium text-muted-foreground">Today</p>
        )}
        {todays.map((e) => {
          const name = customers.find((c) => c.id === e.customer_id)?.name ?? "Customer";
          const owes = e.kind === "sale" && !e.paid;
          return (
            <div key={e.id} className="flex flex-col gap-1.5">
              {e.source_text && <Bubble from="me">{e.source_text}</Bubble>}
              <Bubble from="tally" wide>
                {/* Long names take the whole line and push the amount underneath, rather than breaking mid-word. */}
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="min-w-0 break-words font-semibold">{name}</span>
                  <span className={cn("ml-auto shrink-0 font-semibold tabular-nums", owes && "text-owed")}>
                    {e.kind === "payment" ? "−" : ""}
                    {pounds(e.amount_pence)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{entryDetail(e)}</p>
              </Bubble>
            </div>
          );
        })}

        {draft && (
          <>
            <Bubble from="me">{sourceText}</Bubble>
            <ConfirmCard
              key={draftId}
              draft={draft}
              sourceText={sourceText}
              customers={customers}
              onCancel={() => setDraft(null)}
              onSaved={onSaved}
            />
          </>
        )}
        {saved && <Bubble from="tally" strong>{saved}</Bubble>}
        {notice && <Bubble from="tally">{notice}</Bubble>}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          makeDraft(text);
        }}
        className="sticky bottom-[var(--nav-h)] z-10 flex items-end gap-2 bg-brand px-3 py-3"
      >
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              makeDraft(text);
            }
          }}
          placeholder={listening ? "Listening…" : "Type what you sold…"}
          aria-label="What did you sell?"
          className="max-h-32 min-h-14 flex-1 resize-none rounded-panel border-0 bg-card px-4 py-4 text-base leading-snug text-foreground outline-none placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
        />
        {text.trim() ? (
          <button
            type="submit"
            aria-label="Check it"
            className="press flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cream text-brand focus-visible:outline-cream"
          >
            <Send className="h-5 w-5" aria-hidden />
          </button>
        ) : null}
        {voiceOk && (
          <button
            type="button"
            onClick={toggleMic}
            aria-label={listening ? "Stop recording" : "Record a voice note"}
            className={cn(
              "press flex h-16 w-16 shrink-0 items-center justify-center rounded-full focus-visible:outline-cream",
              listening ? "bg-owed text-white motion-safe:animate-pulse" : "bg-cream text-brand",
            )}
          >
            {listening ? <Square className="h-6 w-6" aria-hidden /> : <Mic className="h-7 w-7" aria-hidden />}
          </button>
        )}
      </form>
    </>
  );
}

function Bubble({
  from,
  strong,
  wide,
  children,
}: {
  from: "me" | "tally";
  strong?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "max-w-[85%] break-words rounded-panel px-4 py-2.5 text-[15px] leading-normal",
        from === "me" ? "self-end rounded-br-[4px] bg-accent" : "self-start rounded-bl-[4px] border bg-card",
        wide && "w-[85%]",
        strong && "font-medium",
      )}
    >
      {children}
    </div>
  );
}
