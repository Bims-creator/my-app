"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/chat", label: "Record a sale", icon: MessageCircle },
  { href: "/owes", label: "Who owes me", icon: Users },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto flex max-w-md border-t bg-card">
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex h-16 flex-1 flex-col items-center justify-center gap-1 text-sm",
              active ? "font-semibold text-brand" : "text-muted-foreground",
            )}
          >
            <Icon className="h-5 w-5" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
