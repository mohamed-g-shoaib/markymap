import { type ITransformResult, Transformer } from "markmap-lib"

import type { MarkmapJsonOptions } from "@/lib/markmap-options"

type MarkmapFrontmatter = {
  htmlParser?: unknown
} & MarkmapJsonOptions

export type MarkmapTransformSnapshot = {
  features: ITransformResult["features"]
  frontmatterOptions: MarkmapJsonOptions
  root: ITransformResult["root"]
}

export function getMarkmapTransformSnapshot(
  transformer: Transformer,
  markdown: string
): MarkmapTransformSnapshot {
  const transformResult = transformer.transform(markdown)
  const frontmatterMarkmap =
    (transformResult.frontmatter?.markmap as MarkmapFrontmatter | undefined) ??
    {}
  const { htmlParser: _ignoredHtmlParser, ...viewOptions } = frontmatterMarkmap

  return {
    root: transformResult.root,
    features: transformResult.features,
    frontmatterOptions: viewOptions,
  }
}
