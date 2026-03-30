import {
  createDownloadResponse,
  createExportErrorResponse,
} from "@/lib/export/export-response"
import { parseExportPayload } from "@/lib/export/export-validation"
import { getExportPayloadError } from "@/lib/export/export-validation"
import { renderMarkdownHtml } from "@/lib/export/render-markdown-html"
import { renderPdf } from "@/lib/export/render-pdf"

export const runtime = "nodejs"

function toArrayBuffer(view: Uint8Array<ArrayBufferLike>) {
  return Uint8Array.from(view).buffer
}

export async function POST(request: Request) {
  try {
    const payload = parseExportPayload(await request.json())

    if (!payload.ok) {
      const errorResponse = getExportPayloadError(payload)

      return createExportErrorResponse(errorResponse!)
    }

    const html = await renderMarkdownHtml(payload.value)
    const pdf = await renderPdf({
      html,
    })

    return createDownloadResponse({
      contentType: "application/pdf",
      data: toArrayBuffer(pdf),
      filename: "markymap-markdown.pdf",
    })
  } catch (error) {
    return createExportErrorResponse({
      cause: error,
      error: "Failed to generate markdown PDF export.",
      status: 500,
    })
  }
}
