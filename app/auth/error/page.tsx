import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-dvh w-full items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">
        <p className="font-display text-3xl font-bold tracking-tight text-brand">Tally</p>
        <h1 className="mt-6 font-display text-2xl font-semibold">That link didn&apos;t work</h1>
        <p className="mt-2 text-muted-foreground">
          Sign-in links only work once and expire after an hour. Ask for a new one.
        </p>
        {error && <p className="mt-3 break-words text-sm text-muted-foreground">Details: {error}</p>}
        <Link
          href="/auth/login"
          className="press mt-6 flex h-12 items-center justify-center rounded-control bg-primary text-base font-semibold text-primary-foreground"
        >
          Get a new link
        </Link>
      </div>
    </main>
  );
}
