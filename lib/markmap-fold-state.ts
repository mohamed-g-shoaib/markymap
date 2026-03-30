type PersistableFoldValue = 0 | 1

type MarkmapFoldPayload = {
  fold?: number
  [key: string]: unknown
}

export type PersistableMarkmapNode = {
  children?: PersistableMarkmapNode[]
  content: string
  payload?: MarkmapFoldPayload
}

export type MarkmapFoldState = Record<string, PersistableFoldValue>

function getContentHash(content: string) {
  let hash = 2166136261

  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return (hash >>> 0).toString(36)
}

function walkNodeChildren(
  nodes: PersistableMarkmapNode[],
  parentPath: string,
  visit: (node: PersistableMarkmapNode, path: string) => void
) {
  const contentOccurrences = new Map<string, number>()

  nodes.forEach((node) => {
    const contentHash = getContentHash(node.content)
    const occurrence = contentOccurrences.get(contentHash) ?? 0
    const path = `${parentPath}/${contentHash}:${occurrence}`

    contentOccurrences.set(contentHash, occurrence + 1)
    visit(node, path)

    if (node.children?.length) {
      walkNodeChildren(node.children, path, visit)
    }
  })
}

export function applyMarkmapFoldState(
  root: PersistableMarkmapNode,
  foldState: MarkmapFoldState
) {
  if (!root.children?.length) {
    return root
  }

  walkNodeChildren(root.children, "root", (node, path) => {
    const nextFoldValue = foldState[path]

    if (typeof nextFoldValue === "undefined") {
      return
    }

    node.payload = {
      ...node.payload,
      fold: nextFoldValue,
    }
  })

  return root
}

export function captureMarkmapFoldState(root: PersistableMarkmapNode | null) {
  const foldState: MarkmapFoldState = {}

  if (!root?.children?.length) {
    return foldState
  }

  walkNodeChildren(root.children, "root", (node, path) => {
    if (!node.children?.length) {
      return
    }

    foldState[path] = node.payload?.fold ? 1 : 0
  })

  return foldState
}

export function isMarkmapFoldState(value: unknown): value is MarkmapFoldState {
  if (!value || typeof value !== "object") {
    return false
  }

  return Object.values(value).every((entry) => entry === 0 || entry === 1)
}
