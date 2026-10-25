import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Tally",
  description: "Say what you sold. See who owes you.",
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
      </body>
    </html>
  );
}
