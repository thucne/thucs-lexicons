# Plan 018: Bound and encode OG image route query parameters

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat fb2c1ca..HEAD -- src/app/api/og/route.tsx src/app/search/[word]/page.tsx`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/007-verification-baseline.md
- **Category**: security
- **Planned at**: commit `fb2c1ca`, 2026-06-19
- **Findings**: SECURITY-03, CORRECTNESS-07

## Why this matters

`/api/og` accepts unbounded `word` and `definition` query strings. Attackers can request megabyte strings → edge memory/CPU abuse, slow ImageResponse generation. Metadata already passes definition from dictionary but URLs can be crafted directly.

The metadata caller also builds the Open Graph image URL with raw `word` in the query string. For `/search/break%20the%20ice` or words containing `&`, `?`, `#`, etc., this can produce malformed or ambiguous `/api/og?word=...` URLs even though the `definition` parameter is encoded.

## Current state

`src/app/api/og/route.tsx` (lines 42–47 as of `fb2c1ca`):

```ts
const word = searchParams.get('word') ?? 'Hello, World!';
const definition = searchParams.get('definition') || '';
const trimmedDefinition = smartTrim(definition, 150, ' ', '... Learn more.');
```

`smartTrim` caps display to 150 chars but **full strings are still held in memory** before trim. No max length on `word`.

Caller `src/app/search/[word]/page.tsx` (lines 29–33 as of `fb2c1ca`) passes raw `word` but encoded definition:

```ts
url: `/api/og?word=${word}&definition=${
    hasDictionaryResult
        ? encodeURIComponent(getFirstDefinition(results))
        : 'Open Lexicons to explore this entry'
}`,
```

That should use `URLSearchParams` or encode both query parameter values.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Tests   | `pnpm test -- og` | pass |
| Build   | `pnpm build` | exit 0 |
| Lint    | `pnpm lint` | exit 0 |

## Scope

**In scope**:
- `src/app/api/og/route.tsx`
- `src/app/api/og/route.test.ts` (create)
- `src/app/search/[word]/page.tsx` metadata builder

**Out of scope**:
- lodash removal (plan 022)
- OG image design changes
- SEO sitemap expansion (plan 033)

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

Apply limits before calling `smartTrim`, `calculateFontSize`, or `ImageResponse`. Keep the default word (`Hello, World!`) behavior for a missing `word` query parameter.

**Verify**: if plan 007 has landed, `pnpm test -- og` includes an over-limit `word` case returning 400. If plan 007 has not landed, run `pnpm build` and manually inspect that validation happens before `ImageResponse`.

### Step 2: Return 400 for abuse, 200 for normal

**Verify**: test 10_000 char word → 400

### Step 3: Align metadata caller

In `src/app/search/[word]/page.tsx`, build the OG image URL through `URLSearchParams` so both `word` and `definition` are encoded:

```ts
const ogParams = new URLSearchParams({
    word: decodedWord.slice(0, MAX_METADATA_OG_WORD),
    definition: hasDictionaryResult
        ? getFirstDefinition(results).slice(0, MAX_METADATA_OG_DEFINITION)
        : 'Open Lexicons to explore this entry'
});

url: `/api/og?${ogParams.toString()}`;
```

Use local constants in this file or export shared constants from a small OG utility if plan 018 also extracts validation. Do not import the route handler into page metadata.

**Verify**: `pnpm build` → exit 0

### Step 4: Add focused tests when the test runner exists

After plan 007, create tests for:

- `word=break the ice` metadata URL contains `word=break+the+ice` or `word=break%20the%20ice`, not raw spaces.
- `word=a&b` metadata URL encodes the ampersand inside the value.
- `/api/og` returns 400 for an over-limit `word`.

**Verify**: `pnpm test -- og` → pass.

## Test plan

- word within limit → 200 (mock ImageResponse if needed)
- word over limit → 400
- definition 10k chars → trimmed/rejected without throw
- metadata URL for `break the ice` / `a&b` keeps query parameters intact

## Done criteria

- [ ] OG route enforces max query param lengths
- [ ] Metadata caller encodes both `word` and `definition` with `URLSearchParams` or equivalent
- [ ] Tests cover oversize input
- [ ] Tests cover special-character metadata URL encoding after plan 007
- [ ] `pnpm lint` and `pnpm build` exit 0
- [ ] `plans/README.md` row 018 → DONE

## STOP conditions

- ImageResponse cannot be unit tested — test validation layer only.
- Encoding the metadata URL requires changing metadata behavior outside `src/app/search/[word]/page.tsx` — stop and report.

## Maintenance notes

- Keep limits in sync with `calculateFontSize` thresholds.
