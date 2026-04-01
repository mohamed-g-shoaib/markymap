import { PageContainer } from "@/app/(marketing)/ui/page-container"

export function FooterSection() {
  return (
    <footer className="pt-1 pb-2 sm:pb-0">
      <PageContainer>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
          <a
            href="https://github.com/mohamed-g-shoaib/markymap"
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            Source Code
          </a>
          <a
            href="https://x.com/mo0hamed_gamal"
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            X
          </a>
          <a
            href="https://www.linkedin.com/in/mohamed-g-shoaib/"
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            LinkedIn
          </a>
        </div>
      </PageContainer>
    </footer>
  )
}
