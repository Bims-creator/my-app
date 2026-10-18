import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-svh w-full items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold">That link didn&apos;t work</h1>
        <p className="mt-2 text-muted-foreground">
          Sign-in links only work once and expire after an hour. Ask for a new one.
        </p>
        {error && <p className="mt-3 text-sm text-muted-foreground">Details: {error}</p>}
        <Link
          href="/auth/login"
          className="mt-5 flex h-12 items-center justify-center rounded-md bg-primary text-base font-medium text-primary-foreground"
        >
          Get a new link
        </Link>
      </div>
    </main>
  );
}
