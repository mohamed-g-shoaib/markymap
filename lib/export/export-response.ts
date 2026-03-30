type ErrorResponseStatus = 400 | 413 | 500

function getErrorDetails(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === "string") {
    return error
  }

  return "Unknown export error."
}

export function createDownloadResponse(input: {
  contentType: string
  data: BodyInit
  filename: string
}) {
  return new Response(input.data, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Disposition": `attachment; filename="${input.filename}"`,
      "Content-Type": input.contentType,
    },
  })
}

export function createExportErrorResponse(input: {
  cause?: unknown
  error: string
  status: ErrorResponseStatus
}) {
  const payload =
    process.env.NODE_ENV === "development" && input.cause
      ? {
          error: input.error,
          details: getErrorDetails(input.cause),
        }
      : { error: input.error }

  return Response.json(payload, {
    status: input.status,
    headers: {
      "Cache-Control": "no-store",
    },
  })
}
