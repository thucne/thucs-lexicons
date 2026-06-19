# Plan 026: Delete orphan MeaningGroup component

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- src/components/organisms/ResultPage/MeaningGroup.tsx src/components/organisms/ResultPage/index.tsx`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: tech-debt
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: DEBT-02

## Why this matters

`MeaningGroup.tsx` was the pre-revamp result layout. `ResultPage/index.tsx` now uses `ResultHero`, `ResultDefinitions`, and `MeaningComponent` directly. `MeaningGroup` is not imported anywhere — dead ~65 lines.

## Current state

`rg "MeaningGroup" src` → only `MeaningGroup.tsx` itself.

`ResultPage/index.tsx` imports `MeaningComponent` from `@/components/molecules/Meaning`, not MeaningGroup.

File still exists at `src/components/organisms/ResultPage/MeaningGroup.tsx` with shadcn-ish markup (post partial migration).

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Grep    | `rg "MeaningGroup" src` | 0 matches |
| Build   | `pnpm build` | exit 0 |

## Scope

**In scope**:
- Delete `src/components/organisms/ResultPage/MeaningGroup.tsx`

**Out of scope**:
- ResultPage layout changes
- molecules/Meaning (different file)

## Git workflow

- Branch: `advisor/026-delete-meaning-group`

## Steps

### Step 1: Confirm no imports

`rg "MeaningGroup" .` excluding plans

### Step 2: Delete file

**Verify**: `pnpm build` → exit 0

## Test plan

- Build gate only

## Done criteria

- [ ] `MeaningGroup.tsx` deleted
- [ ] No references remain in `src/`
- [ ] `plans/README.md` row 026 → DONE

## STOP conditions

- MeaningGroup re-imported in branch — stop and report.

## Maintenance notes

- None — component fully superseded.
