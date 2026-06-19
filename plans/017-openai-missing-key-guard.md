# Plan 017: Guard OpenAI routes when API key is missing

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- src/app/api/openai/search/route.ts src/app/api/openai/search/has-meaning/route.ts`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/010-openai-error-responses.md
- **Category**: security
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: SECURITY-02

## Why this matters

Routes instantiate `OpenAI` at module load with `process.env.OPENAI_API_KEY` which may be `undefined`. Requests fail at runtime with opaque SDK errors (then `{}` until plan 010). Fail fast with **503 Service Unavailable** and clear message so deploy misconfig is obvious.

## Current state

Both route files:

```ts
const API_KEY = process.env.OPENAI_API_KEY;
const openAI = new OpenAI({ apiKey: API_KEY });
```

No guard before `openAI.chat.completions.create`.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Tests   | `pnpm test -- openai` | pass |
| Build   | `pnpm build` | exit 0 |

## Scope

**In scope**:
- `src/app/api/openai/search/route.ts`
- `src/app/api/openai/search/has-meaning/route.ts`
- `src/lib/openai-config.ts` (create) — shared `getOpenAIClient()` with guard
- Route tests with env mock

**Out of scope**:
- Client-side AI fallback UX (ResultPage already handles empty)

## Git workflow

- Branch: `advisor/017-openai-missing-key-guard`

## Steps

### Step 1: Create getOpenAIClient helper

```ts
export function getOpenAIClient(): OpenAI {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new MissingOpenAIKeyError();
    }
    return new OpenAI({ apiKey });
}
```

### Step 2: Handle in GET handlers

Map `MissingOpenAIKeyError` → 503 `{ error: 'AI search is not configured.' }`

Lazy-init client per request (not module scope) to allow tests to set env.

**Verify**: test with unset `OPENAI_API_KEY` → 503

### Step 3: Update .env.example note

Document that AI routes return 503 without key.

**Verify**: `pnpm build` → exit 0

## Test plan

- Env missing → 503, body contains `not configured`
- Env set + mock SDK → 200 path unchanged

## Done criteria

- [ ] No OpenAI SDK call when `OPENAI_API_KEY` unset
- [ ] 503 response with stable error shape
- [ ] Tests pass
- [ ] `plans/README.md` row 017 → DONE

## STOP conditions

- Build-time env inlining requires different pattern on Vercel — stop with platform note.

## Maintenance notes

- Never log or return the actual key value in errors.
