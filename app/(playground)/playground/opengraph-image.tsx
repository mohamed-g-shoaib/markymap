import { ImageResponse } from "next/og"

export const alt = "Markymap Playground"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#161616",
        color: "#ffffff",
        padding: 48,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
        }}
      >
        <svg
          width="84"
          height="84"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ed5f00"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      </div>
      <div
        style={{
          fontSize: 84,
          fontFamily: "sans-serif",
          fontWeight: 700,
          letterSpacing: "-0.04em",
          marginBottom: 16,
        }}
      >
        Markymap Editor
      </div>
      <div
        style={{
          fontSize: 40,
          fontFamily: "sans-serif",
          fontWeight: "normal",
          opacity: 0.8,
          color: "#cbd5e1",
          textAlign: "center",
          maxWidth: "800px",
        }}
      >
        Interactive playground. Write and visualize. Auto-saves locally.
      </div>
    </div>,
    {
      ...size,
    }
  )
}
