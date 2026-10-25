import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";
import { BusinessNameForm } from "@/components/business-name-form";

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
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <AppHeader businessName={profile?.business_name} />
      {profile ? (
        <>
          <div className="flex flex-1 flex-col pb-[var(--nav-h)]">{children}</div>
          <BottomNav />
        </>
      ) : (
        <BusinessNameForm />
      )}
    </div>
  );
}
