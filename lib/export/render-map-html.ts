import { readFile, readdir } from "node:fs/promises"
import { join } from "node:path"

import { Transformer } from "markmap-lib"
import { fillTemplate } from "markmap-render"

import {
  DEFAULT_MARKMAP_JSON_OPTIONS,
  type MarkmapJsonOptions,
} from "@/lib/markmap-options"
import { getMarkmapTransformSnapshot } from "@/lib/markmap-transform"

const transformer = new Transformer()

type InlineScriptItem = {
  type: "script"
  data: {
    textContent: string
  }
}

let inlineBaseScriptsPromise: Promise<InlineScriptItem[]> | null = null

function getExportMapOptions(
  jsonOptions: MarkmapJsonOptions,
  frontmatterOptions: MarkmapJsonOptions
) {
  return {
    ...DEFAULT_MARKMAP_JSON_OPTIONS,
    ...jsonOptions,
    ...frontmatterOptions,
  }
}

async function getInlineBaseScripts() {
  if (!inlineBaseScriptsPromise) {
    inlineBaseScriptsPromise = Promise.all([
      getD3BrowserSource(),
      getMarkmapViewBrowserSource(),
    ]).then(([d3Source, markmapViewSource]) => {
      return [
        {
          type: "script",
          data: {
            textContent: d3Source,
          },
        },
        {
          type: "script",
          data: {
            textContent: markmapViewSource,
          },
        },
      ] satisfies InlineScriptItem[]
    })
  }

  return inlineBaseScriptsPromise
}

async function getD3BrowserSource() {
  const d3BrowserPath = await findPnpmPackageAssetPath({
    directoryPrefix: "d3@",
    relativeAssetPath: ["node_modules", "d3", "dist", "d3.min.js"],
    missingMessage: "Unable to locate the installed d3 browser bundle.",
  })

  return readFile(d3BrowserPath, "utf8")
}

async function getMarkmapViewBrowserSource() {
  const markmapViewBrowserPath = await findPnpmPackageAssetPath({
    directoryPrefix: "markmap-view@",
    relativeAssetPath: [
      "node_modules",
      "markmap-view",
      "dist",
      "browser",
      "index.js",
    ],
    missingMessage:
      "Unable to locate the installed markmap-view browser bundle.",
  })

  return readFile(markmapViewBrowserPath, "utf8")
}

async function findPnpmPackageAssetPath(input: {
  directoryPrefix: string
  missingMessage: string
  relativeAssetPath: string[]
}) {
  const pnpmDirectory = join(process.cwd(), "node_modules", ".pnpm")
  const entries = await readdir(pnpmDirectory, { withFileTypes: true })
  const packageEntry = entries.find((entry) => {
    return entry.isDirectory() && entry.name.startsWith(input.directoryPrefix)
  })

  if (!packageEntry) {
    throw new Error(input.missingMessage)
  }

  return join(pnpmDirectory, packageEntry.name, ...input.relativeAssetPath)
}

export async function renderMapHtml(input: {
  inlineBaseAssets?: boolean
  jsonOptions?: MarkmapJsonOptions
  markdown: string
}) {
  const snapshot = getMarkmapTransformSnapshot(transformer, input.markdown)
  const assets = transformer.getUsedAssets(snapshot.features)
  const baseJs = input.inlineBaseAssets
    ? await getInlineBaseScripts()
    : undefined
  const html = fillTemplate(snapshot.root, assets, {
    baseJs,
    jsonOptions: getExportMapOptions(
      input.jsonOptions ?? {},
      snapshot.frontmatterOptions
    ),
  })

  return html.replace(
    "<title>Markmap</title>",
    "<title>Markymap Export</title>"
  )
}
