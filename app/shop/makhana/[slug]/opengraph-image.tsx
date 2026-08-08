import { ImageResponse } from "next/og";
import { products } from "@/lib/products";

export const alt = "Makheshwari Foods roasted makhana";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT: Record<string, string> = {
  peri: "#E07A5F",
  mint: "#A9C97E",
  salt: "#F2B79E",
};

export default async function Image({ params }: { params: { slug: string } }) {
  const p = products.find((x) => x.slug === params.slug);
  const accent = p ? ACCENT[p.accent] || "#C9A227" : "#C9A227";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#12352A",
          padding: 90,
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, width: 14, height: "100%", background: accent, display: "flex" }} />

        <div style={{ display: "flex", fontSize: 20, letterSpacing: 9, color: "#C9A227", textTransform: "uppercase", marginBottom: 26 }}>
          Makheshwari Makhana
        </div>

        <div style={{ display: "flex", fontSize: 92, color: "#FDF6EC", lineHeight: 1.05 }}>
          {p?.name || "Roasted Makhana"}
        </div>

        <div style={{ display: "flex", fontSize: 32, color: accent, marginTop: 24, maxWidth: 880 }}>
          {p?.hook || "Roasted, never fried."}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 54 }}>
          {p?.price ? (
            <div style={{ display: "flex", fontSize: 44, color: "#FDF6EC" }}>&#8377;{p.price}</div>
          ) : null}
          {p?.weightG ? (
            <div style={{ display: "flex", fontSize: 26, color: "rgba(253,246,236,0.55)" }}>{p.weightG} g</div>
          ) : null}
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 44 }}>
          {["Roasted, never fried", "No palm oil", "Gluten free"].map((t) => (
            <div key={t} style={{ display: "flex", border: "1px solid rgba(253,246,236,0.25)", borderRadius: 999, padding: "10px 24px", fontSize: 20, color: "rgba(253,246,236,0.7)" }}>
              {t}
            </div>
          ))}
        </div>

        <div style={{ position: "absolute", bottom: 60, right: 90, display: "flex", fontSize: 17, letterSpacing: 5, color: "rgba(253,246,236,0.35)", textTransform: "uppercase" }}>
          Rooted in Bihar
        </div>
      </div>
    ),
    size
  );
}