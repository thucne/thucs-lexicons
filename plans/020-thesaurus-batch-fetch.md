# Plan 020: Batch thesaurus dictionary fetches

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- src/components/molecules/Thesaurus/index.tsx src/utils/index.ts`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/012-thesaurus-empty-guard.md, plans/011-dictionary-uri-encoding.md
- **Category**: perf
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: PERFORMANCE-01

## Why this matters

`Thesaurus` calls `toThesaurusItems` twice in parallel (antonyms + synonyms), each invoking `getFreeDictionaryLexicons` which fires **one HTTP request per word** (up to 5 each → 10 parallel). Duplicate words across lists fetch twice. Free Dictionary API has no native batch endpoint — dedupe and single `Promise.all` reduces calls.

## Current state

`Thesaurus/index.tsx` (lines 43–46):

```ts
const [nextAntonyms, nextSynonyms] = await Promise.all([
    toThesaurusItems(antonyms),
    toThesaurusItems(synonyms)
]);
```

`getFreeDictionaryLexicons` maps words to parallel fetches (`utils/index.ts:45-52`).

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Tests   | `pnpm test` | pass |
| Build   | `pnpm build` | exit 0 |

## Scope

**In scope**:
- `src/components/molecules/Thesaurus/index.tsx`
- `src/utils/index.ts` — optional `getFreeDictionaryLexiconsMap(words: string[])` returning `Map<string, SearchResults>`
- Tests with mocked fetch counting calls

**Out of scope**:
- Server-side caching layer
- Removing duplicate Thesaurus mounts (plan 021)

## Git workflow

- Branch: `advisor/020-thesaurus-batch-fetch`

## Steps

### Step 1: Refactor to single deduped word list

```ts
const allWords = [...new Set([...antonyms, ...synonyms].slice(0, 5))];
const lexiconMap = await fetchLexiconMap(allWords);
```

Split back into antonym/synonym lists preserving order.

### Step 2: Preserve slice(0, 5) per list semantics

Document: max 5 per type, but shared dedupe across both lists for fetch.

**Verify**: test — overlapping synonym/antonym word triggers 1 fetch not 2

### Step 3: Keep empty guards from plan 012

**Verify**: `pnpm test -- Thesaurus` → pass

## Test plan

- Mock fetch: 3 unique words in antonyms+synonyms with overlap → 3 calls max
- Empty words skipped

## Done criteria

- [ ] Duplicate words across antonym/synonym lists fetch once
- [ ] Fetch count test passes
- [ ] `plans/README.md` row 020 → DONE

## STOP conditions

- Thesaurus removed in favor of sidebar-only related words — stop and re-scope.

## Maintenance notes

- If Free Dictionary adds batch API later, replace map builder.
