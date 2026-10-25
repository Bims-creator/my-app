"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <button
      onClick={logout}
      className="-mr-2 min-h-11 shrink-0 px-2 text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
    >
      Sign out
    </button>
  );
}
