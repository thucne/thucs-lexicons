# Plan 012: Guard Thesaurus against empty dictionary results

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- src/components/molecules/Thesaurus/index.tsx src/utils/index.ts`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/007-verification-baseline.md, plans/011-dictionary-uri-encoding.md (recommended)
- **Category**: bug
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: CORRECTNESS-03

## Why this matters

`toThesaurusItems` maps dictionary results assuming each entry is a non-empty array. When Free Dictionary returns 404 JSON (object, not array) or an empty array, `result[0].word` throws and breaks the Related words accordion.

## Current state

`src/components/molecules/Thesaurus/index.tsx` (lines 20–29):

```ts
const toThesaurusItems = async (words: string[]) => {
    const results = await getFreeDictionaryLexicons(words.slice(0, 5));

    return results.map(
        (result): ThesaurusItem => ({
            word: result[0].word,
            definition: getFirstDefinition(result),
            url: `/search/${encodeURIComponent(result[0].word)}`
        })
    );
};
```

`getFreeDictionaryLexicons` (`utils/index.ts:54–57`) filters to arrays only but **does not** filter empty arrays:

```ts
.filter((result): result is SearchResults => Array.isArray(result));
```

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Tests   | `pnpm test` | exit 0 |
| Build   | `pnpm build` | exit 0 |

## Scope

**In scope**:
- `src/components/molecules/Thesaurus/index.tsx`
- Optionally `src/utils/index.ts` — tighten filter to `Array.isArray(result) && result.length > 0`
- `src/components/molecules/Thesaurus/thesaurus.test.ts` (create) or utils test extension

**Out of scope**:
- N+1 batching (plan 020)
- Duplicate mounts (plan 021)

## Git workflow

- Branch: `advisor/012-thesaurus-empty-guard`

## Steps

### Step 1: Filter invalid entries in toThesaurusItems

```ts
return results
    .filter((result) => Array.isArray(result) && result.length > 0 && result[0]?.word)
    .map((result): ThesaurusItem => ({ ... }));
```

### Step 2: Harden getFirstDefinition usage

`getFirstDefinition` (`utils/index.ts:38-42`) assumes `results[0].meanings[0]` — only call after length checks.

**Verify**: `pnpm typecheck` → exit 0

### Step 3: Add test

Mock `getFreeDictionaryLexicons` to return `[[], [{ word: 'ok', meanings: [...] }]]` mixed — expect only valid item.

**Verify**: `pnpm test -- Thesaurus` → pass

## Test plan

- Empty array entry skipped without throw
- Valid entry maps correctly

## Done criteria

- [ ] Thesaurus never accesses `result[0]` without length guard
- [ ] Test covers empty-array dictionary response
- [ ] `pnpm build` exits 0
- [ ] `plans/README.md` row 012 → DONE

## STOP conditions

- Thesaurus refactor in plan 021 already fixes this — stop and mark DONE with reference.

## Maintenance notes

- Plan 020 batch fetch should preserve same filtering semantics.
