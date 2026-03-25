const CONTENT_KEY = "markymap:content"

export function loadContent() {
  try {
    return localStorage.getItem(CONTENT_KEY)
  } catch {
    return null
  }
}

export function saveContent(markdown: string) {
  try {
    localStorage.setItem(CONTENT_KEY, markdown)
    return true
  } catch {
    // Ignore storage failures.
    return false
  }
}
