import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION } from "@/lib/site";

// Lets traders add Tally to their home screen and open it like an app.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tally",
    short_name: "Tally",
    description: SITE_DESCRIPTION,
    start_url: "/chat",
    display: "standalone",
    background_color: "#f6f4ef",
    theme_color: "#f6f4ef",
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png" },
      { src: "/icons/512", sizes: "512x512", type: "image/png" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
