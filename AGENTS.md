# Lexicons — Agent Guide

## Stack

- **Next.js 15** App Router, React 19
- **Tailwind CSS v4** with CSS-first `@theme` tokens in `src/app/globals.css`
- **shadcn v4** (`base-nova` style, Base UI primitives) — components live in `src/components/ui/`
- **Geist** fonts via `geist` package (`GeistSans`, `GeistMono` on `<html>`)
- **No MUI** — do not add `@mui/*` dependencies

## Design tokens

Semantic tokens are defined in `src/app/globals.css`:

| Token | Usage |
|-------|-------|
| `--background`, `--foreground` | Page surfaces and body text |
| `--primary` (#006bff) | Links, focus rings, CTAs |
| `--muted`, `--border` | Subtle surfaces and dividers |
| `--status-dictionary`, `--status-ai` | Source badges (dictionary vs AI) |
| `--radius` (0.625rem) | shadcn border radius |

Use Tailwind utilities (`bg-background`, `text-muted-foreground`, `bg-status-ai`, etc.) — never hardcode `--geist-*` hex values in components.

## Layout primitives

| Component | Path | Purpose |
|-----------|------|---------|
| `PageShell` | `src/components/ui/page-shell.tsx` | Consistent max-width + padding |
| `SectionHeading` | `src/components/ui/section-heading.tsx` | Sidebar/card section titles |
| `SourceBadge` | `src/components/ui/source-badge.tsx` | Dictionary vs AI source label (CVA) |
| `KbdHint` | `src/components/ui/kbd-hint.tsx` | Shared ⌘K shortcut badge |

## App shell

- Header height: `h-14`; main offset: `pt-14`
- Command palette: `CommandSearchProvider` in `AppWrapper` — use `useCommandSearch().openCommand` for ⌘K triggers
- Desktop nav search is click-to-open Command (`commandFirst` on `SearchBar`); hero search on `/` is fully editable
- `CommandSearch` is dynamically imported (`ssr: false`) for bundle size

## Page patterns

- **Home** (`HomePage`): editorial hero, InputGroup search, outline Badge example queries
- **Result** (`ResultPage`): single hero block (no nested cards), Accordion per POS, `max-w-prose` definitions, sticky sidebar at `top-16`
- **QuickMeaning**: HoverCard on `.lexicon` spans with dictionary + optional AI fallback

## Verification

```bash
pnpm build
pnpm lint
rg "@mui/" src   # must return zero matches
```

Manual checks: `/`, `/search/perfect`, `/search/break%20the%20ice`, mobile 375px, keyboard Tab + ⌘K.
