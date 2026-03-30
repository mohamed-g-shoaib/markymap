import { describe, expect, it } from "vitest"

import {
  applyMarkmapFoldState,
  captureMarkmapFoldState,
  type PersistableMarkmapNode,
} from "@/lib/markmap-fold-state"

describe("markmap fold state", () => {
  it("captures and reapplies fold state for foldable nodes", () => {
    const root: PersistableMarkmapNode = {
      content: "root",
      children: [
        {
          content: "Alpha",
          payload: { fold: 1 },
          children: [
            {
              content: "Leaf",
              children: [],
            },
          ],
        },
        {
          content: "Beta",
          payload: { fold: 0 },
          children: [
            {
              content: "Nested",
              payload: { fold: 1 },
              children: [
                {
                  content: "Deep leaf",
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    }

    const foldState = captureMarkmapFoldState(root)

    expect(Object.values(foldState).sort()).toEqual([0, 1, 1])

    const freshRoot: PersistableMarkmapNode = {
      content: "root",
      children: [
        {
          content: "Alpha",
          children: [
            {
              content: "Leaf",
              children: [],
            },
          ],
        },
        {
          content: "Beta",
          children: [
            {
              content: "Nested",
              children: [
                {
                  content: "Deep leaf",
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    }

    applyMarkmapFoldState(freshRoot, foldState)

    expect(freshRoot.children?.[0]?.payload?.fold).toBe(1)
    expect(freshRoot.children?.[1]?.payload?.fold).toBe(0)
    expect(freshRoot.children?.[1]?.children?.[0]?.payload?.fold).toBe(1)
  })

  it("distinguishes duplicate sibling labels by occurrence", () => {
    const root: PersistableMarkmapNode = {
      content: "root",
      children: [
        {
          content: "Task",
          payload: { fold: 1 },
          children: [{ content: "A", children: [] }],
        },
        {
          content: "Task",
          payload: { fold: 0 },
          children: [{ content: "B", children: [] }],
        },
      ],
    }

    const foldState = captureMarkmapFoldState(root)

    expect(Object.values(foldState)).toEqual([1, 0])
  })
})
