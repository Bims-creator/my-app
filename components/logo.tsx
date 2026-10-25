import { cn } from "@/lib/utils";

// The Tally logo: a five-bar tally gate chalked on the slate, beside the wordmark.
// Sizes with the surrounding font size (pass a text-* class), so one component fits the
// app header, the landing page and the sign-in screen. Same drawing as the app icon (lib/tally-mark.tsx).

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={cn("h-[1.2em] w-[1.2em] shrink-0", className)}>
      <rect width="100" height="100" rx="24" fill="#0b6e4f" />
      {[28, 41, 54, 67].map((x) => (
        <rect key={x} x={x} y={24} width={7} height={52} rx={3.5} fill="#f6f4ef" />
      ))}
      <rect x={18} y={46.5} width={64} height={7} rx={3.5} fill="#f6f4ef" transform="rotate(-28 50 50)" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-[0.35em] font-display font-bold leading-none tracking-tight text-brand", className)}>
      <LogoMark />
      Tally
    </span>
  );
}
