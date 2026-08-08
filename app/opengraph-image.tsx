import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Makheshwari Foods - Roasted makhana from Mithila, Bihar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#12352A",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 40, left: 40, right: 40, bottom: 40, border: "1px solid rgba(201,162,39,0.45)", borderRadius: 28, display: "flex" }} />

        <div style={{ display: "flex", fontSize: 22, letterSpacing: 10, color: "#C9A227", textTransform: "uppercase", marginBottom: 30 }}>
          Makheshwari Foods
        </div>

        <div style={{ display: "flex", fontSize: 86, color: "#FDF6EC", textAlign: "center", lineHeight: 1.1, padding: "0 90px" }}>
          Roasted, never fried.
        </div>

        <div style={{ display: "flex", fontSize: 30, color: "rgba(253,246,236,0.65)", marginTop: 30 }}>
          Premium makhana from Samastipur, Bihar
        </div>

        <div style={{ display: "flex", gap: 18, marginTop: 48 }}>
          {["Peri Peri", "Garden Mint", "Himalayan Pink Salt"].map((f) => (
            <div key={f} style={{ display: "flex", border: "1px solid rgba(201,162,39,0.5)", borderRadius: 999, padding: "12px 28px", fontSize: 22, color: "#C9A227" }}>
              {f}
            </div>
          ))}
        </div>

        <div style={{ position: "absolute", bottom: 70, display: "flex", fontSize: 18, letterSpacing: 6, color: "rgba(253,246,236,0.4)", textTransform: "uppercase" }}>
          Rooted in Bihar
        </div>
      </div>
    ),
    size
  );
}