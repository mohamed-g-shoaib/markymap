import type { MarkmapJsonOptions } from "@/lib/markmap-options"

const EDITOR_EXCHANGE_VERSION = 1

type EditorExchangeV1 = {
  version: 1
  markdown: string
  jsonOptions: MarkmapJsonOptions
}

type ParseEditorExchangeErrorReason =
  | "invalid-json"
  | "invalid-format"
  | "unsupported-version"

type ParseEditorExchangeResult =
  | {
      ok: true
      value: EditorExchangeV1
      migratedFromVersion?: 0
    }
  | {
      ok: false
      reason: ParseEditorExchangeErrorReason
      version?: number
    }

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function parseJsonOptions(value: unknown) {
  return isObjectRecord(value) ? (value as MarkmapJsonOptions) : {}
}

function parseV1Exchange(
  value: Record<string, unknown>
): ParseEditorExchangeResult {
  if (typeof value.markdown !== "string") {
    return { ok: false, reason: "invalid-format" }
  }

  return {
    ok: true,
    value: {
      version: 1,
      markdown: value.markdown,
      jsonOptions: parseJsonOptions(value.jsonOptions),
    },
  }
}

function parseLegacyUnversionedExchange(
  value: Record<string, unknown>
): ParseEditorExchangeResult {
  if (typeof value.markdown !== "string") {
    return { ok: false, reason: "invalid-format" }
  }

  return {
    ok: true,
    migratedFromVersion: 0,
    value: {
      version: 1,
      markdown: value.markdown,
      jsonOptions: parseJsonOptions(value.jsonOptions),
    },
  }
}

export function parseEditorExchange(text: string): ParseEditorExchangeResult {
  try {
    const parsed = JSON.parse(text) as unknown

    if (!isObjectRecord(parsed)) {
      return { ok: false, reason: "invalid-format" }
    }

    const version = parsed.version
    if (typeof version === "number") {
      if (version === EDITOR_EXCHANGE_VERSION) {
        return parseV1Exchange(parsed)
      }

      return {
        ok: false,
        reason: "unsupported-version",
        version,
      }
    }

    // Legacy bundle support: before versioning, bundles contained markdown/jsonOptions only.
    return parseLegacyUnversionedExchange(parsed)
  } catch {
    return { ok: false, reason: "invalid-json" }
  }
}

export function createEditorExchangeV1(state: {
  markdown: string
  jsonOptions: MarkmapJsonOptions
}): EditorExchangeV1 {
  return {
    version: EDITOR_EXCHANGE_VERSION,
    markdown: state.markdown,
    jsonOptions: state.jsonOptions,
  }
}
