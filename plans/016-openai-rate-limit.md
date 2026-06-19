# Plan 016: Harden OpenAI proxy with rate limiting

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- src/app/api/openai/search/route.ts src/app/api/openai/search/has-meaning/route.ts`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/007-verification-baseline.md, plans/010-openai-error-responses.md
- **Category**: security
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: SECURITY-01

## Why this matters

`/api/openai/search` and `/api/openai/search/has-meaning` are **unauthenticated public proxies** to OpenAI. Anyone can burn API quota and cost money. No per-IP or per-session rate limits exist.

## Current state

Both routes export `GET` handlers with only input length validation (100 chars). No auth middleware, no rate limit headers.

Deployment target: Vercel (Next.js 15). Options: `@upstash/ratelimit` + Redis, Vercel KV, or in-memory limiter (weak on serverless — document limitation).

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Tests   | `pnpm test` | pass |
| Build   | `pnpm build` | exit 0 |

## Scope

**In scope**:
- `src/lib/rate-limit.ts` (create) — shared limiter helper
- `src/app/api/openai/search/route.ts`
- `src/app/api/openai/search/has-meaning/route.ts`
- `.env.example` — add `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` if using Upstash
- Tests for limiter helper

**Out of scope**:
- User authentication (intentionally removed — see rejected findings)
- Bot detection / CAPTCHA
- OpenAI API key guard (plan 017)

## Git workflow

- Branch: `advisor/016-openai-rate-limit`

## Steps

### Step 1: Choose rate-limit backend

Preferred for Vercel: `@upstash/ratelimit` + `@upstash/redis` with env vars. Fallback for local dev: no-op limiter when env missing + console warn.

Suggested limits: 10 requests / minute / IP for AI routes.

### Step 2: Implement shared helper

```ts
export async function rateLimitOrThrow(request: Request, key: string): Promise<void>
```

Use `x-forwarded-for` or `request.headers.get('x-real-ip')` for IP.

Return 429 JSON `{ error: 'Too many requests.' }` with `Retry-After` header.

### Step 3: Apply to both OpenAI routes

At start of `GET`, before OpenAI call:

```ts
const limited = await rateLimitOrThrow(request, 'openai-search');
if (limited) return limited;
```

**Verify**: `pnpm test` → pass including 429 case

### Step 4: Document env vars in .env.example (coordinate plan 008)

**Verify**: `pnpm build` → exit 0

## Test plan

- Unit test: under limit → allow; over limit → 429
- Mock Redis for CI

## Done criteria

- [ ] Both OpenAI routes return 429 when limit exceeded
- [ ] Rate limit works per IP (or documented alternative)
- [ ] Tests cover limit breach
- [ ] `plans/README.md` row 016 → DONE

## STOP conditions

- Operator forbids external Redis — stop and propose Vercel WAF-only mitigation doc.
- Upstash not available — use `@vercel/kv` if project already linked.

## Maintenance notes

- Tune limits after production metrics.
- Plan 032 (has-meaning gate) adds another OpenAI call path — same limiter bucket or separate key.
