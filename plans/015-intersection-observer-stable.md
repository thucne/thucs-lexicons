# Plan 015: Stabilize IntersectionObserver subscription

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- src/hooks/use-intersection-observer.tsx src/components/molecules/Meaning/index.tsx`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/007-verification-baseline.md
- **Category**: bug
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: CORRECTNESS-06

## Why this matters

`useIntersectionStatus` lists `options` in the effect dependency array. Callers pass inline objects (`{ threshold: 0.5, unobserveOnIntersect: true }`), so the effect re-runs every render — disconnecting and reconnecting the observer. Thesaurus lazy-load may re-fetch or flicker.

## Current state

`src/hooks/use-intersection-observer.tsx` (lines 12–33):

```ts
useEffect(() => {
    // ... observer setup ...
}, [ref, options]);
```

`src/components/molecules/Meaning/index.tsx` (line 18):

```ts
const isIntersecting = useIntersectionStatus(meaningRef, { threshold: 0.5, unobserveOnIntersect: true });
```

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Tests   | `pnpm test` | pass |
| Build   | `pnpm build` | exit 0 |

## Scope

**In scope**:
- `src/hooks/use-intersection-observer.tsx`
- `src/components/molecules/Meaning/index.tsx` — hoist options to module-level constant
- `src/hooks/use-intersection-observer.test.tsx` (create) — optional with @testing-library/react

**Out of scope**:
- Thesaurus fetch logic (plans 020–021)

## Git workflow

- Branch: `advisor/015-intersection-observer-stable`

## Steps

### Step 1: Stabilize options in hook

Serialize options for deps:

```ts
const { threshold = 0, root = null, rootMargin = '0px', unobserveOnIntersect } = options;
useEffect(() => {
    ...
}, [ref, threshold, root, rootMargin, unobserveOnIntersect]);
```

Or use `useMemo` on caller side — prefer hook-internal fix.

### Step 2: Hoist constant in Meaning/index.tsx

```ts
const MEANING_IO_OPTIONS = { threshold: 0.5, unobserveOnIntersect: true } as const;
```

**Verify**: `pnpm typecheck` → exit 0

### Step 3: Test observer not recreated every render

With `@testing-library/react`, render a component using the hook, rerender parent, assert `IntersectionObserver` mock constructor call count === 1.

**Verify**: `pnpm test -- intersection` → pass

## Test plan

- Observer instantiated once across two parent re-renders (mock `global.IntersectionObserver`)

## Done criteria

- [ ] Effect deps do not include unstable `options` object reference
- [ ] Meaning component uses stable options constant
- [ ] `pnpm build` exits 0
- [ ] `plans/README.md` row 015 → DONE

## STOP conditions

- No test runner from plan 007 — add minimal mock test or stop after hook fix with manual verify note.

## Maintenance notes

- Callers must pass stable options or primitives — document in hook JSDoc.
