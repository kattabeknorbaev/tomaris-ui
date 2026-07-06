import { ImageResponse } from "next/og";

export const alt = "Tomaris — The Future of Uzbek AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
          background: "#09090b",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "#0F8F6F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: 44,
              fontWeight: 700,
            }}
          >
            T
          </div>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3 }}>
            Tomaris
          </div>
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 32,
            color: "#a1a1aa",
            textAlign: "center",
          }}
        >
          The first world-class AI built natively for Uzbek
        </div>
        <div
          style={{
            marginTop: 48,
            display: "flex",
            gap: 16,
            fontSize: 22,
            color: "#71717a",
          }}
        >
          <span style={{ color: "#12b88a" }}>27B parameters</span>
          <span>·</span>
          <span>UZ / EN / RU</span>
          <span>·</span>
          <span>tomaris.ai</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
