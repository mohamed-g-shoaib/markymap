import * as React from "react"
import { render } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const {
  createMock,
  setDataMock,
  destroyMock,
  setOptionsMock,
  fitMock,
  rescaleMock,
} = vi.hoisted(() => ({
  createMock: vi.fn(),
  setDataMock: vi.fn(),
  destroyMock: vi.fn(),
  setOptionsMock: vi.fn(),
  fitMock: vi.fn().mockResolvedValue(undefined),
  rescaleMock: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("markmap-lib", () => {
  class Transformer {
    getUsedAssets() {
      return {}
    }

    transform() {
      return { root: { t: "heading", v: "root" }, features: {} }
    }
  }

  return { Transformer }
})

vi.mock("markmap-view", () => ({
  Markmap: {
    create: createMock,
  },
  deriveOptions: vi.fn((options) => options),
  loadCSS: vi.fn(),
  loadJS: vi.fn(),
}))

vi.mock("@/lib/markmap-transform", () => ({
  getMarkmapTransformSnapshot: vi.fn(
    (_transformer: unknown, markdown: string) => ({
      root: { t: "heading", v: markdown },
      features: {},
      frontmatterOptions: {},
    })
  ),
}))

vi.mock("@/components/editor/markdown-preview", () => ({
  MarkdownPreview: ({ markdown }: { markdown: string }) => (
    <div data-testid="markdown-preview">{markdown}</div>
  ),
}))

vi.mock("@/components/editor/markmap-controls-bar", () => ({
  MarkmapControlsBar: () => <div data-testid="controls" />,
}))

import { MarkmapCanvas } from "@/components/editor/markmap-canvas"

beforeEach(() => {
  setDataMock.mockClear()
  destroyMock.mockClear()
  setOptionsMock.mockClear()
  fitMock.mockClear()
  rescaleMock.mockClear()

  createMock.mockImplementation(() => ({
    setData: setDataMock,
    destroy: destroyMock,
    setOptions: setOptionsMock,
    fit: fitMock,
    rescale: rescaleMock,
    options: {},
    zoom: {
      filter: vi.fn(),
    },
    svg: {
      call: vi.fn(),
      on: vi.fn(),
    },
  }))
})

describe("MarkmapCanvas lifecycle", () => {
  it("creates once, updates data on markdown changes, and destroys on unmount", () => {
    const { rerender, unmount } = render(
      <MarkmapCanvas
        markdown="# One"
        jsonOptions={{ zoom: true, pan: true }}
        onJsonOptionsChange={vi.fn()}
      />
    )

    expect(createMock).toHaveBeenCalledTimes(1)

    rerender(
      <MarkmapCanvas
        markdown="# Two"
        jsonOptions={{ zoom: true, pan: true }}
        onJsonOptionsChange={vi.fn()}
      />
    )

    expect(setDataMock).toHaveBeenCalled()

    unmount()

    expect(destroyMock).toHaveBeenCalledTimes(1)
  })
})
