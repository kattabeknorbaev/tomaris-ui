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
          {/* The woven khatam — on dark grounds: emerald square, gold diamond. */}
          <svg width={88} height={88} viewBox="0 0 32 32">
            <g fill="none" stroke="#0F8F6F" strokeWidth={2.6}>
              <path d="M24.6 22L24.6 24.6L14.88 24.6" />
              <path d="M10 24.6L7.4 24.6L7.4 14.88" />
              <path d="M7.4 10L7.4 7.4L17.12 7.4" />
              <path d="M22 7.4L24.6 7.4L24.6 17.12" />
            </g>
            <g fill="none" stroke="#C7A96B" strokeWidth={2.6}>
              <path d="M26.33 14.17L28.16 16L21.29 22.87" />
              <path d="M17.83 26.33L16 28.16L9.13 21.29" />
              <path d="M5.67 17.83L3.84 16L10.71 9.13" />
              <path d="M14.17 5.67L16 3.84L22.87 10.71" />
            </g>
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
