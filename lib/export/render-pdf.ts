import { execFile } from "node:child_process"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { pathToFileURL } from "node:url"
import { promisify } from "node:util"
import chromium from "@sparticuz/chromium"
import puppeteer from "puppeteer-core"
import type { Page } from "puppeteer-core"

type RenderPdfInput = {
  html: string
}

const PDF_RENDER_TIMEOUT_MS = 20_000
const PDF_BROWSER_STABILITY_ARGS = [
  "--disable-dev-shm-usage",
  "--disable-gpu",
  "--no-sandbox",
  "--disable-setuid-sandbox",
]
const execFileAsync = promisify(execFile)

function getWindowsBrowserCandidates() {
  const localAppData = process.env.LOCALAPPDATA
  const programFiles = process.env.ProgramFiles
  const programFilesX86 = process.env["ProgramFiles(x86)"]

  return [
    localAppData
      ? `${localAppData}\\Google\\Chrome\\Application\\chrome.exe`
      : null,
    programFiles
      ? `${programFiles}\\Google\\Chrome\\Application\\chrome.exe`
      : null,
    programFilesX86
      ? `${programFilesX86}\\Google\\Chrome\\Application\\chrome.exe`
      : null,
    localAppData
      ? `${localAppData}\\Microsoft\\Edge\\Application\\msedge.exe`
      : null,
    programFiles
      ? `${programFiles}\\Microsoft\\Edge\\Application\\msedge.exe`
      : null,
    programFilesX86
      ? `${programFilesX86}\\Microsoft\\Edge\\Application\\msedge.exe`
      : null,
  ].filter((value): value is string => Boolean(value))
}

function getMacOsBrowserCandidates() {
  return [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ]
}

function getLinuxBrowserCandidates() {
  return [
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/snap/bin/chromium",
  ]
}

function findLocalBrowserExecutable() {
  const candidates =
    process.platform === "win32"
      ? getWindowsBrowserCandidates()
      : process.platform === "darwin"
        ? getMacOsBrowserCandidates()
        : getLinuxBrowserCandidates()

  return candidates.find((candidate) => existsSync(candidate))
}

function injectPrintStyles(html: string) {
  const printStyles =
    "<style>@page { size: A4 portrait; margin: 12mm; }</style>"

  return html.includes("</head>")
    ? html.replace("</head>", `${printStyles}</head>`)
    : `${printStyles}${html}`
}

async function renderPdfWithLocalBrowser(input: {
  executablePath: string
  html: string
}) {
  const tempDir = await mkdtemp(join(tmpdir(), "markymap-export-"))
  const htmlPath = join(tempDir, "export.html")
  const pdfPath = join(tempDir, "export.pdf")

  try {
    await writeFile(htmlPath, injectPrintStyles(input.html), "utf8")

    await withTimeout(
      execFileAsync(input.executablePath, [
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--allow-file-access-from-files",
        "--no-pdf-header-footer",
        "--print-to-pdf=" + pdfPath,
        "--virtual-time-budget=12000",
        pathToFileURL(htmlPath).toString(),
      ]),
      "generating PDF"
    )

    return new Uint8Array(await readFile(pdfPath))
  } finally {
    await rm(tempDir, {
      force: true,
      recursive: true,
    })
  }
}

async function launchBrowser(input: {
  executablePath: string
  isLocalBrowser: boolean
}) {
  chromium.setGraphicsMode = false

  const headlessMode = input.isLocalBrowser ? true : "shell"
  const args = input.isLocalBrowser
    ? [...puppeteer.defaultArgs(), ...PDF_BROWSER_STABILITY_ARGS]
    : puppeteer.defaultArgs({
        args: [...chromium.args, ...PDF_BROWSER_STABILITY_ARGS],
        headless: headlessMode,
      })

  return puppeteer.launch({
    args,
    executablePath: input.executablePath,
    headless: headlessMode,
    defaultViewport: {
      width: 1600,
      height: 1200,
      deviceScaleFactor: 1,
      hasTouch: false,
      isLandscape: true,
      isMobile: false,
    },
  })
}

function withTimeout<T>(promise: Promise<T>, label: string) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timed out while ${label}.`))
    }, PDF_RENDER_TIMEOUT_MS)

    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error: unknown) => {
        clearTimeout(timer)
        reject(error)
      }
    )
  })
}

async function waitForImagesReady(page: Page) {
  await page.waitForFunction(
    () => {
      const images = Array.from(document.images)

      return images.every((image) => image.complete && image.naturalWidth > 0)
    },
    {
      timeout: PDF_RENDER_TIMEOUT_MS,
    }
  )
}

async function renderPdfWithBrowser(input: {
  executablePath: string
  html: string
  isLocalBrowser: boolean
}) {
  const browser = await launchBrowser({
    executablePath: input.executablePath,
    isLocalBrowser: input.isLocalBrowser,
  })

  try {
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(PDF_RENDER_TIMEOUT_MS)
    page.setDefaultTimeout(PDF_RENDER_TIMEOUT_MS)

    await page.emulateMediaType("screen")
    await withTimeout(
      page.setContent(input.html, {
        waitUntil: "networkidle0",
      }),
      "loading export HTML"
    )
    await waitForImagesReady(page)

    return withTimeout(
      page.pdf({
        format: "A4",
        landscape: false,
        margin: {
          top: "12mm",
          right: "12mm",
          bottom: "12mm",
          left: "12mm",
        },
        preferCSSPageSize: false,
        printBackground: true,
      }),
      "generating PDF"
    )
  } finally {
    await browser.close()
  }
}

export async function renderPdf({ html }: RenderPdfInput) {
  const localBrowserExecutable =
    process.env.CHROME_EXECUTABLE_PATH || findLocalBrowserExecutable()

  if (localBrowserExecutable) {
    return renderPdfWithLocalBrowser({
      executablePath: localBrowserExecutable,
      html,
    })
  }

  return renderPdfWithBrowser({
    executablePath: await chromium.executablePath(),
    html,
    isLocalBrowser: false,
  })
}
