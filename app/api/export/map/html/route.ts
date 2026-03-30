import {
  createDownloadResponse,
  createExportErrorResponse,
} from "@/lib/export/export-response"
import { parseExportPayload } from "@/lib/export/export-validation"
import { renderMapHtml } from "@/lib/export/render-map-html"
import { getExportPayloadError } from "@/lib/export/export-validation"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const payload = parseExportPayload(await request.json())

    if (!payload.ok) {
      const errorResponse = getExportPayloadError(payload)

      return createExportErrorResponse(errorResponse!)
    }

    const html = await renderMapHtml(payload.value)

    return createDownloadResponse({
      contentType: "text/html; charset=utf-8",
      data: html,
      filename: "markymap-map.html",
    })
  } catch (error) {
    return createExportErrorResponse({
      cause: error,
      error: "Failed to generate map HTML export.",
      status: 500,
    })
  }
}
