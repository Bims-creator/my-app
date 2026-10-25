// The public address of the live site, used for share links and the share image.
// On Vercel this is the production domain, so preview deployments still point people at the real site.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://my-app-eight-fawn-73.vercel.app";

export const SITE_TITLE = "Tally: say what you sold, see who owes you";
export const SITE_DESCRIPTION =
  "A slate for small traders who let regulars pay later. Tap the mic, say what happened, and Tally keeps track of who owes you and how much.";

// Who to contact about personal data. Set NEXT_PUBLIC_CONTACT_EMAIL in Vercel.
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";

// Sign-in options that need setup in Google Cloud or an SMS provider first.
// Set to "true" in Vercel once the provider is switched on in Supabase, so traders never see a broken button.
export const AUTH_GOOGLE = process.env.NEXT_PUBLIC_AUTH_GOOGLE === "true";
export const AUTH_PHONE = process.env.NEXT_PUBLIC_AUTH_PHONE === "true";
