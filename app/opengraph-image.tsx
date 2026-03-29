import { ImageResponse } from "next/og"

export const alt = "Markymap | Markdown to Mindmap"
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
          <path d="M10 5h4M10 19h4M16 12h4M4 12h4M14 5l-4 7M14 19l-4-7M4 12V5h6M4 12v7h6" />
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
        Markymap
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
        Write in markdown, switch between map and markdown preview instantly.
      </div>
    </div>,
    {
      ...size,
    }
  )
}
