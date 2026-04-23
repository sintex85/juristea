import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Juristea — Gestión inteligente para despachos de abogados"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#eef2ff",
            border: "1px solid #c7d2fe",
            borderRadius: "100px",
            padding: "8px 16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#6366f1",
            }}
          />
          <span style={{ fontSize: "16px", color: "#4338ca", fontWeight: 600 }}>
            Plazos, notificaciones y expedientes bajo control
          </span>
        </div>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #6366f1, #818cf8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontSize: "26px" }}>J</span>
          </div>
          <span style={{ fontSize: "32px", fontWeight: 700, color: "#111" }}>
            Juristea
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 800,
            color: "#111",
            lineHeight: 1.1,
            maxWidth: "860px",
            letterSpacing: "-2px",
          }}
        >
          Gestión inteligente para{" "}
          <span style={{ color: "#6366f1" }}>despachos de abogados</span>
        </div>

        {/* Subline */}
        <div
          style={{
            fontSize: "24px",
            color: "#6b7280",
            marginTop: "24px",
            maxWidth: "700px",
            lineHeight: 1.5,
          }}
        >
          Expedientes, plazos procesales, notificaciones LexNET y control de tiempo. Todo en un solo lugar.
        </div>

        {/* Price pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginTop: "48px",
          }}
        >
          <div
            style={{
              background: "#6366f1",
              borderRadius: "12px",
              padding: "14px 28px",
              color: "white",
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            Empieza gratis
          </div>
          <span style={{ fontSize: "20px", color: "#9ca3af" }}>
            Desde 29€/mes
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
