# Plan 029: Tighten ResultPage search results typing

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- src/components/organisms/ResultPage/index.tsx`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/024-characterization-tests.md, plans/027-swr-fetcher-status.md
- **Category**: tech-debt
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: DEBT-05

## Why this matters

`ResultPage` uses unsafe assertion:

```ts
const results = (resultsFromStore || resultsFromFetch || resultsFromAI) as SearchResults | undefined;
```

(line 149). If fetcher returns malformed JSON, assertion hides type errors until runtime `.length` checks fail oddly.

## Current state

Partial guards exist:
- `resultsFromFetch = Array.isArray(resultsFromFetchRaw) ? resultsFromFetchRaw : undefined` (line 145)
- `resultsFromAI` array check (line 148)

Assertion still masks union narrowing gaps.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Typecheck | `pnpm typecheck` | exit 0 |
| Tests   | `pnpm test -- result-logic` | pass |

## Scope

**In scope**:
- `src/components/organisms/ResultPage/index.tsx`
- `src/components/organisms/ResultPage/result-logic.ts` (create if not from plan 024) — `pickSearchResults` with proper types
- Reuse from plan 024 if already extracted

**Out of scope**:
- Changing `SearchResult` type definition

## Git workflow

- Branch: `advisor/029-result-page-type-safety`

## Steps

### Step 1: Use pickSearchResults helper

```ts
function isSearchResults(value: unknown): value is SearchResults {
    return Array.isArray(value) && value.every((r) => typeof r?.word === 'string');
}
```

### Step 2: Remove `as SearchResults` assertion

```ts
const results = pickSearchResults({ ... });
```

**Verify**: `pnpm typecheck` → no `as SearchResults` in ResultPage

### Step 3: Align with plan 024 tests

**Verify**: `pnpm test` → pass

## Test plan

- Reuse characterization tests from plan 024

## Done criteria

- [ ] No unsafe `as SearchResults` in ResultPage
- [ ] Type guard or helper validates shape
- [ ] `pnpm typecheck` passes
- [ ] `plans/README.md` row 029 → DONE

## STOP conditions

- pickSearchResults not created in 024 — create in this plan.

## Maintenance notes

- Update guard when `SearchResult` fields change.
