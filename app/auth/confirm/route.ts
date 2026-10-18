import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

// The sign-in email link lands here. Depending on the email template it carries
// either a one-time `code` or a `token_hash`; both become a signed-in session.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const nextParam = searchParams.get("next") ?? "/chat";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/chat";

  const supabase = await createClient();
  let errorMessage = "That sign-in link is missing a code.";

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) redirect(next);
    errorMessage = error.message;
  } else if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) redirect(next);
    errorMessage = error.message;
  }

  redirect(`/auth/error?error=${encodeURIComponent(errorMessage)}`);
}
