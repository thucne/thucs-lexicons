# Plan 009: Sync docs after shadcn revamp (README, AGENTS, plans index)

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- README.md AGENTS.md plans/README.md`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none (plan 007 may add typecheck to AGENTS — merge those edits if 007 landed first)
- **Category**: docs
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: DOCS-01, DOCS-02, DOCS-03

## Why this matters

Documentation still describes the **pre-revamp** stack. Contributors following README will expect MUI, Supabase favorites, and npm — the app now uses shadcn, no auth/favorites, and pnpm. `AGENTS.md` says QuickMeaning uses HoverCard but implementation uses **Popover** (`QuickMeaning.tsx:8`). `plans/README.md` intro still frames work as "alongside existing MUI."

## Current state

**DOCS-01** — `README.md` line 18: `Keywords: Next.js, TypeScript, MUI, Redux...`
Lines 14–15 mention Supabase favorites and browser storage — removed in revamp.

**DOCS-02** — `AGENTS.md` line 45:
```
- **QuickMeaning**: HoverCard on `.lexicon` spans with dictionary + optional AI fallback
```

Live code (`src/components/organisms/ResultPage/QuickMeaning.tsx:8`):
```tsx
import { Popover, PopoverContent } from '@/components/ui/popover';
```

**DOCS-03** — `plans/README.md` line 3:
```
Focus: **UI/UX polish via shadcn/ui**, incremental alongside existing MUI.
```

Post plan 006, MUI is removed (`rg "@mui/" src` → 0 matches).

## Commands you will need

| Purpose | Command            | Expected on success |
|---------|--------------------|---------------------|
| MUI     | `rg "@mui/" src`   | 0 matches           |
| Lint    | `pnpm lint`        | exit 0              |

## Scope

**In scope**:
- `README.md`
- `AGENTS.md`
- `plans/README.md` — intro paragraph only (status table maintained by advisor/executors)

**Out of scope**:
- Rewriting all plan files 001–006
- Marketing copy on HomePage

## Git workflow

- Branch: `advisor/009-docs-sync`
- Commit: `Update README and AGENTS for post-shadcn stack`

## Steps

### Step 1: Update README.md

- Replace MUI/Supabase/favorites references with current stack: Next.js 15, shadcn, Tailwind v4, SWR, Redux (session cache only).
- Prefer `pnpm` in install/run examples (match `package.json` lockfile).
- Update "Last updated" date to 2026-06-18.
- Remove or soften Udemy tutorial framing if stale — keep brief project description.

**Verify**: `rg -i "mui|supabase|favorite" README.md` → 0 matches (or only historical "removed" note if needed)

### Step 2: Fix AGENTS.md QuickMeaning line

Change to:
```
- **QuickMeaning**: Popover anchored to `.lexicon` spans with dictionary + optional AI fallback
```

If plan 007 added typecheck/test to verification block, ensure those lines remain.

**Verify**: `rg "HoverCard" AGENTS.md` → 0 matches in QuickMeaning context

### Step 3: Refresh plans/README intro

Replace MUI-centric intro with post-revamp framing, e.g.:
```
Post-shadcn revamp (plans 001–006 DONE). Plans 007+ address correctness, security, performance, and DX from the post-revamp audit.
```

**Verify**: read intro — no "alongside existing MUI"

## Test plan

- Doc-only — no automated tests.
- Manual: README install steps use pnpm; AGENTS matches `QuickMeaning.tsx` imports.

## Done criteria

- [ ] README has no stale MUI/Supabase-as-feature references
- [ ] AGENTS.md documents Popover for QuickMeaning
- [ ] plans/README intro reflects post-MUI state
- [ ] `plans/README.md` row 009 → DONE

## STOP conditions

- README rewrite uncovers missing env/docs that belong in plan 008 — note and continue; don't block on 008.
- Product owner wants to keep Udemy tutorial framing — stop and ask.

## Maintenance notes

- When QuickMeaning switches back to HoverCard (if ever), update AGENTS in the same PR.
- Plan 007 may also touch AGENTS verification — coordinate to avoid merge conflicts.
