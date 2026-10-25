import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: "%s · Tally" },
  description: SITE_DESCRIPTION,
  applicationName: "Tally",
  appleWebApp: { capable: true, title: "Tally", statusBarStyle: "default" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Tally",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: "#f6f4ef",
  colorScheme: "light",
};

// Body text: clear at small sizes.
const body = Geist({
  variable: "--font-body",
  display: "swap",
  subsets: ["latin", "latin-ext"],
});

// Display: sturdy, slightly hand-cut letters, like a painted shop sign.
// Used for the wordmark, headings and the big money figures.
const display = Bricolage_Grotesque({
  variable: "--font-display",
  display: "swap",
  subsets: ["latin", "latin-ext", "vietnamese"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${body.variable} ${display.variable}`}>
      <body className="antialiased">
        <noscript>
          <p className="p-4 text-center">Tally needs JavaScript turned on to work.</p>
        </noscript>
        {children}
        {/* Cookie-free page and speed stats. Turned on in the Vercel dashboard. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
