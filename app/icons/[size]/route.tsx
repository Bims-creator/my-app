import { tallyMark } from "@/lib/tally-mark";

// Stable icon URLs for the install manifest: /icons/192 and /icons/512.
export async function GET(_req: Request, { params }: { params: Promise<{ size: string }> }) {
  const { size } = await params;
  return tallyMark(size === "512" ? 512 : 192);
}
