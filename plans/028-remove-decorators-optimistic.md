# Plan 028: Remove unused decorators and use-optimistic hook

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- tsconfig.json src/hooks/use-optimistic.tsx`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: tech-debt
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: DEBT-04

## Why this matters

`tsconfig.json` enables `experimentalDecorators: true` but no decorator usage exists in `src/`. `use-optimistic.tsx` is a custom hook never imported — React 19 has `useOptimistic` built-in if needed later.

## Current state

`tsconfig.json` line 24: `"experimentalDecorators": true`

`rg "decorator|@" src` → no decorator usage.

`src/hooks/use-optimistic.tsx` — 24 lines, `rg "use-optimistic|useOptimistic" src` → only self.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Typecheck | `pnpm typecheck` | exit 0 |
| Build   | `pnpm build` | exit 0 |

## Scope

**In scope**:
- `tsconfig.json` — remove `experimentalDecorators`
- Delete `src/hooks/use-optimistic.tsx`

**Out of scope**:
- Adopting React 19 `useOptimistic` for features

## Git workflow

- Branch: `advisor/028-remove-decorators-optimistic`

## Steps

### Step 1: Delete use-optimistic.tsx

### Step 2: Remove experimentalDecorators from tsconfig

**Verify**: `pnpm typecheck && pnpm build` → exit 0

## Test plan

- Build/typecheck gates only

## Done criteria

- [ ] No `use-optimistic.tsx`
- [ ] No `experimentalDecorators` in tsconfig
- [ ] `plans/README.md` row 028 → DONE

## STOP conditions

- Decorator found in excluded path — stop and list file.

## Maintenance notes

- Use React built-in `useOptimistic` from `react` if optimistic UI is needed.
