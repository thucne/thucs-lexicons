# Plan 018: Bound OG image route query parameters

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- src/app/api/og/route.tsx src/app/search/[word]/page.tsx`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/007-verification-baseline.md
- **Category**: security
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: SECURITY-03

## Why this matters

`/api/og` accepts unbounded `word` and `definition` query strings. Attackers can request megabyte strings → edge memory/CPU abuse, slow ImageResponse generation. Metadata already passes definition from dictionary but URLs can be crafted directly.

## Current state

`src/app/api/og/route.tsx` (lines 42–47):

```ts
const word = searchParams.get('word') ?? 'Hello, World!';
const definition = searchParams.get('definition') || '';
const trimmedDefinition = smartTrim(definition, 150, ' ', '... Learn more.');
```

`smartTrim` caps display to 150 chars but **full strings are still held in memory** before trim. No max length on `word`.

Caller `search/[word]/page.tsx:29-32` passes `word` and encoded definition without server-side cap.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Tests   | `pnpm test -- og` | pass |
| Build   | `pnpm build` | exit 0 |

## Scope

**In scope**:
- `src/app/api/og/route.tsx`
- `src/app/api/og/route.test.ts` (create)
- Optionally cap in `search/[word]/page.tsx` metadata builder

**Out of scope**:
- lodash removal (plan 022)
- OG image design changes

## Git workflow

- Branch: `advisor/018-og-input-bounds`

## Steps

### Step 1: Add MAX_OG_WORD = 80, MAX_OG_DEFINITION = 500

Reject or slice before processing:

```ts
if (word.length > MAX_OG_WORD) {
    return new Response('word too long', { status: 400 });
}
const safeDefinition = definition.slice(0, MAX_OG_DEFINITION);
```

### Step 2: Return 400 for abuse, 200 for normal

**Verify**: test 10_000 char word → 400

### Step 3: Align metadata caller

Truncate definition in `generateMetadata` before building OG URL if needed.

**Verify**: `pnpm build` → exit 0

## Test plan

- word within limit → 200 (mock ImageResponse if needed)
- word over limit → 400
- definition 10k chars → trimmed/rejected without throw

## Done criteria

- [ ] OG route enforces max query param lengths
- [ ] Tests cover oversize input
- [ ] `plans/README.md` row 018 → DONE

## STOP conditions

- ImageResponse cannot be unit tested — test validation layer only.

## Maintenance notes

- Keep limits in sync with `calculateFontSize` thresholds.
