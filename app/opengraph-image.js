import { ImageResponse } from "next/og";

export const alt = "Jaiten Kang — Software Engineer & Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Branded social share card (Open Graph + Twitter). Next auto-injects the
 * resulting URL into <meta property="og:image"> and twitter:image, so links to
 * the site preview with a designed card instead of a blank thumbnail.
 */
export default function OpenGraphImage() {
  const paper = "#f3f0e7";
  const ink = "#16140d";
  const ink3 = "#6a6657";
  const accent = "#d6401e";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: paper,
          color: ink,
          padding: "76px 80px",
          fontFamily: "Inter, sans-serif"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: ink3
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 16,
                background: accent
              }}
            />
            <span style={{ color: ink }}>Jaiten Kang</span>
          </div>
          <span>Portfolio</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 78,
            fontWeight: 600,
            letterSpacing: -2,
            lineHeight: 1.04
          }}
        >
          <span>I build and ship</span>
          <span>
            websites, extensions{" "}
            <span style={{ color: accent }}>&amp; AI systems.</span>
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 26,
            color: ink3
          }}
        >
          <span>Software Engineer · McGill CS &rsquo;26</span>
          <span>Vancouver · Montréal · Remote</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
