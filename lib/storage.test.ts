import { afterEach, describe, expect, it, vi } from "vitest"

import { loadEditorState, saveEditorState } from "@/lib/storage"

describe("storage", () => {
  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it("saves and loads markdown with json options", () => {
    const didSave = saveEditorState({
      markdown: "# Persisted",
      jsonOptions: { zoom: false, pan: false, spacingHorizontal: 120 },
    })

    expect(didSave).toBe(true)

    const state = loadEditorState()
    expect(state).toEqual({
      markdown: "# Persisted",
      jsonOptions: { zoom: false, pan: false, spacingHorizontal: 120 },
    })
  })

  it("falls back to legacy content key", () => {
    localStorage.setItem("markymap:content", "# Legacy markdown")

    const state = loadEditorState()
    expect(state).toEqual({
      markdown: "# Legacy markdown",
      jsonOptions: {},
    })
  })

  it("returns null when storage read fails", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage blocked")
    })

    const state = loadEditorState()
    expect(state).toBeNull()
  })

  it("returns false when storage write fails", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage blocked")
    })

    const didSave = saveEditorState({ markdown: "# No write", jsonOptions: {} })
    expect(didSave).toBe(false)
  })
})
