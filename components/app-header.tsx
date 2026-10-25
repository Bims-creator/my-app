import { FeedbackButton } from "@/components/feedback-button";
import { LogoutButton } from "@/components/logout-button";
import { Logo } from "@/components/logo";

export function AppHeader({ businessName }: { businessName?: string | null }) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background pt-[env(safe-area-inset-top)]">
      <div className="flex h-14 items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 items-baseline gap-2">
          <Logo className="text-2xl" />
          {businessName && (
            <p className="min-w-0 truncate text-sm text-muted-foreground" title={businessName}>
              {businessName}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center">
          <FeedbackButton />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
