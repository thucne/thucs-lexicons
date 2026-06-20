# Plan 022: Remove direct lodash dependency from app code

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat fb2c1ca..HEAD -- src/app/api/og/route.tsx src/hooks/use-listener.tsx package.json pnpm-lock.yaml`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/007-verification-baseline.md (for tests)
- **Category**: security
- **Planned at**: commit `fb2c1ca`, 2026-06-19
- **Findings**: SECURITY-05, PERFORMANCE-03

## Why this matters

`pnpm audit --json` on 2026-06-19 reported direct `lodash@4.17.21` advisories, including high-severity template/imports code-injection pressure and moderate prototype-pollution advisories. This app only uses lodash in two tiny places: `_.max` in the edge OG route and `debounce` in `use-listener.tsx`. Removing the direct dependency is cheaper and lower-risk than carrying audit noise or waiting for a patched lodash line.

There is also a performance benefit: `/api/og` runs on the **edge** (`export const runtime = 'edge'`) and should not bundle a general-purpose utility library for one `Math.max` operation.

## Current state

`src/app/api/og/route.tsx` (lines 1–3 and 32–39 as of `fb2c1ca`):

```ts
import { ImageResponse } from 'next/og';
import { DYNAMIC_OG_BG } from '@/constants';
import _ from 'lodash';
// ...
const trueLength = _.max([0, n - appendix.length]) || 0;
```

`src/hooks/use-listener.tsx` (line 3 as of `fb2c1ca`) imports lodash debounce:

```ts
import { debounce, type DebouncedFunc } from 'lodash';
```

`package.json` has both runtime and type dependencies:

```json
"lodash": "^4.17.21"
// ...
"@types/lodash": "^4.17.0"
```

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Typecheck | `pnpm typecheck` | exit 0 (after plan 007) |
| Tests   | `pnpm test -- smart-trim listener` | pass (after plan 007) |
| Build   | `pnpm build` | exit 0 |
| Lint    | `pnpm lint` | exit 0 |
| Grep    | `rg "lodash|@types/lodash" src package.json` | no app/package direct matches after removal |

## Scope

**In scope**:
- `src/app/api/og/route.tsx`
- `src/app/api/og/smart-trim.test.ts` (create) — test extracted helper
- `src/hooks/use-listener.tsx`
- `src/hooks/use-listener.test.tsx` or `src/hooks/debounce.test.ts` (create only if plan 007 landed and the debounce helper is extracted)
- `package.json`
- `pnpm-lock.yaml`

**Out of scope**:
- Transitive `lodash.merge` under dependencies; this plan removes the direct `lodash` package only.
- Rewriting all hover behavior in QuickMeaning. Preserve the current behavior and only replace the debounce utility.
- Replacing eslint or unrelated audit findings (plan 031).

## Git workflow

- Branch: `advisor/022-remove-lodash`

## Steps

### Step 1: Replace _.max with Math.max

```ts
const trueLength = Math.max(0, n - appendix.length);
```

Remove lodash import.

### Step 2: Extract smartTrim to testable pure function

Move to `src/app/api/og/smart-trim.ts` or `src/utils/smart-trim.ts`.

**Verify**: tests match previous behavior for long strings, word boundaries

### Step 3: Replace lodash debounce in use-listener

Either:

1. Add a tiny local helper in `src/hooks/use-listener.tsx`, or
2. Create `src/utils/debounce.ts` if reuse is clearer.

The helper must support the current usage:

```ts
type Debounced<T extends (...args: never[]) => void> = ((...args: Parameters<T>) => void) & {
    cancel: () => void;
};
```

The behavior to preserve:

- `useHoveredText` delays `mouseover` when `options.delay` is set.
- `useHoveredText` can delay `mouseout` only when `delayOnLeave && delay`.
- `useOnHoveredText` cancels a pending enter when the cursor leaves a `.lexicon` before the delay expires.
- Cleanup removes the exact listeners added and cancels pending debounced callbacks.

Do not change QuickMeaning's public behavior in this plan.

**Verify**: `pnpm typecheck` → exit 0. If tests exist after plan 007, add timer-based tests with fake timers and verify `pnpm test -- listener` → pass.

### Step 4: Remove lodash dependency

Run:

```bash
rg "lodash|@types/lodash" src package.json
```

Expected after code edits but before package cleanup: matches only in `package.json`.

Then remove `lodash` and `@types/lodash` from `package.json` and update `pnpm-lock.yaml` using `pnpm install` or `pnpm remove lodash @types/lodash`.

**Verify**:

- `rg "from 'lodash'|from \"lodash\"|@types/lodash|\"lodash\"" src package.json` → 0 matches.
- `pnpm lint && pnpm typecheck && pnpm test && pnpm build` → all exit 0 after plan 007. If plan 007 has not landed, run `pnpm lint && pnpm build`.

### Step 5: Re-run audit and document residual transitive findings

Run `pnpm audit --json`. If transitive lodash-like findings remain through other packages but direct `lodash` is gone, do not chase them in this plan; record the residual package path in the completion note for `plans/README.md`.

## Test plan

- `smartTrim('hello world', 5)` → truncated with appendix
- Short string unchanged
- Debounce helper delays callback until timeout
- Debounce helper `.cancel()` prevents pending callback
- `useOnHoveredText` listener cleanup still cancels pending hover

## Done criteria

- [ ] OG route has no lodash import
- [ ] `use-listener.tsx` has no lodash import
- [ ] smartTrim tests pass
- [ ] Debounce/helper tests pass if plan 007 landed
- [ ] `package.json` has no `lodash` or `@types/lodash`
- [ ] `pnpm-lock.yaml` is updated consistently
- [ ] `rg "from 'lodash'|from \"lodash\"|@types/lodash|\"lodash\"" src package.json` returns 0 matches
- [ ] `pnpm audit --json` no longer reports direct `.>lodash`; residual transitive audit findings are documented
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` pass after plan 007
- [ ] `pnpm build` exits 0
- [ ] `plans/README.md` row 022 → DONE

## STOP conditions

- More lodash imports appear outside `src/app/api/og/route.tsx` and `src/hooks/use-listener.tsx` — stop and report; do not broaden the refactor silently.
- Removing lodash requires changing QuickMeaning semantics, hover timing, or public UI behavior — stop and report.
- `pnpm audit --json` still reports direct `.>lodash` after package removal — stop and investigate lockfile/package drift.

## Maintenance notes

- Edge bundle analyzer optional on Vercel — confirm size drop for `/api/og`.
- If future code needs debounce, prefer the local helper or a small purpose-built package over reintroducing full lodash.
