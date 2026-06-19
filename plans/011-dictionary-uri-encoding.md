# Plan 011: Encode dictionary API path segments

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- src/utils/index.ts`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/007-verification-baseline.md
- **Category**: bug
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: CORRECTNESS-02

## Why this matters

`hasDefinition` and `getFreeDictionaryLexicons` interpolate query words directly into URL paths without `encodeURIComponent`. Multi-word phrases (`break the ice`), slashes, or unicode can produce malformed requests or hit the wrong endpoint.

## Current state

`src/utils/index.ts`:

```ts
// line 18 — hasDefinition
const res = await fetch(`${FREE_DICTIONARY_API}/${query}`);

// line 47 — getFreeDictionaryLexicons
const response = await fetch(`${FREE_DICTIONARY_API}/${word}`);
```

Contrast: `use-lexicon.tsx:16` correctly uses `encodeURIComponent(word)`.

`FREE_DICTIONARY_API` = `https://api.dictionaryapi.dev/api/v2/entries/en` (`constants/index.ts:1`).

## Commands you will need

| Purpose   | Command                  | Expected on success |
|-----------|--------------------------|---------------------|
| Tests     | `pnpm test -- utils`     | all pass            |
| Typecheck | `pnpm typecheck`         | exit 0              |
| Build     | `pnpm build`             | exit 0              |

## Scope

**In scope**:
- `src/utils/index.ts`
- `src/utils/index.test.ts` (create)

**Out of scope**:
- `use-lexicon.tsx` (already encoded)
- Server page metadata fetch in `search/[word]/page.tsx` (already uses encodeURIComponent)

## Git workflow

- Branch: `advisor/011-dictionary-uri-encoding`

## Steps

### Step 1: Add encoding helper or inline encodeURIComponent

```ts
const dictionaryUrl = (word: string) =>
    `${FREE_DICTIONARY_API}/${encodeURIComponent(word)}`;
```

Replace both fetch URLs in `hasDefinition` and `getFreeDictionaryLexicons`.

**Verify**: `rg 'FREE_DICTIONARY_API}/\$\{' src/utils/index.ts` → 0 matches (no unencoded interpolation)

### Step 2: Add unit tests

Test `dictionaryUrl` or exported behavior with inputs:
- `break the ice` → `%20` in path
- `café` → encoded unicode
- `a/b` → slash encoded

Mock `fetch` if testing `hasDefinition` directly.

**Verify**: `pnpm test -- index.test` → pass

### Step 3: Manual check

Dev server: QuickMeaning hover on phrase with spaces in definition text — no regression.

**Verify**: `pnpm build` → exit 0

## Test plan

- `src/utils/index.test.ts` — encoding cases above
- Regression: existing `use-lexicon` path unchanged

## Done criteria

- [ ] All `FREE_DICTIONARY_API` fetches in `utils/index.ts` use `encodeURIComponent`
- [ ] Unit tests cover spaced and special-char queries
- [ ] `pnpm test` passes
- [ ] `plans/README.md` row 011 → DONE

## STOP conditions

- `hasDefinition` is deleted in plan 025 before this lands — re-scope to `getFreeDictionaryLexicons` only and report.

## Maintenance notes

- Any new dictionary fetch must use the shared `dictionaryUrl` helper — consider exporting it from `utils/index.ts`.
