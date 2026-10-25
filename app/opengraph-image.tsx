import { ImageResponse } from "next/og";

// The picture WhatsApp, LinkedIn and X show when someone shares the link.
export const alt = "Tally: say what you sold, see who owes you";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f6f4ef", padding: 64, gap: 56 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1.15 }}>
          <div style={{ fontSize: 56, fontWeight: 700, color: "#0b6e4f", letterSpacing: -1 }}>Tally</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 76, fontWeight: 700, color: "#17241f", lineHeight: 1.04, letterSpacing: -2 }}>
              Say what you sold. See who owes you.
            </div>
            <div style={{ fontSize: 28, color: "#4f5a55", marginTop: 24, lineHeight: 1.35 }}>
              A slate for small traders who let regulars pay later.
            </div>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0b6e4f",
            borderRadius: 28,
            padding: 36,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              background: "#f6f4ef",
              borderRadius: 20,
              padding: 28,
              gap: 14,
            }}
          >
            <div style={{ fontSize: 22, color: "#4f5a55" }}>5 people owe you</div>
            <div style={{ fontSize: 64, fontWeight: 700, color: "#b4451f", lineHeight: 1 }}>£151.00</div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                background: "#fdfcfa",
                border: "2px solid #ddd8cf",
                borderRadius: 16,
                padding: "16px 20px",
                marginTop: 10,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, fontWeight: 700 }}>
                <span style={{ color: "#17241f" }}>Ada</span>
                <span style={{ color: "#b4451f" }}>£45.00</span>
              </div>
              <div style={{ fontSize: 20, color: "#4f5a55", marginTop: 4 }}>3 × cakes · owes you, due Friday</div>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
