# Plan 005: QuickMeaning hover popover

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for plan 005 in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 74aad0a..HEAD -- src/components/organisms/ResultPage/QuickMeaning.tsx src/hooks/use-listener.tsx src/components/atoms/AppMenu/`

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: MED
- **Depends on**: plans/001-shadcn-foundation.md, plans/004-result-page-states-layout.md
- **Category**: direction
- **Planned at**: commit `74aad0a`, 2026-06-18

## Why this matters

In-page word hover is central to “meaning explorer” positioning (`HomePage`: “Move from a definition into examples…”). `QuickMeaning.tsx` anchors a custom MUI `AppMenu` to hovered `.lexicon` spans with:

- 1s delay before fetch (good) but popover tied to `Menu` positioning (awkward near viewport edges)
- Loading/empty copy as plain MUI `Typography`
- `use-listener.tsx` cleanup bug (registers `enterFunc`, removes `onMouseEnter`) — causes duplicate handlers

shadcn `Popover` + `HoverCard` (or Popover with controlled open) gives better positioning, accessible focus, and consistent styling with ResultPage badges.

## Current state

- `QuickMeaning.tsx` — uses `useOnHoveredText` + `AppMenu` + MUI `Button`/`CircularProgress`
- `use-listener.tsx:60-76` — debounced mouseover on `document`
- `Definition.tsx` — splits words into `.lexicon` spans for hover targets
- `AppMenu/index.tsx` — MUI `Menu` wrapper (also used by `ThemeSelect` until plan 002)

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Add UI | `npx shadcn@latest add popover hover-card` | exit 0 |
| Lint | `pnpm lint` | exit 0 |
| Build | `pnpm build` | exit 0 |

## Scope

**In scope**:
- `src/components/organisms/ResultPage/QuickMeaning.tsx` (rewrite)
- `src/hooks/use-listener.tsx` (fix cleanup only — lines 45-47 and 73-75)
- Delete or stop importing `AppMenu` from QuickMeaning

**Out of scope**:
- `AppMenu` deletion (ThemeSelect may still use until 002/006)
- AI fallback in hover (direction D4 — optional stretch goal below)
- `Definition.tsx` word-splitting logic

## Steps

### Step 1: Fix use-listener cleanup (prerequisite bug)

In `use-listener.tsx`:

**`useHoveredText`** cleanup must remove the same functions added:

```tsx
return () => {
  document.removeEventListener('mouseover', enterFunc);
  document.removeEventListener('mouseout', leaveFunc);
  enterFunc.cancel?.();
  leaveFunc.cancel?.();
};
```

**`useOnHoveredText`** cleanup:

```tsx
return () => {
  document.removeEventListener('mouseover', enterFunc);
  enterFunc.cancel?.();
};
```

**Verify**: `pnpm build` → exit 0.

### Step 2: Rewrite QuickMeaning with Popover

Replace `AppMenu` with shadcn `Popover`:

- `open={Boolean(hoveredTextElement)}` controlled mode
- `PopoverAnchor` — use a virtual anchor pattern OR position popover relative to `hoveredTextElement.getBoundingClientRect()` via `PopoverContent` `style` (if no anchor ref, use `HoverCard` with `openDelay={1000}` on `.lexicon` parent — **prefer HoverCard** for hover UX)

Recommended: **`HoverCard`** with `openDelay={1000}` `closeDelay={200}`:

- Wrap nothing globally — instead attach `HoverCard` per `.lexicon` span OR use single HoverCard with dynamic anchor (simpler: keep document listener but render one `Popover` anchored to `hoveredTextElement` using Radix `PopoverAnchor` ref forwarded to element position)

Pragmatic approach matching current architecture:

```tsx
<Popover open={Boolean(hoveredTextElement)}>
  <PopoverAnchor virtualRef={{ current: hoveredTextElement }} />
  <PopoverContent className="w-80 p-4" side="top" align="start">
    ...
  </PopoverContent>
</Popover>
```

(Check Radix Popover virtual ref API — if unavailable, use `HoverCard` on a portal positioned via `floating-ui` or keep anchor element ref on hovered span.)

Content states:

| State | UI |
|-------|-----|
| Loading | `Skeleton` lines + “Loading definition…” |
| Hit | word title, `SourceBadge variant="dictionary"`, definition text, `Button asChild` → word page |
| Miss | `text-muted-foreground` “No dictionary definition for …” |

Replace MUI `Button` with shadcn `Button variant="link"`.

**Verify**: Hover a word in a definition for ≥1s — popover appears; “Open Word” navigates.

### Step 3: Request ordering guard (correctness)

In fetch effect, track `hoveredText` in a ref; after `await`, only `setMeaning` if still current:

```tsx
const activeHover = hoveredText;
const results = await getFreeDictionaryLexicons([activeHover]);
if (activeHover !== hoveredTextRef.current) return;
```

**Verify**: Rapid hover across words — popover shows last hovered word only.

### Step 4: Delete PopupMeaning stub

Remove `src/components/molecules/Meaning/PopupMeaning.tsx` if still present (unimported stub `Ahihi {word}`).

**Verify**: `test ! -f src/components/molecules/Meaning/PopupMeaning.tsx` or file deleted.

### Step 5: Optional stretch — AI fallback on miss

Only if time permits AND plan 004 `SourceBadge` exists:

On dictionary miss, call `useLexiconWithAI(hoveredText)` or single fetch to `/api/openai/search?input=...` and show `SourceBadge variant="ai"`.

If not implemented, document as deferred in PR description.

## Test plan

- Manual: hover “example” word in a long definition on result page
- Rapid hover test (step 3)
- `pnpm lint && pnpm build` → exit 0

## Done criteria

- [ ] `QuickMeaning.tsx` has no `@mui/material` or `AppMenu` imports
- [ ] `use-listener.tsx` cleanup removes `enterFunc`/`leaveFunc`
- [ ] Hover popover uses shadcn `Popover` or `HoverCard`
- [ ] `PopupMeaning.tsx` removed if existed
- [ ] `pnpm build` exits 0
- [ ] `plans/README.md` row 005 → DONE

## STOP conditions

- Radix virtual anchor unavailable in installed shadcn version — use `HoverCard` per span in `Definition.tsx` instead (requires small change to Definition — allowed if QuickMeaning-only approach fails).
- Plan 004 not done — still proceed; inline Badge OK temporarily.

## Maintenance notes

- Direction finding D4 (AI hover fallback) can extend this component later.
- After plan 006, remove `AppMenu` entirely if no imports remain.
