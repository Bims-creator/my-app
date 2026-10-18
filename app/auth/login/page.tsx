import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <main className="flex min-h-svh w-full flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-brand">Tally</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Say what you sold. See who owes you.
          </p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Only you can see your records.
        </p>
      </div>
    </main>
  );
}
