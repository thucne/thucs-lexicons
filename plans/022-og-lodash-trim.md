# Plan 022: Replace lodash in OG route with native trim

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- src/app/api/og/route.tsx package.json`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/018-og-input-bounds.md (recommended)
- **Category**: perf
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: PERFORMANCE-03

## Why this matters

OG route runs on the **edge** (`export const runtime = 'edge'`). It imports full `lodash` for `_.max` in `smartTrim` — unnecessary bundle weight on a cold edge function. Native `Math.max` suffices.

## Current state

`src/app/api/og/route.tsx`:

```ts
import _ from 'lodash';
// ...
const trueLength = _.max([0, n - appendix.length]) || 0;
```

`lodash` is also a direct dependency in `package.json` — check other usages before removing package entirely.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Build   | `pnpm build` | exit 0 |
| Grep    | `rg "from 'lodash'" src` | note remaining imports |

## Scope

**In scope**:
- `src/app/api/og/route.tsx`
- `src/app/api/og/smart-trim.test.ts` (create) — test extracted helper
- `package.json` — remove `lodash` / `@types/lodash` if no other imports

**Out of scope**:
- lodash audit warnings unrelated to OG (see plan 031)

## Git workflow

- Branch: `advisor/022-og-lodash-trim`

## Steps

### Step 1: Replace _.max with Math.max

```ts
const trueLength = Math.max(0, n - appendix.length);
```

Remove lodash import.

### Step 2: Extract smartTrim to testable pure function

Move to `src/app/api/og/smart-trim.ts` or `src/utils/smart-trim.ts`.

**Verify**: tests match previous behavior for long strings, word boundaries

### Step 3: Remove lodash dependency if unused

`rg "lodash" src` → if 0, `pnpm remove lodash @types/lodash`

**Verify**: `pnpm build` → exit 0

## Test plan

- `smartTrim('hello world', 5)` → truncated with appendix
- Short string unchanged

## Done criteria

- [ ] OG route has no lodash import
- [ ] smartTrim tests pass
- [ ] `pnpm build` exits 0
- [ ] `plans/README.md` row 022 → DONE

## STOP conditions

- Other files still import lodash — only remove from OG route, keep dependency.

## Maintenance notes

- Edge bundle analyzer optional on Vercel — confirm size drop.
