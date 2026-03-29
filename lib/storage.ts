import type { MarkmapJsonOptions } from "@/lib/markmap-options"

const EDITOR_STATE_KEY = "markymap:editor-state"

type StoredEditorState = {
  version: 1
  markdown: string
  jsonOptions: MarkmapJsonOptions
}

const VIEW_PREF_KEY = "markymap:view-pref"

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

    return null
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
    return true
  } catch {
    // Ignore storage failures.
    return false
  }
}

export function getViewPreference(): "map" | "markdown" {
  try {
    if (typeof window === "undefined") return "map"
    const value = localStorage.getItem(VIEW_PREF_KEY)
    return value === "markdown" ? "markdown" : "map"
  } catch {
    return "map"
  }
}

export function saveViewPreference(view: "map" | "markdown") {
  try {
    if (typeof window === "undefined") return
    localStorage.setItem(VIEW_PREF_KEY, view)
  } catch {
    // Ignore storage failures.
  }
}
