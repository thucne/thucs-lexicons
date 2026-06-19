# Plan 014: Align OpenAI prompt with JSON schema

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- src/app/api/openai/search/route.ts src/hooks/use-lexicon.tsx src/components/organisms/ResultPage/index.tsx`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/007-verification-baseline.md, plans/010-openai-error-responses.md
- **Category**: bug
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: CORRECTNESS-05

## Why this matters

The user prompt describes a **flat** `SearchResult` object (`word`, `meanings`, …), but `response_format.json_schema` requires `{ definitions: [ { openai, word, ... } ] }`. Strict schema mode may cause model confusion, retries, or empty completions. Consumers expect `resultsFromAIRaw?.definitions` (`ResultPage/index.tsx:148`).

## Current state

Prompt (`route.ts:16-31`) asks for top-level fields on a single entry.

Schema (`route.ts:56-172`) requires:

```ts
{
  definitions: [
    { openai: boolean, word: string, phonetic: string, ... }
  ]
}
```

`openai: true` is required in schema but not mentioned in prompt.

Return value: `JSON.parse(response.choices[0].message.content ?? '{}')` — passed through as-is to client.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Tests   | `pnpm test -- openai` | pass |
| Build   | `pnpm build` | exit 0 |

## Scope

**In scope**:
- `src/app/api/openai/search/route.ts` — prompt and/or schema alignment
- `src/app/api/openai/search/route.test.ts` — extend with schema shape assertion

**Out of scope**:
- has-meaning route (boolean schema is aligned)
- Changing `SearchResult` TypeScript type
- Model version changes

## Git workflow

- Branch: `advisor/014-openai-schema-prompt-align`

## Steps

### Step 1: Update prompt to match schema

Rewrite prompt to explicitly request:

```json
{
  "definitions": [
    {
      "openai": true,
      "word": "...",
      ...
    }
  ]
}
```

State: return `{ "definitions": [] }` for gibberish (not `{}` unless schema allows — empty definitions array preferred).

**Verify**: prompt text mentions `definitions` array wrapper

### Step 2: Validate response shape server-side

After parse, if `!result.definitions`, normalize:

```ts
const normalized = Array.isArray(result.definitions) ? result : { definitions: [] };
```

**Verify**: unit test with malformed `{ word: 'x' }` → `{ definitions: [] }` or 502

### Step 3: Confirm client compatibility

`useLexiconWithAI` and `ResultPage` already read `.definitions` — no client change if server is consistent.

**Verify**: `pnpm build` → exit 0

## Test plan

- Mock OpenAI response with `{ definitions: [{ openai: true, word: 'test', ... }] }` → 200
- Gibberish response `{ definitions: [] }` → 200 empty
- Prompt snapshot test optional (string contains `definitions`)

## Done criteria

- [ ] Prompt describes same shape as `json_schema`
- [ ] Server normalizes missing `definitions` key
- [ ] Tests cover response normalization
- [ ] `plans/README.md` row 014 → DONE

## STOP conditions

- OpenAI strict schema rejects empty `definitions` — stop with API error sample.
- Live API key required to validate — use mocks only.

## Maintenance notes

- Any schema field added to `SearchResult` must update both prompt and `json_schema` block.
