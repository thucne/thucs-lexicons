# Plan 013: QuickMeaning lookup full hovered phrase

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- src/components/organisms/ResultPage/QuickMeaning.tsx`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: MED
- **Depends on**: plans/007-verification-baseline.md
- **Category**: bug
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: CORRECTNESS-04

## Why this matters

QuickMeaning reduces hovered text to the **first whitespace-delimited token** (`line 26`), so hovering a multi-word idiom in an example sentence looks up only the first word — wrong for phrases like "break the ice."

## Current state

`src/components/organisms/ResultPage/QuickMeaning.tsx` (lines 22–26):

```ts
const [hoveredTextRaw, hoveredTextElement, setHoveredTextElement] = useOnHoveredText({
    delay: 1000,
    filterClassName: 'lexicon'
});
const hoveredText = hoveredTextRaw?.split(/\W+/).filter((word) => word.length > 0)?.[0] ?? null;
```

`Definition.tsx` wraps **each word** in its own `.lexicon` span (lines 17–22), so `hoveredTextRaw` is typically a single word today — but examples with punctuation attached may still truncate (`"ice,"` → split behavior).

Product intent (HomePage): explore phrases and idioms.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Build   | `pnpm build` | exit 0 |
| Lint    | `pnpm lint` | exit 0 |

## Scope

**In scope**:
- `src/components/organisms/ResultPage/QuickMeaning.tsx`
- Possibly `src/components/molecules/Meaning/Definition.tsx` — if phrase hover requires multi-word `.lexicon` spans
- `src/components/organisms/ResultPage/QuickMeaning.test.tsx` (create) — extract tokenization helper for unit test

**Out of scope**:
- AI fallback logic
- Popover → HoverCard migration

## Git workflow

- Branch: `advisor/013-quickmeaning-phrase-token`

## Steps

### Step 1: Use full hovered text with light normalization

Replace first-token split with:

```ts
const hoveredText = hoveredTextRaw?.trim().replace(/^[^\w]+|[^\w]+$/g, '') || null;
```

Or use full `hoveredTextRaw?.trim()` if punctuation stripping is too aggressive.

Extract to `normalizeHoveredLexicon(text: string | null): string | null` for testing.

**Verify**: unit test — `"break the ice"` preserved; `"ice,"` → `"ice"` or `"ice,"` per chosen rule (document choice)

### Step 2: Evaluate Definition.tsx span strategy

If product requires multi-word phrase hover, wrap phrase chunks (e.g. split on spaces but group idiom spans) — **only if** single-word spans block phrase UX. Minimum fix: stop truncating to `[0]` when raw text is already one span.

**Verify**: manual hover on `/search/break%20the%20ice` example sentences

### Step 3: Ensure encodeURIComponent on fetch paths

Dictionary fetch uses `getFreeDictionaryLexicons([activeHover])` — plan 011 ensures encoding in utils.

**Verify**: `pnpm build` → exit 0

## Test plan

- Unit tests for `normalizeHoveredLexicon`:
  - single word
  - multi-word phrase
  - empty / whitespace

## Done criteria

- [ ] QuickMeaning does not `.split(...)[0]` truncate multi-word hover text
- [ ] Tests cover phrase normalization
- [ ] `plans/README.md` row 013 → DONE

## STOP conditions

- `useOnHoveredText` only ever provides single words because Definition splits per word — stop and propose Definition.tsx phrase-span follow-up (step 2 required).

## Maintenance notes

- Plan 005 assumed per-word `.lexicon` spans — phrase support may need Definition markup change in same PR.
