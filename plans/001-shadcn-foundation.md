# Plan 001: shadcn foundation + Geist token bridge

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for plan 001 in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 74aad0a..HEAD -- package.json tailwind.config.ts src/app/globals.css src/app/layout.tsx components.json src/lib/utils.ts`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: direction
- **Planned at**: commit `74aad0a`, 2026-06-18

## Why this matters

The app’s UI is built almost entirely on MUI (`@mui/material` in 15+ components) with ad-hoc Geist CSS variables in `globals.css` and scattered Tailwind classes. That produces inconsistent spacing, no shared loading/empty primitives, and a heavy client bundle. shadcn/ui gives owned, Tailwind-native components that match the existing Geist-inspired light design while allowing incremental migration — MUI can stay until later plans replace each surface.

## Current state

- `package.json` — Next 14.1.4, Tailwind 3.3, MUI 5, no shadcn deps, no `components.json`.
- `tailwind.config.ts` — Tailwind 3 with `corePlugins.preflight: false` (to avoid clashing with MUI CssBaseline).
- `src/app/globals.css` — Geist hex tokens (`--geist-primary`, `--geist-blue-700`, etc.); no shadcn CSS variables.
- `src/app/layout.tsx` — Inter from `next/font/google` on `<body>`; wraps `StoreProvider` → `ThemeProvider` (MUI) → `AppWrapper`.
- `src/components/organisms/Wrappers/ThemeProvider.tsx` — MUI theme + `localStorage` key `tlexiconTheme` (`light` | `dark` | `system`).
- `src/theme/index.ts` — MUI palette mirrors Geist colors (`#171717`, `#006bff`, etc.).

**Convention to match**: Keep the existing Geist light look (white bg, `#171717` text, `#006bff` accent, 6px radius). README states “Vercel Geist-inspired light design system.”

## Commands you will need

| Purpose   | Command                  | Expected on success        |
|-----------|--------------------------|----------------------------|
| Install   | `pnpm install`           | exit 0                     |
| Lint      | `pnpm lint`              | exit 0                     |
| Build     | `pnpm build`             | exit 0                     |
| shadcn init | `npx shadcn@latest init -d` | creates `components.json` |
| Add utils | `npx shadcn@latest add button card badge skeleton alert separator` | files under `src/components/ui/` |

## Suggested executor toolkit

- Use the **shadcn** skill: always `npx shadcn@latest init -d` (not `-y` alone) for non-interactive init.
- This project uses **Tailwind v3** (not v4) — ignore v4-only CLI flags (`--style`, `--base-color`, etc.).
- After init, read `npx shadcn@latest info` to confirm paths match `components.json` aliases.

## Scope

**In scope**:
- `package.json` / `pnpm-lock.yaml` (new deps only)
- `components.json` (create)
- `src/lib/utils.ts` (create — `cn()` helper)
- `src/app/globals.css`
- `tailwind.config.ts`
- `src/app/layout.tsx`
- `src/components/providers/theme-provider.tsx` (create — `next-themes`)
- `src/components/providers/app-providers.tsx` (create — composes TooltipProvider + ThemeProvider)

**Out of scope** (do NOT touch):
- Any file under `src/components/organisms/`, `molecules/`, `atoms/` except new `providers/`
- `src/components/organisms/Wrappers/ThemeProvider.tsx` — keep MUI theme working until plan 006
- Removing MUI packages
- Changing search/data-fetch logic

## Git workflow

- Branch: `advisor/001-shadcn-foundation`
- Commit message style: short imperative, e.g. `Add shadcn foundation and Geist token bridge` (matches repo `git log`)

## Steps

### Step 1: Initialize shadcn (non-interactive)

From repo root:

```bash
npx shadcn@latest init -d
```

If prompted for conflicts with existing Tailwind, accept defaults that use `src/app/globals.css` and `tailwind.config.ts`.

Then add baseline components used by later plans:

```bash
npx shadcn@latest add button card badge skeleton alert separator tooltip
```

**Verify**: `test -f components.json && test -f src/lib/utils.ts && ls src/components/ui/button.tsx` → all exist.

### Step 2: Map Geist tokens to shadcn CSS variables

In `src/app/globals.css`, **preserve** existing `--geist-*` variables (MUI theme and current components still reference them). **Add** shadcn `:root` and `.dark` blocks mapping to the same palette:

| shadcn token | Light value (from existing Geist) |
|--------------|-----------------------------------|
| `--background` | `#ffffff` (`--geist-background-100`) |
| `--foreground` | `#171717` (`--geist-primary`) |
| `--card` | `#ffffff` |
| `--muted` | `#f2f2f2` (`--geist-gray-100`) |
| `--muted-foreground` | `#4d4d4d` (`--geist-secondary`) |
| `--primary` | `#006bff` (`--geist-blue-700`) |
| `--primary-foreground` | `#ffffff` |
| `--border` | `#0000001a` (match MUI divider light) |
| `--radius` | `0.375rem` (6px — match `theme.shape.borderRadius`) |

Dark mode `.dark` block: use MUI dark palette from `src/theme/index.ts` (`background #000`, `foreground #ededed`, etc.).

Use HSL format if shadcn init generated HSL variables — convert hex consistently.

**Verify**: `grep -q '\-\-primary' src/app/globals.css && grep -q '\-\-geist-primary' src/app/globals.css` → both present.

### Step 3: Tailwind — enable coexistence with MUI

In `tailwind.config.ts`:

1. Add shadcn content paths if init did not: `'./src/components/ui/**/*.{ts,tsx}'`.
2. Keep `preflight: false` for now (MUI still active).
3. Extend `theme` with shadcn color/radius tokens if init expects `tailwind.config` extensions (follow generated `components.json`).

**Verify**: `pnpm build` → exit 0.

### Step 4: Add next-themes provider (parallel to MUI)

Install:

```bash
pnpm add next-themes
```

Create `src/components/providers/theme-provider.tsx`:

```tsx
'use client';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem storageKey="tlexiconTheme" {...props}>
      {children}
    </NextThemesProvider>
  );
}
```

Use the **same** `storageKey` as MUI (`tlexiconTheme`) so both systems read the same preference during migration.

Create `src/components/providers/app-providers.tsx` wrapping `TooltipProvider` (from shadcn) + `ThemeProvider`.

### Step 5: Wire providers in layout (non-breaking)

In `src/app/layout.tsx`:

1. Add `suppressHydrationWarning` on `<html>` (required for `next-themes`).
2. Wrap children: `StoreProvider` → existing MUI `ThemeProvider` → **new** shadcn `AppProviders` → `AppWrapper`.
3. Do **not** remove MUI `ThemeProvider` yet.

**Verify**: `pnpm dev` (manual) — homepage loads, theme toggle still works, no hydration errors in console.

### Step 6: Add a visual proof-of-concept (dev-only comment or Story)

Create `src/components/ui/geist-badge.tsx` — thin wrapper exporting a `SourceBadge`-shaped component using shadcn `Badge` with variants `dictionary` | `ai` matching colors from `ResultPage/index.tsx:61-71` (`--geist-green-100` / `--geist-amber-100`). **Do not wire into ResultPage yet** (plan 004).

**Verify**: `pnpm lint && pnpm build` → exit 0.

## Test plan

No test framework exists yet. Verification is build + lint only.

- `pnpm lint` → exit 0
- `pnpm build` → exit 0
- Manual: light/dark/system theme persists after refresh (`localStorage.tlexiconTheme`)

## Done criteria

- [ ] `components.json` exists with `@/` aliases pointing at `src/`
- [ ] `src/components/ui/` contains at least: button, card, badge, skeleton, alert, separator, tooltip
- [ ] `globals.css` has both `--geist-*` and shadcn `--background`/`--primary`/etc.
- [ ] `next-themes` wired in layout with `storageKey="tlexiconTheme"`
- [ ] MUI pages still render (no provider removal)
- [ ] `pnpm build` exits 0
- [ ] `plans/README.md` row 001 → DONE

## STOP conditions

- `shadcn init` wants to delete or fully replace `globals.css` Geist variables — merge manually instead; do not drop `--geist-*`.
- Init enables Tailwind preflight and MUI layout breaks visibly — revert preflight to `false` and report.
- `components.json` aliases conflict with existing `@/*` path in `tsconfig.json` — align to `@/components/ui` without changing unrelated paths.

## Maintenance notes

- Until plan 006, two theme systems coexist (MUI + next-themes). Keep `storageKey` in sync.
- When adding shadcn components later, use `npx shadcn@latest add <name>` — do not hand-copy from docs.
- Reviewers: confirm no MUI imports removed in this plan.
