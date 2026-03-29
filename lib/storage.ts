import type { MarkmapJsonOptions } from "@/lib/markmap-options"

const CONTENT_KEY = "markymap:content"
const EDITOR_STATE_KEY = "markymap:editor-state"

type StoredEditorState = {
  version: 1
  markdown: string
  jsonOptions: MarkmapJsonOptions
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

export function loadEditorState() {
  try {
    const rawState = localStorage.getItem(EDITOR_STATE_KEY)
    if (rawState) {
      const parsed = JSON.parse(rawState) as unknown

      if (isObjectRecord(parsed) && typeof parsed.markdown === "string") {
        return {
          markdown: parsed.markdown,
          jsonOptions: isObjectRecord(parsed.jsonOptions)
            ? (parsed.jsonOptions as MarkmapJsonOptions)
            : {},
        }
      }
    }

    const legacyMarkdown = localStorage.getItem(CONTENT_KEY)
    if (legacyMarkdown === null) {
      return null
    }

    return {
      markdown: legacyMarkdown,
      jsonOptions: {},
    }
  } catch {
    return null
  }
}

export function saveEditorState(state: {
  markdown: string
  jsonOptions: MarkmapJsonOptions
}) {
  try {
    const serialized: StoredEditorState = {
      version: 1,
      markdown: state.markdown,
      jsonOptions: state.jsonOptions,
    }

    localStorage.setItem(EDITOR_STATE_KEY, JSON.stringify(serialized))
    localStorage.setItem(CONTENT_KEY, state.markdown)
    return true
  } catch {
    // Ignore storage failures.
    return false
  }
}
