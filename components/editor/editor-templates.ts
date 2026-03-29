import type { MarkmapJsonOptions } from "@/lib/markmap-options"

export const DEFAULT_MARKDOWN = `# Markymap Playground

## First branch

- Edit this markdown
- Watch the map update
- Export/import coming next`

export const FRONTMATTER_TEMPLATE = `---
title: Q2 Product Plan
markmap:
  colorFreezeLevel: 2
  color: "#2980b9"
  maxWidth: 300
  initialExpandLevel: 1
  htmlParser:
    selector: h1,h2,h3,ul,ol,li,table,pre
  activeNode:
    placement: center
---

# Q2 Product Plan

## Goals

- Improve onboarding conversion
- Reduce support response time

## Delivery Streams

### Product

- New onboarding flow
- Usage analytics panel

### Operations

- SLA dashboard
- Escalation runbook
`

export const MAGIC_COMMENTS_TEMPLATE = `# Weekly Team Agenda

## Monday Standup <!-- markmap: fold -->

- Blockers
- Priorities
- Owner updates

## Backlog Parking Lot <!-- markmap: foldAll -->

- Future experiments
- Nice-to-have requests
`

export const STARTER_TEMPLATE = `# Project Kickoff Plan

## Objectives

- Align scope and delivery dates.
- Clarify owners for each workstream.

## Timeline

### Week 1 - Discovery

- Interview 5 users
- Finalize must-have features

### Week 2-3 - Build

- Implement onboarding flow
- Add analytics + QA pass

### Week 4 - Launch <!-- markmap: fold -->

- Prepare release notes
- Roll out to 20% of users
- Monitor activation + error rate

## Team Checklist <!-- markmap: fold -->

- [x] Scope approved
- [ ] QA complete
- [ ] Go-live signoff
- Key command: \`pnpm typecheck\`
- Docs: [Launch checklist](https://markmap.js.org)
`

export type SaveState = "idle" | "saving" | "saved" | "error"

export type EditorState = {
  markdown: string
  jsonOptions: MarkmapJsonOptions
}

export type SnippetKind = "frontmatter" | "magic-comments" | "starter"
