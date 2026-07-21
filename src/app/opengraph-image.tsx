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
          {/* The 2b brand mark — emerald with gold apex on dark grounds. */}
          <svg width={88} height={88} viewBox="0 0 32 32">
            <path d="M11 6L11 12L8 12L8 9Z" fill="#0F8F6F" />
            <path d="M21 6L21 12L24 12L24 9Z" fill="#0F8F6F" />
            <path d="M13 31L13 4L16 1L19 4L19 31Z" fill="#0F8F6F" />
            <path d="M13 6L13 4L16 1L19 4L19 6Z" fill="#C7A96B" />
          </svg>
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
