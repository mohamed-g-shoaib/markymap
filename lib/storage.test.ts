import { afterEach, describe, expect, it, vi } from "vitest"
import {
  getViewPreference,
  loadEditorState,
  saveEditorState,
  saveViewPreference,
} from "@/lib/storage"

describe("storage content", () => {
  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it("saves and loads markdown with json options", () => {
    const didSave = saveEditorState({
      foldState: {
        "root/a:0": 1,
      },
      markdown: "# Persisted",
      jsonOptions: { zoom: false, pan: false, spacingHorizontal: 120 },
    })

    expect(didSave).toBe(true)

    const state = loadEditorState()
    expect(state).toEqual({
      foldState: {
        "root/a:0": 1,
      },
      markdown: "# Persisted",
      jsonOptions: { zoom: false, pan: false, spacingHorizontal: 120 },
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

    const didSave = saveEditorState({
      markdown: "# No write",
      jsonOptions: {},
    })
    expect(didSave).toBe(false)
  })

  it("defaults fold state when loading older or invalid payloads", () => {
    localStorage.setItem(
      "markymap:editor-state",
      JSON.stringify({
        version: 1,
        foldState: {
          "root/a:0": 2,
        },
        markdown: "# Legacy",
        jsonOptions: {},
      })
    )

    expect(loadEditorState()).toEqual({
      foldState: {},
      markdown: "# Legacy",
      jsonOptions: {},
    })
  })
})

describe("storage preferences", () => {
  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it("saves and loads view preference", () => {
    saveViewPreference("markdown")
    expect(getViewPreference()).toBe("markdown")

    saveViewPreference("map")
    expect(getViewPreference()).toBe("map")
  })

  it("returns default map when preference is missing or invalid", () => {
    localStorage.setItem("markymap:view-pref", "invalid")
    expect(getViewPreference()).toBe("map")

    localStorage.removeItem("markymap:view-pref")
    expect(getViewPreference()).toBe("map")
  })
})
