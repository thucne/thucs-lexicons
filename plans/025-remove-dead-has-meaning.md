# Plan 025: Remove dead has-meaning stack

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- src/utils/index.ts src/hooks/use-lexicon.tsx src/app/api/openai/search/has-meaning/route.ts`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/032-has-meaning-gate-spike.md (coordinate — if spike chooses to wire gate, **do not** delete; mark this plan REJECTED)
- **Category**: tech-debt
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: DEBT-01

## Why this matters

`has-meaning` API route, `useLexiconWithAICheck`, and `hasDefinition` util are **orphaned** — no imports from UI after revamp. ResultPage goes dictionary → full AI without the boolean gate. Dead code confuses executors and still exposes an OpenAI endpoint.

## Current state

Defined but unused in UI:
- `src/app/api/openai/search/has-meaning/route.ts`
- `useLexiconWithAICheck` in `use-lexicon.tsx:30-38`
- `hasDefinition` in `utils/index.ts:13-36`
- `OPENAI_MEANING_CHECK_API` in `constants/index.ts:3`

`rg "useLexiconWithAICheck|hasDefinition"` → only definitions, no callers.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Grep    | `rg "has-meaning|hasDefinition|useLexiconWithAICheck" src` | 0 after deletion |
| Build   | `pnpm build` | exit 0 |

## Scope

**In scope**:
- Delete `has-meaning/route.ts`
- Remove `useLexiconWithAICheck`, `hasDefinition`, `OPENAI_MEANING_CHECK_API`
- Update any docs referencing has-meaning

**Out of scope**:
- Wiring the gate (plan 032 / DIRECTION-02) — **STOP if product chooses to keep**

## Git workflow

- Branch: `advisor/025-remove-dead-has-meaning`

## Steps

### Step 0: Confirm plan 032 decision

If operator wants has-meaning gate wired, **STOP** and mark this plan REJECTED in README.

### Step 1: Delete route and exports

Remove files and symbols listed above.

### Step 2: Grep for stale references

Including `plans/` and `README` — update only if in scope constants docs.

**Verify**: `rg "OPENAI_MEANING_CHECK|has-meaning" src` → 0

### Step 3: Build and test

**Verify**: `pnpm build && pnpm test` → exit 0

## Test plan

- Remove tests for deleted route if added in plan 010
- No new tests required

## Done criteria

- [ ] No has-meaning route or dead hooks/utils
- [ ] `pnpm build` passes
- [ ] `plans/README.md` row 025 → DONE or REJECTED with reason

## STOP conditions

- Plan 032 spike approved wiring gate — do not delete; implement 032 instead.

## Maintenance notes

- DIRECTION-02 spike should run **before** this plan unless deletion is confirmed.
