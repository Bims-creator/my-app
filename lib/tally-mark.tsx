import { ImageResponse } from "next/og";

// The app icon: a five-bar tally gate in chalk-cream on the slate green.
// Shared by the favicon, the iPhone home-screen icon and the install icons.
export function tallyMark(size: number) {
  const s = size;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0b6e4f" }}>
        <svg width={s} height={s} viewBox="0 0 100 100">
          {[28, 41, 54, 67].map((x) => (
            <rect key={x} x={x} y={24} width={7} height={52} rx={3.5} fill="#f6f4ef" />
          ))}
          <rect x={18} y={46.5} width={64} height={7} rx={3.5} fill="#f6f4ef" transform="rotate(-28 50 50)" />
        </svg>
      </div>
    ),
    { width: s, height: s },
  );
}
