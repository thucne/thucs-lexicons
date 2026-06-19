# Plan 010: Return proper HTTP errors from OpenAI routes

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- src/app/api/openai/search/route.ts src/app/api/openai/search/has-meaning/route.ts`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: MED
- **Depends on**: plans/007-verification-baseline.md
- **Category**: bug
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: CORRECTNESS-01

## Why this matters

Both OpenAI API routes catch all errors and return `{}` with HTTP 200. Callers (`useLexiconWithAI`, `hasDefinition`) cannot distinguish "no definition" from "API down", "rate limited", or "invalid key". Users see silent empty states; SWR caches `{}` as success. Proper status codes let the UI show errors and avoid treating failures as empty results.

## Current state

`src/app/api/openai/search/route.ts` (lines 179–183, 204–208):

```ts
    } catch (error) {
        console.error('Error during OpenAI search:', error);
        return {};
    }
// ...
    const result = await search(input);
    return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
    });
```

Same pattern in `has-meaning/route.ts` (lines 56–58, 80–84).

Input validation already returns 400 for missing/oversized input (good).

SWR fetcher (`use-lexicon.tsx:10`): `fetch(url).then((res) => res.json())` — ignores status (fixed in plan 027; this plan should still return correct HTTP codes).

## Commands you will need

| Purpose   | Command                  | Expected on success |
|-----------|--------------------------|---------------------|
| Typecheck | `pnpm typecheck`         | exit 0              |
| Tests     | `pnpm test`              | exit 0              |
| Lint      | `pnpm lint`              | exit 0              |
| Build     | `pnpm build`             | exit 0              |

## Scope

**In scope**:
- `src/app/api/openai/search/route.ts`
- `src/app/api/openai/search/has-meaning/route.ts`
- `src/app/api/openai/search/route.test.ts` (create) — route handler unit tests
- `src/app/api/openai/search/has-meaning/route.test.ts` (create) — optional if shared helper

**Out of scope**:
- Rate limiting (plan 016)
- Missing API key guard (plan 017)
- SWR fetcher changes (plan 027) — but note coordination
- OpenAI schema/prompt alignment (plan 014)

## Git workflow

- Branch: `advisor/010-openai-error-responses`
- Commit: `Return HTTP errors from OpenAI search routes`

## Steps

### Step 1: Refactor search helpers to throw or return Result

In both route files, change `search()` catch blocks to **re-throw** or return a discriminated union. Prefer pattern:

```ts
} catch (error) {
    console.error('Error during OpenAI search:', error);
    throw error;
}
```

In `GET`, wrap:

```ts
try {
    const result = await search(input);
    return Response.json(result);
} catch {
    return Response.json({ error: 'Failed to fetch definition.' }, { status: 502 });
}
```

Use 503 if OpenAI rate-limits (detect `error.status === 429` if OpenAI SDK exposes it).

**Verify**: `pnpm typecheck` → exit 0

### Step 2: Distinguish empty valid response from error

When OpenAI returns valid JSON `{}` or `{ definitions: [] }` intentionally (gibberish input), still return **200** — only transport/SDK failures get 5xx.

**Verify**: manual reasoning + test in step 3

### Step 3: Add route tests with mocked OpenAI

Use Vitest to mock `openai` module. Test cases:
- Missing input → 400
- SDK throws → 502 (not 200 with `{}`)
- Successful parse → 200 with body

**Verify**: `pnpm test -- openai` → all pass

### Step 4: Smoke-check ResultPage behavior

With fetcher still ignoring status, 502 may still show empty state — document in PR that plan 027 completes the client story. No ResultPage changes in this plan.

**Verify**: `pnpm build` → exit 0

## Test plan

- New tests in `src/app/api/openai/search/route.test.ts`:
  - happy path 200
  - SDK error → 502
  - empty input → 400
- Model after Vitest patterns from plan 007 smoke test.

## Done criteria

- [ ] OpenAI routes never return 200 with `{}` on SDK/network failure
- [ ] `pnpm test` includes OpenAI route regression tests
- [ ] `pnpm build` exits 0
- [ ] `plans/README.md` row 010 → DONE

## STOP conditions

- OpenAI SDK error shape differs from docs — stop with sample error object.
- Tests require e2e because route handlers can't be unit-tested — propose `next-test-api-route-handler` and stop.

## Maintenance notes

- Plan 027 must update SWR fetcher to throw on `!res.ok` so UI reacts to these statuses.
- Plan 016 rate limits should return 429 with consistent `{ error }` shape.
