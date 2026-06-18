# Plan 004: Result page states + layout polish

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for plan 004 in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 74aad0a..HEAD -- src/components/organisms/ResultPage/index.tsx src/components/organisms/ResultPage/MeaningGroup.tsx`

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/001-shadcn-foundation.md
- **Category**: direction
- **Planned at**: commit `74aad0a`, 2026-06-18

## Why this matters

`ResultPage` is the core product surface (~360 lines) and feels rough:

- **Loading** (`index.tsx:74-86`): spinner + single line — no layout skeleton, jarring content shift.
- **Empty** (`index.tsx:88-103`): plain “No meaning found” — no example links, no retry, no distinction dictionary-vs-AI failure.
- **Success**: six inline sub-components each repeat MUI `Paper` + `border` + `borderRadius: 3` boilerplate.
- **AI disclosure**: MUI `Alert` works but styling diverges from homepage.

shadcn `Skeleton`, `Alert`, `Card`, and a shared `SourceBadge` make states feel designed and reduce duplication.

**Important**: If audit bug **CORRECTNESS-01** (dictionary error blocks AI fallback) is fixed separately, ensure empty-state logic uses `results` not raw `error` — this plan’s empty state should show when `!results?.length` after loading completes.

## Current state

Key excerpts:

```tsx
// LoadingState — index.tsx:74-86
<CircularProgress size={18} />
<Typography>Exploring "{word}"…</Typography>

// EmptyState — index.tsx:88-103
<Typography variant="h3">No meaning found</Typography>

// Success gate — index.tsx:263-268
if (isLoading || isAILoading) return <LoadingState />;
if (error || !Array.isArray(results) || results.length === 0) return <EmptyState />;
```

Sub-panels: `FeaturePromptPanel`, `PronunciationPanel`, `RelatedMap`, `ExampleLab` — all MUI `Paper` stacks.

`SourceBadge` — MUI `Chip` with Geist colors (`index.tsx:61-71`).

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Add UI | `npx shadcn@latest add alert` (if missing) | exit 0 |
| Lint | `pnpm lint` | exit 0 |
| Build | `pnpm build` | exit 0 |

## Scope

**In scope**:
- `src/components/organisms/ResultPage/index.tsx`
- `src/components/ui/source-badge.tsx` (create — move from inline `SourceBadge`)
- `src/components/organisms/ResultPage/result-states.tsx` (create — Loading, Empty, Error)
- `src/components/organisms/ResultPage/result-sidebar.tsx` (create — pronunciation, prompts, related, examples)

**Out of scope**:
- `QuickMeaning.tsx` (plan 005)
- `MeaningGroup.tsx` / `Meaning/*` (MUI OK for this plan unless trivial)
- Data fetching hooks (`use-lexicon.tsx`)
- Fixing CORRECTNESS-01 unless trivial one-line change to empty gate (allowed: change `if (error || !results)` → `if (!results?.length)` when loading false)

## Steps

### Step 1: Create SourceBadge component

`src/components/ui/source-badge.tsx` using shadcn `Badge`:

- `variant="dictionary"` — green tones via `className` referencing `bg-[var(--geist-green-100)] text-[var(--geist-green-900)]`
- `variant="ai"` — amber tones + Lucide `Sparkles` icon

Replace inline `SourceBadge` in ResultPage.

**Verify**: `pnpm build` → exit 0.

### Step 2: Loading skeleton state

`result-states.tsx` — `ResultLoadingState({ word })`:

- shadcn `Card` with `CardHeader` showing “Exploring **{word}**…”
- `Skeleton` blocks mimicking final layout:
  - Badge row (h-6 w-32)
  - Title (h-10 w-3/4)
  - 3 definition lines (h-4 w-full)
  - Sidebar column skeleton on `md:` breakpoint

Use `role="status"` and `aria-live="polite"` on container.

**Verify**: Navigate to `/search/serendipity` — skeleton shows before content (network throttle optional).

### Step 3: Empty state with actions

`ResultEmptyState({ word })`:

- `Card` + `Alert` variant default (not destructive) explaining no dictionary or AI hit
- **Action row** — reuse example buttons from homepage (`affect vs effect`, `break the ice`) as shadcn `Button variant="outline" size="sm"`
- Optional: “Try Compare Mode” link building `/search/${encodeURIComponent(word + ' vs similar word')}`

Empty gate in ResultPage:

```tsx
if (isLoading || isAILoading) return <ResultLoadingState word={word} />;
if (!results?.length) return <ResultEmptyState word={word} />;
```

Remove bare `error` from gate unless no results and you want a separate `ResultErrorState` — prefer showing AI results when present.

**Verify**: `/search/xyznotaword12345` shows empty state with clickable examples.

### Step 4: Success layout — hero card

Replace main hero `Paper` (`index.tsx:282-321`) with `Card`:

- `CardHeader`: `SourceBadge` + part-of-speech `Badge variant="secondary"`
- `CardTitle`: word (`text-4xl font-semibold tracking-tight`)
- “Did you mean” as muted text + `Link` with `underline-offset-4`
- AI warning: shadcn `Alert` with `variant` default and Lucide `Sparkles` — copy from existing MUI Alert text

**Verify**: Dictionary result shows green badge; AI result shows amber badge + alert.

### Step 5: Extract sidebar panels

Move to `result-sidebar.tsx` as named exports, each returning shadcn `Card`:

| Component | Content |
|-----------|---------|
| `PronunciationCard` | from `PronunciationPanel` |
| `ExploreWithAICard` | from `FeaturePromptPanel` — use `Button variant="outline" size="sm"` for mode chips |
| `RelatedMapCard` | from `RelatedMap` |
| `ExampleLabCard` | from `ExampleLab` |

Keep `Audio` molecule as-is (MUI inside OK for now).

Use `Separator` between sidebar footer caption.

**Verify**: Sidebar stacks on mobile (`space-y-4`), 4-col grid on desktop unchanged structurally.

### Step 6: Remove dead inline components from index.tsx

Delete old `LoadingState`, `EmptyState`, `FeaturePromptPanel`, etc. from `index.tsx` after extraction.

Target: `index.tsx` under 200 lines — orchestration + `MeaningGroup` list only.

**Verify**: `grep -c 'Paper' src/components/organisms/ResultPage/index.tsx` → `0`.

## Test plan

Manual flows:

| URL | Expected |
|-----|----------|
| `/search/hello` | Skeleton → dictionary result, green badge |
| `/search/xyzinvalid` | Empty state with example buttons |
| `/search/break%20the%20ice` | AI amber badge + alert (if AI returns data) |

`pnpm lint && pnpm build` → exit 0.

## Done criteria

- [ ] `result-states.tsx` and `result-sidebar.tsx` exist
- [ ] `SourceBadge` in `src/components/ui/source-badge.tsx`
- [ ] Loading uses `Skeleton`, not `CircularProgress`
- [ ] Empty state includes ≥2 actionable example links
- [ ] `index.tsx` has no MUI `Paper`/`Container`/`CircularProgress`
- [ ] `pnpm build` exits 0
- [ ] `plans/README.md` row 004 → DONE

## STOP conditions

- Fixing empty gate reveals CORRECTNESS-01 still broken (AI data exists but empty shows) — apply minimal gate fix: `if (!results?.length)` only.
- `MeaningGroup` crashes on AI payload — stop and file follow-up; do not scope-creep into Meaning molecules.

## Maintenance notes

- `SourceBadge` is reused in plan 005 QuickMeaning.
- When CORRECTNESS-04 (API 5xx) lands, add `ResultErrorState` distinct from empty.
