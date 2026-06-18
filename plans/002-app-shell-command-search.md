# Plan 002: App shell — Command search, nav, theme toggle

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for plan 002 in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 74aad0a..HEAD -- src/components/organisms/NavigationBar/ src/components/molecules/ThemeSelect/ src/components/organisms/Wrappers/AppWrapper.tsx`

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/001-shadcn-foundation.md
- **Category**: direction
- **Planned at**: commit `74aad0a`, 2026-06-18

## Why this matters

Navigation and search are the primary interaction loop. Today:

- `SearchBar.tsx` uses a heavy MUI `TextField` with custom styled wrappers.
- `⌘K` / `Ctrl+K` only focuses the inline input — no command palette, no recent searches, no example shortcuts.
- Mobile search toggles via MUI `IconButton` + conditional row (`NavigationBar/index.tsx:57-66`) — abrupt, no animation, easy to lose focus.
- `ThemeSelect` uses custom `AppMenu` — works but inconsistent with the rest of the design system.

Polishing the shell with shadcn `Command`, `Dialog`, `Sheet`, `Input`, and `DropdownMenu` makes the app feel intentional and matches dictionary-product patterns (Algolia, Raycast-style search).

## Current state

- `src/components/organisms/NavigationBar/index.tsx` — sticky header, desktop `SearchBar`, mobile toggle, `ThemeSelect`.
- `src/components/organisms/NavigationBar/SearchBar.tsx` — form submit → `router.push(createUrl('/search', params))`; `⌘K` focus handler lines 86-105.
- `src/components/molecules/ThemeSelect/index.tsx` — MUI `IconButton` + `AppMenu` for light/dark/system.
- `src/components/organisms/HomePage/index.tsx:10` — example queries: `serendipity`, `affect vs effect`, `break the ice`, `resilience in a sentence` (reuse in Command palette).
- `src/utils/index.ts:4-6` — `createUrl` helper for search navigation.

**Exemplar routing pattern** (keep):

```tsx
router.push(createUrl('/search', newParams));
// or direct: `/search/${encodeURIComponent(word)}`
```

## Commands you will need

| Purpose   | Command                                      | Expected on success |
|-----------|----------------------------------------------|---------------------|
| Add UI    | `npx shadcn@latest add command dialog sheet input dropdown-menu` | ui files created |
| Lint      | `pnpm lint`                                  | exit 0              |
| Build     | `pnpm build`                                 | exit 0              |

## Scope

**In scope**:
- `src/components/organisms/NavigationBar/index.tsx`
- `src/components/organisms/NavigationBar/SearchBar.tsx` (rewrite or replace)
- `src/components/organisms/NavigationBar/CommandSearch.tsx` (create)
- `src/components/molecules/ThemeSelect/index.tsx`
- `src/components/organisms/Wrappers/AppWrapper.tsx` (only if padding tweak needed)

**Out of scope**:
- `ResultPage`, `HomePage` search hero (plan 003 keeps its own `SearchBar` import — update import path only if you extract shared component)
- Removing MUI from Footer
- Search API / routing logic changes

## Git workflow

- Branch: `advisor/002-app-shell`
- One commit per major step (Command palette, mobile Sheet, theme dropdown)

## Steps

### Step 1: Extract shared search hook

Create `src/hooks/use-search-navigation.ts`:

- Accept initial value from URL (`searchParams.get('word')` or path segment).
- Export `search`, `setSearch`, `submitSearch(word: string)` that navigates via `createUrl('/search', params)` (same behavior as `SearchBar.tsx:116-128`).
- Export `EXAMPLE_QUERIES` constant (copy array from `HomePage/index.tsx:10`).

**Verify**: `pnpm build` → exit 0.

### Step 2: Build CommandSearch dialog

Create `src/components/organisms/NavigationBar/CommandSearch.tsx`:

- shadcn `CommandDialog` (or `Dialog` + `Command`) opened by:
  - Global `⌘K` / `Ctrl+K` (move listener from SearchBar)
  - Click on desktop search trigger (looks like an `Input` button showing placeholder + kbd hint)
- `CommandInput` placeholder: `Search a word, phrase, or comparison`
- `CommandGroup` “Examples” listing `EXAMPLE_QUERIES` — on select, `submitSearch` and close dialog
- `CommandEmpty` with helpful copy
- On Enter with text, submit and close

Use Lucide `Search` icon (`lucide-react` — installed by shadcn) instead of MUI icons in new files.

**Verify**: Manual — `⌘K` opens dialog; selecting example navigates to `/search?word=...` or `/search/[word]` (match existing `SearchBar` behavior exactly).

### Step 3: Desktop inline search field

Replace MUI `StyledSearchInput` in `SearchBar.tsx` with shadcn `Input` inside the same `<form onSubmit>`:

- Keep `autoFocus`, `defaultValue`, `size` props API stable for `HomePage` import.
- Desktop: show `kbd` hint (`⌘K`) using shadcn `Badge` variant outline when empty.
- Clicking the field OR the kbd hint opens `CommandSearch` on desktop (optional polish); submitting form still works without opening dialog.

**Verify**: Submitting “hello” navigates to search; `pnpm lint` → exit 0.

### Step 4: Mobile Sheet search

In `NavigationBar/index.tsx`, replace mobile expand row with shadcn `Sheet`:

- Trigger: icon button (Lucide `Search` / `X`)
- `SheetContent` side `top` or `bottom` containing `SearchBar autoFocus`
- Close sheet on successful submit (pass `onSubmitted` callback)

Remove MUI `IconButton`, `LinearProgress` fallback → use `Skeleton` h-10 w-full for Suspense fallback.

**Verify**: Mobile viewport (~375px) — sheet opens, search works, closes on navigate.

### Step 5: Theme toggle with DropdownMenu

Rewrite `ThemeSelect/index.tsx`:

- shadcn `DropdownMenu` + `DropdownMenuTrigger` as `Button` variant `ghost` size `icon`
- Items: Light, Dark, System with Lucide icons (`Sun`, `Moon`, `Monitor`)
- Call `useTheme()` from `next-themes` (not MUI `ColorModeContext`) for toggle
- **Also** call existing MUI `ColorModeContext.toggleColorMode` in each handler so MUI surfaces stay in sync until plan 006

**Verify**: Toggle theme — MUI nav/footer and shadcn Input borders both update.

### Step 6: Navigation bar visual polish

Update `NavigationBar/index.tsx`:

- Replace MUI `Box`/`Grid` layout with Tailwind flex (`flex h-14 items-center justify-between gap-4 px-4`) where possible
- Keep `AppGrid` only if removing it is too large — prefer simplifying to flex
- Sticky header: `sticky top-0 z-50 border-b bg-background/80 backdrop-blur`
- Logo: `text-lg font-semibold tracking-tight`

**Verify**: `pnpm build` → exit 0; header matches Geist compact density.

## Test plan

- Manual checklist:
  - [ ] Desktop `⌘K` opens command palette
  - [ ] Example chip in palette navigates correctly
  - [ ] Mobile sheet search works
  - [ ] Theme persists across reload
  - [ ] No duplicate global keydown listeners (check React strict mode double-mount)

## Done criteria

- [ ] `CommandSearch.tsx` exists and is mounted from `NavigationBar`
- [ ] `SearchBar.tsx` has no `@mui/material` imports
- [ ] `ThemeSelect` uses shadcn `DropdownMenu` (may still import MUI context for sync)
- [ ] `pnpm lint` and `pnpm build` exit 0
- [ ] `plans/README.md` row 002 → DONE

## STOP conditions

- Plan 001 not complete (`src/components/ui/button.tsx` missing) — stop and finish 001 first.
- `Command` component fails to install on Tailwind 3 — report CLI error; do not fork a custom command palette.
- Search navigation behavior changes (e.g. switches from `/search?word=` to `/search/[word]` only) — must match existing `SearchBar` exactly.

## Maintenance notes

- When plan 006 removes MUI, delete `ColorModeContext` bridge from `ThemeSelect` and use only `next-themes`.
- Extract `SearchBar` to `src/components/search/search-bar.tsx` if HomePage and Nav both import it — optional cleanup.
