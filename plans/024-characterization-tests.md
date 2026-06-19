# Plan 024: Add characterization tests for lookup paths

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- src/utils/index.ts src/hooks/use-lexicon.tsx src/components/organisms/ResultPage/index.tsx`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/007-verification-baseline.md
- **Category**: tests
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: TESTS-02

## Why this matters

Core product flows — dictionary fetch, AI fallback gate, empty results — have no regression tests. Refactors (plans 010–014, 025) need fixtures that lock current behavior before changes.

## Current state

Lookup chain on ResultPage (`index.tsx:143-149`):

1. Redux store hit for same word
2. `useLexicon` → Free Dictionary API
3. If empty after load, `useLexiconWithAI` → `/api/openai/search`

Utils: `getFreeDictionaryLexicons`, `getFirstDefinition`, `hasDefinition` (dead but testable).

No existing test files.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Tests   | `pnpm test` | all pass |
| Typecheck | `pnpm typecheck` | exit 0 |

## Scope

**In scope**:
- `src/utils/index.test.ts` — dictionary helpers, encoding, getFirstDefinition
- `src/hooks/use-lexicon.test.tsx` — SWR key URLs with `encodeURIComponent` (mock SWR)
- `src/components/organisms/ResultPage/result-logic.test.ts` — extract pure `resolveResults(store, fetch, ai)` from ResultPage if needed
- Fixture JSON under `src/__fixtures__/` — sample dictionary + AI responses

**Out of scope**:
- Playwright e2e
- OpenAI live API calls

## Git workflow

- Branch: `advisor/024-characterization-tests`

## Steps

### Step 1: Add fixtures

`src/__fixtures__/dictionary-perfect.json` — truncated real-shaped response for "perfect"
`src/__fixtures__/openai-definitions.json` — `{ definitions: [...] }`

### Step 2: Utils characterization tests

- `getFirstDefinition` returns first definition string
- `getFreeDictionaryLexicons` filters non-arrays (mock fetch)

### Step 3: Extract and test result resolution logic

Pure function:

```ts
export function pickSearchResults(args: {
  store?: SearchResults;
  storeWord: string;
  query: string;
  fetch?: SearchResults;
  ai?: SearchResults;
}): SearchResults | undefined
```

Mirror current precedence in ResultPage.

**Verify**: `pnpm test` → ≥8 new tests

### Step 4: Document in AGENTS.md optional test command

**Verify**: CI runs `pnpm test`

## Test plan

Cases:
- Store hit same word → store results
- Dictionary returns array → dictionary
- Dictionary empty + AI definitions → AI
- All empty → undefined
- Phrase with spaces in URL encoding

## Done criteria

- [ ] ≥8 characterization tests for lookup paths
- [ ] Fixtures committed (no secrets)
- [ ] `pnpm test` passes in CI
- [ ] `plans/README.md` row 024 → DONE

## STOP conditions

- ResultPage too entangled to extract without large refactor — limit to utils/hooks tests and stop with follow-up note.

## Maintenance notes

- Update fixtures when `SearchResult` type changes.
