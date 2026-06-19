# Plan 021: Deduplicate Thesaurus mounts per meaning

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- src/components/molecules/Meaning/index.tsx src/components/molecules/Meaning/Definition.tsx`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: MED
- **Depends on**: plans/012-thesaurus-empty-guard.md, plans/020-thesaurus-batch-fetch.md (recommended)
- **Category**: perf
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: PERFORMANCE-02

## Why this matters

`Thesaurus` mounts in **both** `Meaning/index.tsx` (meaning-level antonyms/synonyms) and `Definition.tsx` (definition-level lists). When intersection triggers, both can render for the same meaning block → duplicate accordions and duplicate API work.

## Current state

`Meaning/index.tsx` (lines 37–39):

```tsx
{isIntersecting && (
    <Thesaurus antonyms={meaning.antonyms} synonyms={meaning.synonyms} autoExpand={index === 0} />
)}
```

`Definition.tsx` (lines 29–31):

```tsx
{isIntersecting && (
    <Thesaurus antonyms={definition.antonyms} synonyms={definition.synonyms} autoExpand={index === 0} />
)}
```

Dictionary data often duplicates meaning-level and definition-level synonym arrays.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Build   | `pnpm build` | exit 0 |
| Manual  | `/search/perfect` | single Related words block per meaning |

## Scope

**In scope**:
- `src/components/molecules/Meaning/index.tsx`
- `src/components/molecules/Meaning/Definition.tsx`
- Decision: keep meaning-level OR definition-level Thesaurus, not both

**Out of scope**:
- ResultSidebar related words (different surface)
- Thesaurus UI redesign

## Git workflow

- Branch: `advisor/021-dedupe-thesaurus-mounts`

## Steps

### Step 1: Choose single mount point

**Recommended**: Keep **one** `Thesaurus` at end of `MeaningComponent` with merged lists:

```ts
const mergedSynonyms = [...new Set([
  ...(meaning.synonyms ?? []),
  ...meaning.definitions.flatMap(d => d.synonyms ?? [])
])];
```

Remove `Thesaurus` from `Definition.tsx`.

### Step 2: Preserve autoExpand behavior

Only first meaning (`index === 0`) auto-expands.

**Verify**: visual check on result page with multiple definitions

### Step 3: Confirm no empty duplicate skeletons

**Verify**: `pnpm build` → exit 0

## Test plan

- Optional RTL: Meaning with 3 definitions renders 1 Thesaurus (query by "Related words" heading count per meaning block)

## Done criteria

- [ ] At most one `Thesaurus` per meaning block
- [ ] Related words still appear when synonyms exist
- [ ] `plans/README.md` row 021 → DONE

## STOP conditions

- Product requires per-definition synonym nuance — stop and propose collapsed single accordion with sections instead.

## Maintenance notes

- Coordinate with plan 020 batching — single mount reduces fetch duplication further.
