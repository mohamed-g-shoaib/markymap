import type { ExportPayload } from "@/lib/export/export-types"
import type { MarkmapJsonOptions } from "@/lib/markmap-options"

const MAX_EXPORT_MARKDOWN_LENGTH = 250_000

type ParseExportPayloadResult =
  | {
      ok: true
      value: ExportPayload
    }
  | {
      ok: false
      reason:
        | "empty-markdown"
        | "invalid-markdown"
        | "invalid-payload"
        | "markdown-too-large"
    }

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function parseJsonOptions(value: unknown): MarkmapJsonOptions | undefined {
  return isObjectRecord(value) ? (value as MarkmapJsonOptions) : undefined
}

export function parseExportPayload(value: unknown): ParseExportPayloadResult {
  if (!isObjectRecord(value)) {
    return {
      ok: false,
      reason: "invalid-payload",
    }
  }

  if (typeof value.markdown !== "string") {
    return {
      ok: false,
      reason: "invalid-markdown",
    }
  }

  if (!value.markdown.trim()) {
    return {
      ok: false,
      reason: "empty-markdown",
    }
  }

  if (value.markdown.length > MAX_EXPORT_MARKDOWN_LENGTH) {
    return {
      ok: false,
      reason: "markdown-too-large",
    }
  }

  return {
    ok: true,
    value: {
      markdown: value.markdown,
      jsonOptions: parseJsonOptions(value.jsonOptions),
    },
  }
}

export function getExportPayloadError(input: ParseExportPayloadResult) {
  if (input.ok) {
    return null
  }

  switch (input.reason) {
    case "empty-markdown":
      return {
        error: "Export failed: markdown is empty.",
        status: 400 as const,
      }
    case "invalid-markdown":
    case "invalid-payload":
      return {
        error: "Invalid export payload.",
        status: 400 as const,
      }
    case "markdown-too-large":
      return {
        error:
          "Export failed: markdown is too large for the current export limit.",
        status: 413 as const,
      }
  }
}
