# Plan 027: Make SWR fetcher respect HTTP status

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- src/hooks/use-lexicon.tsx`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: MED
- **Depends on**: plans/010-openai-error-responses.md
- **Category**: tech-debt
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: DEBT-03

## Why this matters

Shared fetcher (`use-lexicon.tsx:10`):

```ts
const fetcher = (url: string) => fetch(url).then((res) => res.json());
```

404 dictionary responses (JSON error body) and 502 AI errors parse as "data". SWR treats them as success — `useLexicon` may get non-array JSON; `useLexiconWithAI` may get `{ error: '...' }` without triggering error state.

## Current state

`ResultPage` guards with `Array.isArray(resultsFromFetchRaw)` (line 145) — partial mitigation.

`useLexiconWithAICheck` duplicate fetcher (line 36) — remove if plan 025 deletes hook.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Tests   | `pnpm test -- use-lexicon` | pass |
| Build   | `pnpm build` | exit 0 |

## Scope

**In scope**:
- `src/hooks/use-lexicon.tsx` — shared `jsonFetcher` with status check
- `src/hooks/use-lexicon.test.ts` (create)
- `ResultPage/index.tsx` — only if needed to read `error` from SWR

**Out of scope**:
- Changing API route status codes (plan 010)

## Git workflow

- Branch: `advisor/027-swr-fetcher-status`

## Steps

### Step 1: Implement jsonFetcher

```ts
async function jsonFetcher<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed: ${res.status}`);
    }
    return res.json();
}
```

### Step 2: Wire all useSWR hooks to jsonFetcher

### Step 3: Surface AI errors in ResultPage (minimal)

When `useLexiconWithAI` returns `error` and dictionary empty, show `ResultEmptyState` or error variant — read `result-states.tsx`.

**Verify**: mock 502 → SWR `error` defined, not fake data

## Test plan

- jsonFetcher: 200 → json; 502 → throws
- useLexicon with mock fetch 404 → error state

## Done criteria

- [ ] Fetcher throws on `!res.ok`
- [ ] ResultPage does not treat error JSON as results
- [ ] Tests pass
- [ ] `plans/README.md` row 027 → DONE

## STOP conditions

- Dictionary 404 returns 200 with array in API — verify actual Free Dictionary behavior (404 JSON object) before changing empty detection.

## Maintenance notes

- Align error message shape with plan 010 `{ error: string }`.
