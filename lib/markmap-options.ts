import type { IMarkmapJSONOptions } from "markmap-view"

export type MarkmapJsonOptions = Partial<IMarkmapJSONOptions>

export const DEFAULT_MARKMAP_JSON_OPTIONS: MarkmapJsonOptions = {
  duration: 300,
  initialExpandLevel: -1,
  spacingHorizontal: 80,
  spacingVertical: 5,
  zoom: true,
  pan: true,
}
