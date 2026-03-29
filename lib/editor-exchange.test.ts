import { describe, expect, it } from "vitest"

import {
  createEditorExchangeV1,
  parseEditorExchange,
} from "@/lib/editor-exchange"

describe("editor exchange", () => {
  it("serializes and parses v1 bundles", () => {
    const payload = createEditorExchangeV1({
      markdown: "# Hello",
      jsonOptions: { zoom: false, duration: 200 },
    })

    const parsed = parseEditorExchange(JSON.stringify(payload))

    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return

    expect(parsed.value.version).toBe(1)
    expect(parsed.value.markdown).toBe("# Hello")
    expect(parsed.value.jsonOptions.zoom).toBe(false)
    expect(parsed.value.jsonOptions.duration).toBe(200)
  })

  it("migrates legacy unversioned bundles", () => {
    const parsed = parseEditorExchange(
      JSON.stringify({ markdown: "# Legacy", jsonOptions: { pan: false } })
    )

    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return

    expect(parsed.migratedFromVersion).toBe(0)
    expect(parsed.value.version).toBe(1)
    expect(parsed.value.markdown).toBe("# Legacy")
    expect(parsed.value.jsonOptions.pan).toBe(false)
  })

  it("rejects unsupported bundle versions", () => {
    const parsed = parseEditorExchange(
      JSON.stringify({ version: 2, markdown: "# Unsupported" })
    )

    expect(parsed).toEqual({
      ok: false,
      reason: "unsupported-version",
      version: 2,
    })
  })

  it("rejects malformed JSON", () => {
    const parsed = parseEditorExchange("{broken")

    expect(parsed).toEqual({
      ok: false,
      reason: "invalid-json",
    })
  })
})
