import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BottomNav } from "@/components/bottom-nav";
import { BusinessNameForm } from "@/components/business-name-form";
import { LogoutButton } from "@/components/logout-button";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("business_name")
    .eq("id", data.claims.sub)
    .maybeSingle();

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-brand px-4 py-3 text-cream">
        <div>
          <p className="text-lg font-semibold leading-tight">Tally</p>
          {profile && <p className="text-sm leading-tight opacity-80">{profile.business_name}</p>}
        </div>
        <LogoutButton />
      </header>
      {profile ? (
        <>
          <div className="flex flex-1 flex-col pb-16">{children}</div>
          <BottomNav />
        </>
      ) : (
        <BusinessNameForm />
      )}
    </div>
  );
}
