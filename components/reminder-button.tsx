"use client";

import { MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { pounds, shortDate, whatsappNumber } from "@/lib/format";

export function ReminderButton({
  customerId,
  name,
  mobile,
  balancePence,
  dueDate,
  businessName,
}: {
  customerId: string;
  name: string;
  mobile: string | null;
  balancePence: number;
  dueDate: string | null;
  businessName: string;
}) {
  const message =
    `Hi ${name}, hope you're well. Just a friendly reminder that ${pounds(balancePence)} ` +
    `is still owing${dueDate ? ` (due ${shortDate(dueDate)})` : ""}. ` +
    `Thank you!${businessName ? ` - ${businessName}` : ""}`;
  // With a number it opens that chat; without one, WhatsApp asks who to send it to.
  const href = `https://wa.me/${whatsappNumber(mobile)}?text=${encodeURIComponent(message)}`;

  const logReminder = () => {
    // Counted for our success metric. Don't block the link while it saves.
    void createClient()
      .from("reminders")
      .insert({ customer_id: customerId, amount_pence: balancePence })
      .then(() => undefined);
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={logReminder}
      className="press mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-control bg-[#25d366] text-base font-semibold text-[#0b3d2a]"
    >
      <MessageCircle className="h-5 w-5" aria-hidden />
      Send WhatsApp reminder
    </a>
  );
}
