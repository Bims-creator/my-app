import type { NextConfig } from "next";

// Every Tally page shows one trader's own records, so pages render per request.
// The template's cacheComponents mode is left off to keep that simple.
const nextConfig: NextConfig = {};

export default nextConfig;
