# Plan 009: Sync docs after shadcn revamp and QuickMeaning fixes

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat fb2c1ca..HEAD -- README.md AGENTS.md plans/README.md`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none (plan 007 may add typecheck to AGENTS — merge those edits if 007 landed first)
- **Category**: docs
- **Planned at**: commit `fb2c1ca`, 2026-06-19
- **Findings**: DOCS-01, DOCS-02, DOCS-03

## Why this matters

Documentation still has drift from the post-shadcn revamp and the recent QuickMeaning runtime fixes. Contributors following README will still see `MUI` in the keyword list even though `AGENTS.md` says no MUI and `rg "@mui/" src` returns zero matches. `AGENTS.md` says QuickMeaning uses HoverCard, but implementation uses a Base UI/shadcn-style **Popover** anchored to `.lexicon` spans with custom hover timers.

The plans index already reflects most post-revamp work, but after plan 035 lands it should also mention the small Next 16 readiness tranche so future agents know why image quality config and `next lint` migration work exists.

## Current state

**DOCS-01** — `README.md` line 13 as of `fb2c1ca`:

```md
Keywords: Next.js, TypeScript, MUI, Redux, SWR, Free Dictionary API, OpenAI.
```

MUI is stale. The README also lists npm/yarn/pnpm/bun equally even though this repo has a `pnpm-lock.yaml`; prefer pnpm first and keep alternatives only as secondary if desired.

**DOCS-02** — `AGENTS.md` line 45:

```
- **QuickMeaning**: HoverCard on `.lexicon` spans with dictionary + optional AI fallback
```

Live code (`src/components/organisms/ResultPage/QuickMeaning.tsx:8` and lines 144–153 as of `fb2c1ca`):

```tsx
import { Popover, PopoverContent } from '@/components/ui/popover';
// ...
<Popover open={Boolean(hoveredTextElement)}>
    <PopoverContent
        anchor={hoveredTextElement}
        ref={popoverContentRef}
        initialFocus={false}
        onMouseEnter={clearCloseTimer}
        onMouseLeave={scheduleResetMenu}
    >
```

**DOCS-03** — `plans/README.md` should stay aligned with the actual execution table. It currently says plans 001–006 are complete and 007+ are TODO; when plan 035 is added, include it in the execution table and findings map.

## Commands you will need

| Purpose | Command            | Expected on success |
|---------|--------------------|---------------------|
| MUI     | `rg "@mui/" src`   | 0 matches           |
| Lint    | `pnpm lint`        | exit 0              |
| Build   | `pnpm build`       | exit 0              |

## Scope

**In scope**:
- `README.md`
- `AGENTS.md`
- `plans/README.md` — intro paragraph only (status table maintained by advisor/executors)
- Any small docs mention added by plan 035 if it lands first

**Out of scope**:
- Rewriting all plan files 001–006
- Marketing copy on HomePage
- Implementing plan 007/035 code changes; this is docs-only

## Git workflow

- Branch: `advisor/009-docs-sync`
- Commit: `Update README and AGENTS for post-shadcn stack`

## Steps

### Step 1: Update README.md

- Replace MUI/Supabase/favorites references with current stack: Next.js 15, shadcn, Tailwind v4, SWR, Redux (session cache only).
- Prefer `pnpm` in install/run examples (match `pnpm-lock.yaml`).
- Update "Last updated" date to 2026-06-19 or the execution date.
- Remove or soften Udemy tutorial framing if stale — keep brief project description.
- Keep the product truth from the current README: stateless, no login/account/persistence, Free Dictionary first, OpenAI labeled fallback.

**Verify**: `rg -i "mui|supabase|favorite" README.md` → 0 matches (or only historical "removed" note if needed)

### Step 2: Fix AGENTS.md QuickMeaning line

Change to:
```
- **QuickMeaning**: Popover anchored to `.lexicon` spans with dictionary + optional AI fallback; hover timing is managed in `QuickMeaning.tsx` + `useOnHoveredText`
```

If plan 007 added typecheck/test to verification block, ensure those lines remain.

**Verify**: `rg "HoverCard" AGENTS.md` → 0 matches in QuickMeaning context

### Step 3: Refresh plans/README intro

Ensure the intro stays aligned with the current plan set, e.g.:
```
Post-shadcn revamp (plans 001–006 DONE). Plans 007+ address correctness, security, performance, and DX from the post-revamp audit.
```

If plan 035 exists, add it to the execution table and findings map if the advisor has not already done so. Do not reorder completed rows.

**Verify**: read intro — no "alongside existing MUI"; `rg "035" plans/README.md` shows the row if plan 035 exists.

## Test plan

- Doc-only — no automated tests.
- Manual: README install steps use pnpm; AGENTS matches `QuickMeaning.tsx` imports.
- Run `pnpm lint` and `pnpm build` as sanity gates because docs changes can touch Markdown only but the repo's normal verification expects both.

## Done criteria

- [ ] README has no stale MUI/Supabase-as-feature references
- [ ] AGENTS.md documents Popover for QuickMeaning
- [ ] plans/README intro reflects post-MUI state and includes plan 035 if present
- [ ] `rg "@mui/" src` returns 0 matches
- [ ] `pnpm lint` and `pnpm build` exit 0
- [ ] `plans/README.md` row 009 → DONE

## STOP conditions

- README rewrite uncovers missing env/docs that belong in plan 008 — note and continue; don't block on 008.
- Product owner wants to keep Udemy tutorial framing — stop and ask.

## Maintenance notes

- When QuickMeaning switches back to HoverCard (if ever), update AGENTS in the same PR.
- Plan 007 may also touch AGENTS verification — coordinate to avoid merge conflicts.
