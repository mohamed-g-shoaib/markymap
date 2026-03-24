# Agent Skills

> This document is the authoritative reference for all `.agents` skills installed in this project. Use it to decide which skill to load before generating, reviewing, or refactoring code.

Skills in this repository live under `.agents/skills/`. Depending on the skill publisher, each skill directory may contain some or all of the following:

| File / Folder      | Purpose                                                                      |
| ------------------ | ---------------------------------------------------------------------------- |
| `SKILL.md`         | Lightweight entry point describing when to apply the skill and how to use it |
| `AGENTS.md`        | Fully expanded version of the rules for deeper context                       |
| `README.md`        | Human-facing documentation about structure and contribution                  |
| `rules/`           | Individual rule files, typically one rule per file                           |
| `references/`      | Topic-specific reference documents loaded as needed                          |
| `evals/`           | Evaluation fixtures or validation assets used by the skill                   |
| `*.md` topic files | Standalone topic guides linked directly from `SKILL.md`                      |

---

## Skills Index

| #   | Skill                                                         | Publisher      | Version / Notes                              | Path                                          |
| --- | ------------------------------------------------------------- | -------------- | -------------------------------------------- | --------------------------------------------- |
| 1   | [Vercel React Best Practices](#1-vercel-react-best-practices) | Vercel         | `v1.0.0`                                     | `.agents/skills/vercel-react-best-practices/` |
| 2   | [Next.js Best Practices](#2-nextjs-best-practices)            | Project-local  | Topic index skill                            | `.agents/skills/next-best-practices/`         |
| 3   | [React Composition Patterns](#3-react-composition-patterns)   | Vercel         | `v1.0.0`                                     | `.agents/skills/vercel-composition-patterns/` |
| 4   | [Design Engineering](#4-design-engineering)                   | Project-local  | Single-file skill                            | `.agents/skills/emil-design-eng/`             |
| 5   | [React useEffect](#5-react-useeffect)                         | Project-local  | Official-docs-inspired guidance              | `.agents/skills/react-useeffect/`             |
| 6   | [SEO Audit](#6-seo-audit)                                     | Project-local  | `v1.1.0`                                     | `.agents/skills/seo-audit/`                   |
| 7   | [Make Interfaces Feel Better](#7-make-interfaces-feel-better) | Project-local  | UI polish skill with focused reference files | `.agents/skills/make-interfaces-feel-better/` |
| 8   | [User Interface Wiki](#8-user-interface-wiki)                 | Raphael Salaja | `v3.0.0`                                     | `.agents/skills/userinterface-wiki/`          |
| 9   | [Tailwind CSS Patterns](#9-tailwind-css-patterns)             | Project-local  | Utility-first styling guide                  | `.agents/skills/tailwind-css-patterns/`       |
| 10  | [Tailwind Design System](#10-tailwind-design-system)          | Project-local  | Tailwind v4 design-system skill              | `.agents/skills/tailwind-design-system/`      |
| 11  | [TypeScript Advanced Types](#11-typescript-advanced-types)    | Project-local  | Single-file advanced type-system guide       | `.agents/skills/typescript-advanced-types/`   || 12  | [coss ui](#12-coss-ui)                                       | cosscom        | Components based on Base UI                  | `.agents/skills/coss/`                        |
| 13  | [Fixing Motion Performance](#13-fixing-motion-performance)   | Project-local  | Audit and fix animation jank                 | `.agents/skills/fixing-motion-performance/`   |
| 14  | [Tailwind Advanced Layouts](#14-tailwind-advanced-layouts)   | Project-local  | Grid and Flexbox mastery                     | `.agents/skills/tailwindcss-advanced-layouts/` |
---

## 1. Vercel React Best Practices

**Publisher:** Vercel  
**Version:** `1.0.0`  
**When to load:** Writing, reviewing, or refactoring React and Next.js code where performance matters: data fetching, bundle size, rendering, server/client boundaries, or re-render behavior

### Purpose

Performance optimization guidance for React and Next.js applications. This skill contains 58 rules across 8 priority-ranked categories, starting with async waterfall elimination and bundle size optimization, then moving through server performance, client fetching, re-render reduction, rendering behavior, JavaScript performance, and advanced patterns.

### Top 10 Rules by Priority

1. **`async-defer-await`** - Move `await` into the branch where the result is actually needed
2. **`async-parallel`** - Use `Promise.all()` for independent async work
3. **`async-suspense-boundaries`** - Use `<Suspense>` to stream slow subtrees progressively
4. **`bundle-barrel-imports`** - Import directly from source files instead of barrel files
5. **`bundle-dynamic-imports`** - Use `next/dynamic` for heavy components and defer their JS cost
6. **`server-cache-react`** - Use `React.cache()` for per-request deduplication in Server Components
7. **`server-parallel-fetching`** - Restructure component trees so server fetches start in parallel
8. **`rerender-memo`** - Extract expensive work into memoized components instead of recomputing inline
9. **`rerender-derived-state-no-effect`** - Derive state during render rather than syncing it with effects
10. **`rerender-functional-setstate`** - Use functional `setState` whenever the next value depends on previous state

### Available Files

| File        | Description                                                       |
| ----------- | ----------------------------------------------------------------- |
| `SKILL.md`  | Entry point with category table, quick reference, and usage notes |
| `AGENTS.md` | Fully compiled guide for all 58 rules                             |
| `README.md` | Contribution guide and rule structure                             |
| `rules/`    | 58 individual rule files with explanations and examples           |

---

## 2. Next.js Best Practices

**Publisher:** Project-local  
**Version / Notes:** Topic-index skill with 19 linked reference files  
**When to load:** Writing or reviewing Next.js App Router code involving route structure, RSC boundaries, async APIs, runtime selection, metadata, route handlers, bundling, hydration, Suspense, or deployment

### Purpose

Topic-based guidance for modern Next.js applications. `SKILL.md` points to focused topic files covering file conventions, async APIs, directives, runtime choice, error handling, data patterns, route handlers, metadata, optimization primitives, hydration, Suspense, advanced routing, self-hosting, and debugging.

### Top 10 Rules by Priority

1. **File conventions first** - Use the correct App Router file and folder conventions, including modern route segment patterns
2. **Respect RSC boundaries** - Never build invalid Server/Client Component combinations or pass non-serializable props across the boundary
3. **Await async request APIs** - In Next.js 15+, treat `params`, `searchParams`, `cookies()`, and `headers()` as async
4. **Choose runtime intentionally** - Default to Node.js runtime unless Edge is clearly justified
5. **Use directives correctly** - Push `'use client'` as deep as possible and apply `'use cache'` where appropriate
6. **Use the right primitive for data work** - Distinguish between Server Components, Server Actions, and Route Handlers
7. **Handle routing errors explicitly** - Use `error.tsx`, `global-error.tsx`, `not-found.tsx`, redirects, and auth-oriented error helpers
8. **Optimize framework primitives** - Prefer `next/image`, `next/font`, `next/script`, and correct metadata APIs over manual equivalents
9. **Guard against hydration and CSR bailouts** - Wrap hooks like `useSearchParams` in `<Suspense>` and fix common hydration mismatch causes
10. **Understand advanced routing and deployment** - Apply parallel routes, intercepting routes, standalone output, cache handlers, and targeted debugging tools when needed

### Available Files

| File                     | Description                                                     |
| ------------------------ | --------------------------------------------------------------- |
| `SKILL.md`               | Entry point linking to all topic guides                         |
| `file-conventions.md`    | Route segments, special files, and structural conventions       |
| `rsc-boundaries.md`      | Invalid RSC patterns and serialization pitfalls                 |
| `async-patterns.md`      | Async params, search params, cookies, and headers               |
| `runtime-selection.md`   | Node.js vs Edge runtime guidance                                |
| `directives.md`          | `'use client'`, `'use server'`, and `'use cache'` usage         |
| `functions.md`           | Navigation hooks and server/runtime helper functions            |
| `error-handling.md`      | Route-level errors, redirects, and auth errors                  |
| `data-patterns.md`       | Data fetching patterns, waterfalls, and server/client tradeoffs |
| `route-handlers.md`      | Route handler behavior and when to use it                       |
| `metadata.md`            | Static/dynamic metadata and OG image generation                 |
| `image.md`               | `next/image` usage and optimization                             |
| `font.md`                | `next/font` setup and preload guidance                          |
| `bundling.md`            | Package compatibility, CSS imports, and bundle analysis         |
| `scripts.md`             | `next/script` usage and third-party script loading              |
| `hydration-error.md`     | Common hydration mismatch causes and fixes                      |
| `suspense-boundaries.md` | Hooks and patterns that require Suspense                        |
| `parallel-routes.md`     | Parallel and intercepting route patterns                        |
| `self-hosting.md`        | Standalone output and self-hosting guidance                     |
| `debug-tricks.md`        | Targeted debugging and rebuild tips                             |

---

## 3. React Composition Patterns

**Publisher:** Vercel  
**Version:** `1.0.0`  
**When to load:** Refactoring components with too many flags, designing reusable component APIs, building compound components, or improving state architecture and React 19 readiness

### Purpose

Composition-oriented guidance for building flexible React components without boolean-prop sprawl. The skill is organized into 4 priority-ranked categories and exposes 8 rule files covering architecture, state management, implementation patterns, and React 19 API updates.

### Top 8 Rules by Priority

1. **`architecture-avoid-boolean-props`** - Avoid boolean props for behavior switches; compose variants instead
2. **`architecture-compound-components`** - Use shared-context compound components for complex UI
3. **`state-decouple-implementation`** - Keep state implementation details inside the provider
4. **`state-context-interface`** - Model context around `state`, `actions`, and `meta`
5. **`state-lift-state`** - Lift shared state into providers when siblings need it
6. **`patterns-explicit-variants`** - Prefer explicit variant components over mode/config props
7. **`patterns-children-over-render-props`** - Prefer composition through `children` over `renderX` props
8. **`react19-no-forwardref`** - In React 19+, stop defaulting to `forwardRef` and update APIs accordingly

### Available Files

| File        | Description                                              |
| ----------- | -------------------------------------------------------- |
| `SKILL.md`  | Entry point with priority categories and quick reference |
| `AGENTS.md` | Fully compiled guide with expanded rule detail           |
| `README.md` | Structure and contribution guide                         |
| `rules/`    | 8 individual rule files with explanations and examples   |

---

## 4. Design Engineering

**Publisher:** Project-local  
**Version / Notes:** Single-file craft and UI polish skill  
**When to load:** Reviewing or building polished UI where taste, animation decisions, component feel, interaction quality, and subtle implementation details matter

### Purpose

This skill encodes a design-engineering mindset rather than a narrow API checklist. It combines philosophy, review format requirements, animation decision-making, component interaction standards, performance rules, accessibility notes, and debugging advice into a single self-contained document.

### Top 10 Rules by Priority

1. **Taste is trained** - Study excellent products and make deliberate visual choices rather than stopping at "works"
2. **Unseen details compound** - Small implementation details add up to perceived quality
3. **Beauty is leverage** - Good defaults, motion, and polish are product differentiators
4. **Review format is mandatory** - UI reviews must use a markdown table with `Before | After | Why`
5. **Do not animate high-frequency keyboard actions** - Repeated actions should feel instant, not ornamental
6. **Every animation needs a purpose** - Use motion for state, feedback, spatial consistency, explanation, or to avoid jarring changes
7. **Use strong easing and avoid `ease-in` for UI** - Default to `ease-out` or custom curves that feel responsive
8. **Keep UI motion fast** - Common interface animations should usually stay under 300ms
9. **Buttons and popovers need physicality** - Use subtle press scaling, origin-aware popovers, and never animate from `scale(0)`
10. **Prefer performant, interruptible motion** - Favor transforms, opacity, transitions, reduced-motion support, and techniques that stay smooth under load

### Available Files

| File       | Description                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------------ |
| `SKILL.md` | Full self-contained skill covering philosophy, reviews, animation, performance, accessibility, and debugging |

---

## 5. React useEffect

**Publisher:** Project-local  
**Version / Notes:** Official-docs-inspired guidance focused on when not to use `useEffect`  
**When to load:** Writing or reviewing `useEffect`, derived state, event-driven logic, data fetching, state synchronization, or any React code where effects may be overused

### Purpose

Focused React guidance based on the principle that Effects are an escape hatch for synchronizing with external systems, not a default tool for ordinary state and rendering logic. The skill teaches when to replace `useEffect` with render-time calculation, `useMemo`, event handlers, `key` props, lifted state, or subscription-specific APIs.

### Top 10 Rules by Priority

1. **Use Effects only for external synchronization** - If no external system is involved, an Effect is usually the wrong tool
2. **Do not derive state with `useEffect`** - Compute values from props and state during render instead
3. **Do not use Effects to respond to user events** - Put that logic directly in the event handler
4. **Use `useMemo` for expensive pure calculations** - Do not cache render-derived values with `useEffect`
5. **Use `key` props to reset state on identity changes** - Do not manually reset state in an Effect when component identity changed
6. **Avoid chaining state updates through Effects** - Calculate the next state in one place instead of reacting after the fact
7. **Call parent callbacks at the source of change** - Do not watch local state in an Effect just to notify parents
8. **Use cleanup for data fetching when Effects are required** - Or prefer framework-native data-fetching mechanisms when available
9. **Use `useSyncExternalStore` for subscriptions when possible** - Prefer subscription-specific React APIs over ad hoc Effects
10. **Start from the decision tree** - Distinguish between event handler, Effect, render-time calculation, `useMemo`, and `key`-based reset before writing code

### Available Files

| File               | Description                                                                        |
| ------------------ | ---------------------------------------------------------------------------------- |
| `SKILL.md`         | Entry point with quick reference, decision tree, and links to deeper guidance      |
| `anti-patterns.md` | Common `useEffect` mistakes and how to fix them                                    |
| `alternatives.md`  | Better patterns such as `useMemo`, `key`, lifted state, and `useSyncExternalStore` |
| `README.md`        | Human-facing documentation for the skill                                           |

---

## 6. SEO Audit

**Publisher:** Project-local  
**Version:** `1.1.0`  
**When to load:** Auditing, reviewing, or diagnosing SEO issues on a site, especially around indexing, crawlability, rankings, technical SEO, on-page SEO, traffic drops, Core Web Vitals, or organic-search performance problems

### Purpose

Structured SEO audit guidance for diagnosing why a site is underperforming in organic search. The skill is built around a clear priority order: crawlability and indexation first, then technical foundations, on-page optimization, content quality, and authority. It also includes an explicit warning about schema-markup detection limits when using static fetch tools.

### Top 10 Rules by Priority

1. **Start with context** - Understand the site type, business goal, priority keywords, recent changes, and audit scope before judging issues
2. **Check product marketing context first** - Read `.agents/product-marketing-context.md` when present before asking redundant questions
3. **Prioritize crawlability and indexation first** - Confirm Google can discover, crawl, and index the important URLs before anything else
4. **Audit robots.txt and XML sitemaps** - Look for accidental blocks, missing sitemap references, and non-canonical URLs in the sitemap
5. **Validate canonicalization and indexation signals** - Check `noindex`, canonicals, redirects, duplicate content, and soft 404 patterns
6. **Review Core Web Vitals and technical speed factors** - Focus on LCP, INP, CLS, TTFB, JS, CSS, images, caching, CDN, and font loading
7. **Audit mobile-first readiness** - Verify responsive behavior, tap targets, viewport config, and content parity with desktop
8. **Check core on-page elements page by page** - Review titles, meta descriptions, headings, content depth, images, internal links, and keyword targeting
9. **Do not claim schema is missing from static HTML alone** - JS-injected JSON-LD often will not appear in `curl` or static fetch output
10. **Deliver prioritized, actionable findings** - Organize results into executive summary, evidence-backed findings, and a practical action plan

### Available Files

| File                                 | Description                                                                                    |
| ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `SKILL.md`                           | Full audit workflow covering technical SEO, on-page SEO, content quality, outputs, and tooling |
| `references/ai-writing-detection.md` | Reference on common AI-writing patterns to avoid during SEO/content review                     |
| `evals/evals.json`                   | Evaluation fixture for validating the skill's behavior                                         |

---

## 7. Make Interfaces Feel Better

**Publisher:** Project-local  
**Version / Notes:** UI polish skill with 4 focused reference files  
**When to load:** Refining interface feel, visual polish, typography, shadows, hover/press states, enter/exit animations, or reviewing why a UI feels slightly off

### Purpose

Practical design-engineering guidance focused on the small details that compound into a polished interface. The skill emphasizes typography, surfaces, animation feel, and performance hygiene, with short rules that are especially useful during UI review and final refinement passes.

### Top 10 Rules by Priority

1. **Concentric border radius** - Nested rounded elements should use radii derived from padding, not identical corner values
2. **Optical over geometric alignment** - Icons and asymmetrical shapes often need manual visual alignment
3. **Shadows over borders** - Prefer layered, transparent depth over hard visual separation where appropriate
4. **Interruptible animations** - Use transitions for interactive states so motion can retarget smoothly
5. **Split and stagger enter animations** - Animate semantic chunks, not a single large container
6. **Subtle exit animations** - Keep exits softer with small fixed offsets instead of dramatic travel
7. **Contextual icon animations** - Icon swaps should use opacity, scale, and blur thoughtfully
8. **Font smoothing** - Apply antialiasing for crisper text rendering on macOS/retina displays
9. **Tabular numbers** - Use tabular numerals for dynamic or comparable values to prevent layout jitter
10. **Text wrapping** - Use `text-wrap: balance` for headings and `text-wrap: pretty` for body copy

### Available Files

| File             | Description                                                            |
| ---------------- | ---------------------------------------------------------------------- |
| `SKILL.md`       | Entry point with core principles, checklist, and linked references     |
| `typography.md`  | Text wrapping, font smoothing, tabular numbers, and typographic polish |
| `surfaces.md`    | Border radius, shadows, outlines, hit areas, and visual structure      |
| `animations.md`  | Interruptible motion, icon transitions, enter/exit animation details   |
| `performance.md` | Transition specificity and careful use of `will-change`                |

---

## 8. User Interface Wiki

**Publisher:** Raphael Salaja  
**Version:** `3.0.0`  
**When to load:** Deep UI review or generation work spanning motion, timing, typography, visual design, UX laws, pseudo-elements, icons, container animation, prefetching, or UI audio

### Purpose

Comprehensive UI/UX best-practices reference for web interfaces. The skill contains 152 actual rules across 12 categories, plus 2 support files in `rules/`, ranging from animation timing and motion systems to typography, visual design, cognitive-load reduction, predictive prefetching, and audio guidance.

### Top 10 Rules by Priority

1. **`timing-under-300ms`** - User-initiated animations should complete within 300ms
2. **`timing-consistent`** - Similar elements should use consistent timing values
3. **`physics-active-state`** - Interactive elements need a pressed-state scale transform
4. **`staging-one-focal-point`** - Only one element should animate prominently at a time
5. **`easing-entrance-ease-out`** - Entrances should use ease-out timing
6. **`duration-press-hover`** - Hover and press feedback should stay in the 120-180ms range
7. **`ux-progressive-disclosure`** - Show what matters now and reveal complexity later
8. **`ux-cognitive-load-reduce`** - Remove redundant or distracting interface burden
9. **`type-text-wrap-balance-headings`** - Headings should use balanced text wrapping where supported
10. **`visual-concentric-radius`** - Nested rounded surfaces should use concentric radius relationships

### Available Files

| File        | Description                                                             |
| ----------- | ----------------------------------------------------------------------- |
| `SKILL.md`  | Entry point with category overview, quick reference, and usage guidance |
| `AGENTS.md` | Fully compiled guide covering all categories                            |
| `rules/`    | 152 rule files plus 2 support markdown files for sectioning/templates   |

---

## 9. Tailwind CSS Patterns

**Publisher:** Project-local  
**Version / Notes:** Single-file utility-first styling guide with a supporting reference  
**When to load:** Building or refining Tailwind-based UI where responsive layout, spacing, typography, states, accessibility, or reusable utility composition matter

### Purpose

Practical Tailwind guidance for day-to-day component work. The skill focuses on mobile-first styling, consistent use of design tokens, composed utility patterns, responsive layouts, accessibility states, and keeping repeated class patterns intentional rather than ad hoc.

### Top 10 Rules by Priority

1. **Start mobile-first** - Write the base layout for small screens first and add breakpoint prefixes only where needed
2. **Use design tokens over arbitrary values** - Prefer Tailwind scales for spacing, color, and type whenever possible
3. **Compose utilities deliberately** - Build clear utility groups instead of scattered one-off classes
4. **Extract repeated patterns** - Turn recurring utility bundles into shared components or class helpers
5. **Use semantic layout primitives** - Flexbox for one-dimensional alignment, grid for two-dimensional structure
6. **Respect interaction states** - Hover, focus, active, disabled, and reduced-motion states all need explicit styling
7. **Keep accessibility visible** - Preserve focus rings, touch targets, and contrast rather than styling them away
8. **Use responsive typography and spacing** - Let layout density expand with breakpoint changes instead of staying rigid
9. **Test responsive behavior intentionally** - Verify small, medium, and large layouts instead of assuming utilities compose well
10. **Keep production output clean** - Favor maintainable class composition and valid content paths over brittle dynamic utilities

### Available Files

| File                      | Description                                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `SKILL.md`                | Full Tailwind patterns guide covering layout, spacing, typography, states, accessibility, and performance notes |
| `references/reference.md` | Supporting utility-first reference document                                                                     |

---

## 10. Tailwind Design System

**Publisher:** Project-local  
**Version / Notes:** Single-file Tailwind v4 design-system skill  
**When to load:** Creating component libraries, implementing design tokens, standardizing UI patterns, or migrating Tailwind v3 design systems to v4

### Purpose

Tailwind CSS v4 design-system guidance centered on CSS-first configuration, semantic tokens, component variants, dark mode, reusable patterns, and migration from older config-driven setups.

### Top 10 Rules by Priority

1. **Model the system with semantic tokens** - Define colors, radii, and animation tokens in `@theme`, not ad hoc component classes
2. **Use Tailwind v4 CSS-first configuration** - Prefer `@theme` and CSS-native customization over legacy `tailwind.config.ts` habits
3. **Standardize variants intentionally** - Build a consistent component API for visual variants and sizes
4. **Treat dark mode as a first-class system concern** - Encode theme behavior through shared tokens and variants, not scattered overrides
5. **Design for accessibility at the token level** - Focus rings, contrast, and motion defaults should be part of the system itself
6. **Prefer reusable utility composition over duplication** - Keep repeated patterns in one place
7. **Use responsive patterns as system primitives** - Treat spacing, typography, and component density across breakpoints as deliberate tokens
8. **Build utility helpers for consistency** - Use shared functions and variant helpers where they reduce drift
9. **Plan migration explicitly** - When coming from v3, map old config concepts cleanly into v4 primitives
10. **Keep the design system production-ready** - Optimize for maintainability, predictable extension, and multi-component consistency

### Available Files

| File       | Description                                                                                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| `SKILL.md` | Full Tailwind v4 design-system guide covering tokens, variants, utilities, advanced patterns, migration, and best practices |

---

## 11. TypeScript Advanced Types

**Publisher:** Project-local  
**Version / Notes:** Single-file advanced type system skill  
**When to load:** Building complex generic utilities, type-safe APIs, event systems, validation layers, advanced reducers, or any TypeScript-heavy feature where `any` would otherwise creep in

### Purpose

Comprehensive TypeScript type-system guidance in one file. The skill walks through generics, conditional types, mapped types, template literal types, utility types, inference techniques, advanced patterns, type testing, common pitfalls, and compile-time performance considerations.

### Top 10 Rules by Priority

1. **Use `unknown` over `any`** - Preserve type safety and force narrowing
2. **Use conditional types with `infer`** - Extract inner types without runtime code
3. **Prefer discriminated unions over vague optional objects** - Model real state machines explicitly
4. **Use mapped types to transform shapes** - Derive types instead of manually duplicating them
5. **Constrain generics with `extends`** - Express the minimum contract a generic needs
6. **Use template literal types for string conventions** - Encode naming and path rules in types
7. **Prefer type guards and assertion functions over unchecked casts** - Narrow safely at runtime
8. **Reach for deep utility types when needed** - Nested state and config often need recursive helpers
9. **Test your types** - Use compile-time equality helpers to prevent regression
10. **Keep advanced types readable and performant** - Avoid overly deep conditional nesting and recursive complexity when simpler forms work

### Available Files

| File       | Description                                                                      |
| ---------- | -------------------------------------------------------------------------------- |
| `SKILL.md` | Full self-contained skill with concepts, patterns, examples, tests, and pitfalls |

---

## 12. coss ui

**Publisher:** cosscom  
**Version:** Components based on Base UI  
**When to load:** Building UIs with coss primitives (buttons, dialogs, selects, forms, menus, tabs, inputs, toasts, etc.), migrating from shadcn/Radix to coss/Base UI, composing trigger-based overlays, or troubleshooting coss component behavior.

### Purpose
coss ui is a component library built on Base UI with a shadcn-like developer experience. It provides high-quality primitives and particles for modern React applications.

### Top 10 Rules by Priority
1. **Use existing primitives and particles first** - Before inventing custom markup
2. **Prefer composition over custom behavior** - Use the built-in composition APIs
3. **Follow coss naming and APIs exactly** - Check the docs for correct props and slots
4. **Keep examples accessible** - Preserve labels and error semantics
5. **Assume Tailwind v4** - The library is designed for modern Tailwind versions
6. **No invented APIs** - Verify against component docs before generating code
7. **Follow trigger/content hierarchies** - Don't mix patterns across overlay components
8. **Consult primitive-specific guides** - Check for invariants and edge cases
9. **Include all dependencies** - When giving manual install guidance
10. **Prefer styled coss exports** - Use `*Primitive` exports only when deep customization is needed

### Available Files
| File | Description |
| ---- | ----------- |
| `SKILL.md` | Entry point with principles, usage workflow, and component discovery |
| `references/rules/` | Specific rule files for styling, forms, composition, and migration |
| `references/primitives/` | Detailed reference guides for all 53 primitives |

---

## 13. Fixing Motion Performance

**Publisher:** Project-local  
**When to load:** Adding or changing UI animations (CSS, WAAPI, Motion, rAF, GSAP), refactoring janky interactions, or implementing scroll-linked motion where performance stutter occurs.

### Purpose
Audit and fix animation performance issues including layout thrashing, compositor properties, scroll-linked motion, and blur effects.

### Top 10 Rules by Priority
1. **Never interleave layout reads/writes** - Prevents layout thrashing in the same frame
2. **Default to transform and opacity** - Use compositor-only properties for smooth motion
3. **Measure once, then animate** - Batch all DOM reads before starts writing
4. **Prefer Scroll/View Timelines** - For scroll-linked motion instead of scroll event polling
5. **Use IntersectionObserver** - To pause or stop animations when they are off-screen
6. **Avoid large promoted layers** - Use `will-change` surgically and temporarily
7. **Paint-triggering animation on small surfaces only** - Limit color/filter animations to isolated elements
8. **No continuous layout animation** - Don't animate size or position on large containers
9. **Stop/Pause background loops** - Ensure `requestAnimationFrame` has a stop condition
10. **Prefer FLIP-style transitions** - For layout-like effects that need to be performant

### Available Files
| File | Description |
| ---- | ----------- |
| `SKILL.md` | Entry point withrendering glossary, rule categories, and quick reference |

---

## 14. Tailwind Advanced Layouts

**Publisher:** Project-local  
**When to load:** Implementing complex Grid/Flexbox structures, responsive layouts with specific area requirements, or using advanced Tailwind v4 layout features.

### Purpose
A deep dive into mastering Grid Template Areas, Subgrid, Auto-fill/fit patterns, and complex flex layouts using modern Tailwind CSS.

### Available Files
| File | Description |
| ---- | ----------- |
| `SKILL.md` | Self-contained guide with patterns for Grid, Subgrid, and Flexbox |

