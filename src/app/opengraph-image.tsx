import { ImageResponse } from "next/og"

export const alt = "Corentin Basson - Portfolio Créatif"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0d1b38 0%, #1a2f5a 60%, #0d1b38 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "64px",
          position: "relative",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #c45880, #f4acc6, #c45880)",
          }}
        />

        {/* Category label */}
        <div
          style={{
            color: "#c45880",
            fontSize: "18px",
            fontWeight: 600,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: "20px",
            display: "flex",
          }}
        >
          PORTFOLIO CRÉATIF
        </div>

        {/* Main name */}
        <div
          style={{
            color: "#ffffff",
            fontSize: "86px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            textAlign: "center",
            display: "flex",
          }}
        >
          CORENTIN BASSON
        </div>

        {/* Tagline */}
        <div
          style={{
            color: "#94a3b8",
            fontSize: "26px",
            marginTop: "28px",
            textAlign: "center",
            display: "flex",
          }}
        >
          Design graphique · Identité visuelle · Photographie
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            color: "#c45880",
            fontSize: "18px",
            fontWeight: 500,
            letterSpacing: "0.05em",
            display: "flex",
          }}
        >
          cbsn-pics.com
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #c45880, #f4acc6, #c45880)",
          }}
        />
      </div>
    ),
    { ...size }
  )
}
