# Plan 006: Remove MUI and finalize shadcn migration

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for plan 006 in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 74aad0a..HEAD -- package.json src/`

## Status

- **Priority**: P3
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: plans/002, 003, 004, 005 (all DONE)
- **Category**: tech-debt
- **Planned at**: commit `74aad0a`, 2026-06-18

## Why this matters

After plans 001–005, the app still carries dual UI stacks: MUI (+ Emotion) and shadcn (+ Tailwind). MUI packages account for a large share of client JS. Removing MUI once all surfaces are migrated reduces bundle size, eliminates theme dual-maintenance, and enables Tailwind `preflight: true` for consistent base styles.

## Current state (pre-migration)

MUI imports remain in (non-exhaustive — **grep before starting**):

- `src/components/organisms/Wrappers/ThemeProvider.tsx`
- `src/components/molecules/Meaning/*`, `Thesaurus/*`, `Audio.tsx`
- `src/components/atoms/AppGrid.tsx`, `AppIcons` (MUI icons)
- `src/components/organisms/Footer/index.tsx`
- Legal pages: `terms-of-service`, `privacy-policy`
- `src/theme/*`

`package.json` MUI-related deps:

```json
"@emotion/cache", "@emotion/react", "@emotion/styled",
"@mui/icons-material", "@mui/material", "@mui/material-nextjs"
```

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Find MUI | `rg "@mui/" src --files-with-matches` | list all files |
| Lint | `pnpm lint` | exit 0 |
| Build | `pnpm build` | exit 0 |
| Analyze | `pnpm build` and compare First Load JS (optional) | smaller bundle |

## Scope

**In scope**: All files still importing `@mui/*` — migrate to shadcn/Tailwind/Lucide.

**Out of scope**:
- Search/data logic changes
- Next.js major upgrade (separate DEPS plan)

## Steps

### Step 1: Inventory gate

```bash
rg "@mui/" src -l | sort
```

If **any** of Nav, Home, ResultPage, QuickMeaning still import MUI — **STOP**. Finish plans 002–005 first.

**Verify**: Inventory list documented in PR description.

### Step 2: Migrate remaining molecules

| File | Migration |
|------|-----------|
| `Meaning/index.tsx`, `Definition.tsx` | Tailwind typography; keep `.lexicon` spans |
| `MeaningGroup.tsx` | Card sections; move `isPhoneticRegex` to `src/utils/regex.ts` (fixes circular import) |
| `Thesaurus/*` | Card + Badge links |
| `Audio.tsx` | shadcn `Button` size icon + Lucide `Volume2` |
| `Footer/index.tsx` | Tailwind flex; `useTheme` from `next-themes` for banner image swap |
| Legal pages | `prose` Tailwind typography or simple Card layout |

Add components as needed: `npx shadcn@latest add accordion` for Thesaurus expand/collapse if used.

**Verify**: `rg "@mui/" src/molecules` → no matches.

### Step 3: Replace AppGrid

`AppGrid.tsx` wraps MUI Grid v2. Replace usages with Tailwind CSS grid/flex (grep `AppGrid` importers). Delete `AppGrid.tsx` when zero imports.

**Verify**: `rg "AppGrid" src` → no matches.

### Step 4: Replace AppIcons with Lucide

Create `src/components/icons.tsx` re-exporting Lucide icons used across app. Map existing icon names (`SearchIcon` → `Search`, etc.). Update imports file-by-file.

Delete or gut `src/components/atoms/AppIcons/index.tsx`.

**Verify**: `rg "@mui/icons-material" src` → no matches.

### Step 5: Remove MUI theme layer

1. Delete `src/components/organisms/Wrappers/ThemeProvider.tsx`
2. Delete `src/theme/` directory
3. Update `layout.tsx`: `StoreProvider` → shadcn `AppProviders` only (next-themes + TooltipProvider)
4. Remove `AppRouterCacheProvider`, `CssBaseline`

**Verify**: Theme toggle still works via `next-themes` only.

### Step 6: Remove MUI packages + enable preflight

```bash
pnpm remove @mui/material @mui/icons-material @mui/material-nextjs @emotion/react @emotion/styled @emotion/cache
```

In `tailwind.config.ts`, set `corePlugins.preflight: true` (or remove override).

Remove `next.config.mjs` `compiler.styledComponents` block (unused).

**Verify**: `pnpm install && pnpm build` → exit 0.

### Step 7: Bundle check

Run `pnpm build` and note First Load JS for `/` and `/search/[word]` compared to pre-migration baseline (record in PR).

Target: measurable reduction on shared layout chunk.

## Test plan

Full manual regression:

- [ ] `/` homepage
- [ ] `/search/hello` dictionary
- [ ] `/search/break%20the%20ice` AI fallback
- [ ] Hover quick meaning
- [ ] `⌘K` command search
- [ ] Light/dark/system theme
- [ ] Footer links + legal pages
- [ ] Mobile nav sheet

`pnpm lint && pnpm build` → exit 0.

## Done criteria

- [ ] `rg "@mui/" src` → no matches
- [ ] MUI packages removed from `package.json`
- [ ] `ThemeProvider.tsx` (MUI) deleted
- [ ] `pnpm build` exits 0
- [ ] `plans/README.md` row 006 → DONE

## STOP conditions

- Plans 002–005 not DONE — stop.
- Build fails after removing Emotion — identify components still injecting `sx` props; migrate those files first.
- Visual regression on Meaning/Thesaurus too large for one PR — split step 2 into sub-PRs per folder and pause 006.

## Maintenance notes

- Add `AGENTS.md` note: “UI is shadcn + Tailwind; do not re-add MUI.”
- Consider plan 001 verification baseline (Vitest) before this plan if team wants automated regression.
