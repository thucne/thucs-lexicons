# Plan 034: Spike — productize Explore with AI modes

> **Executor instructions**: Design/spike plan for product direction. Deliver UX spec and technical outline — not a full feature build. Update `plans/README.md` when complete.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- src/components/organisms/ResultPage/result-sidebar.tsx src/components/organisms/HomePage/index.tsx`

## Status

- **Priority**: P3
- **Effort**: L (spike S, build L)
- **Risk**: MED
- **Depends on**: plans/014-openai-schema-prompt-align.md, plans/016-openai-rate-limit.md
- **Category**: direction
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: DIRECTION-04

## Why this matters

Homepage positions the app as a "meaning explorer" with example queries and sidebar "explore" affordances on ResultPage (`result-sidebar.tsx`). Today AI is a silent fallback when dictionary misses — not a user-visible mode. Productizing modes (examples, idioms, compare, refine) could differentiate the app.

## Current state

- Dictionary-first, AI fallback automatic (`ResultPage` `shouldFetchWithAI`)
- `SourceBadge` distinguishes dictionary vs AI on success
- No user toggle for "explore with AI" vs "dictionary only"
- OpenAI schema supports rich definitions but no mode-specific prompts

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Build   | `pnpm build` | exit 0 |

## Scope

**In scope**:
- `plans/spikes/034-explore-ai-modes-spec.md` with:
  - 2–3 user-facing modes (e.g. "Standard", "Explain like I'm 5", "Idiom / phrase")
  - UI placement options (sidebar tabs, command palette actions)
  - API design: query param `?mode=` vs separate routes
  - Cost implications (plan 016 limits)
  - MVP slice vs future
- Wireframes in markdown (no Figma required)

**Out of scope**:
- Implementing all modes
- New OpenAI models
- Auth / saved preferences

## Git workflow

- Branch: `advisor/034-explore-ai-modes-spike`

## Steps

### Step 1: Audit existing sidebar and hero CTAs

List current explore entry points in `result-sidebar.tsx`, `HomePage`, `CommandSearch`.

### Step 2: Define mode matrix

| Mode | Trigger | Prompt delta | Dictionary first? |
|------|---------|--------------|-------------------|

### Step 3: Technical sketch

Extend `/api/openai/search?input=&mode=idiom` with prompt templates — align with plan 014 schema.

### Step 4: MVP recommendation

Single shippable slice (e.g. manual "Ask AI" button on empty state only).

## Test plan

- Spec document review — no code tests

## Done criteria

- [ ] Spec doc with modes, UI, API, MVP scope
- [ ] Cost/rate-limit note references plan 016
- [ ] `plans/README.md` row 034 → DONE

## STOP conditions

- Product direction is dictionary-only — mark REJECTED in README.

## Maintenance notes

- Modes multiply prompt/schema maintenance — tie to plan 014 conventions.
