# Plan 007: Establish verification baseline (CI, typecheck, test runner)

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- package.json tsconfig.json .github/ vitest.config.ts jest.config.ts`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: tests
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: TESTS-01, DX-02, DIRECTION-01 (verification tranche — other plans depend on this)

## Why this matters

The repo has **zero automated tests**, **no CI workflow**, and **no `typecheck` script** (`package.json` only exposes `dev`, `build`, `start`, `lint`, `format`). Every correctness and security fix in plans 010+ needs a machine-checkable gate before merge. This plan adds the minimum harness so executors can run `pnpm typecheck`, `pnpm test`, and CI on every PR.

## Current state

- `package.json` scripts (lines 5–11): no `typecheck`, no `test`.
- `tsconfig.json`: `"strict": true`, `"noEmit": true` — suitable for `tsc --noEmit`.
- No `.github/workflows/` directory exists.
- No `*.test.ts` or `*.spec.ts` files anywhere in the repo.
- `AGENTS.md` verification section lists `pnpm build`, `pnpm lint`, `rg "@mui/" src` — no typecheck or test.

Repo conventions: pnpm package manager, Next.js 15 App Router, TypeScript 5.

## Commands you will need

| Purpose   | Command                  | Expected on success |
|-----------|--------------------------|---------------------|
| Install   | `pnpm install`           | exit 0              |
| Typecheck | `pnpm typecheck`         | exit 0, no errors   |
| Tests     | `pnpm test`              | exit 0 (smoke passes)|
| Lint      | `pnpm lint`              | exit 0              |
| Build     | `pnpm build`             | exit 0              |
| MUI check | `rg "@mui/" src`         | 0 matches           |

## Scope

**In scope**:
- `package.json` — add `typecheck`, `test` scripts; add devDependencies for test runner
- `tsconfig.json` — only if needed for test file inclusion
- `vitest.config.ts` or `jest.config.ts` (create) — pick Vitest (lighter for Next.js utility tests)
- `.github/workflows/ci.yml` (create) — lint + typecheck + test + build
- `src/__tests__/smoke.test.ts` (create) — one passing smoke test

**Out of scope**:
- Characterization tests for lookup paths (plan 024)
- Fixing application bugs
- Adding Playwright/e2e

## Git workflow

- Branch: `advisor/007-verification-baseline`
- Commit per logical unit; message style: `Add CI and typecheck baseline` (match recent repo: sentence-case imperative)
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add typecheck script

In `package.json` scripts, add:

```json
"typecheck": "tsc --noEmit"
```

**Verify**: `pnpm typecheck` → exit 0 (fix any pre-existing TS errors only if they block exit 0; list them in commit message if fixed).

### Step 2: Add Vitest and smoke test

Install: `pnpm add -D vitest @vitejs/plugin-react`

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: { environment: 'node' },
    resolve: { alias: { '@': path.resolve(__dirname, './src') } }
});
```

Create `src/__tests__/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest';

describe('smoke', () => {
    it('passes', () => {
        expect(true).toBe(true);
    });
});
```

Add script: `"test": "vitest run"`

**Verify**: `pnpm test` → 1 test passed, exit 0

### Step 3: Add GitHub Actions CI

Create `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
      - run: rg "@mui/" src && test $? -eq 1 || (echo "MUI imports found" && exit 1)
```

Adjust default branch name if not `main`.

**Verify**: YAML is valid; locally run the same command sequence → all exit 0

### Step 4: Update AGENTS.md verification block

Add `pnpm typecheck` and `pnpm test` to the verification commands list in `AGENTS.md`.

**Out of scope note**: AGENTS.md is outside `plans/` — skip if operator forbids; otherwise include as optional doc sync (or defer to plan 009).

If AGENTS.md edit is deferred, note in commit that plan 009 will align docs.

**Verify**: `pnpm lint && pnpm typecheck && pnpm test && pnpm build` → all exit 0

## Test plan

- Smoke test in `src/__tests__/smoke.test.ts` — proves runner works.
- CI workflow runs the full gate on push/PR.
- Verification: `pnpm test` → 1 passed; CI yaml includes all four gates.

## Done criteria

- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm test` exits 0 with at least 1 test
- [ ] `.github/workflows/ci.yml` exists and runs lint, typecheck, test, build
- [ ] `package.json` has `typecheck` and `test` scripts
- [ ] `plans/README.md` status row for 007 updated to DONE

## STOP conditions

- `pnpm typecheck` reveals >20 pre-existing errors — stop and report count; do not fix unrelated TS debt in this plan.
- Vitest conflicts with Next.js config in a way requiring major config changes — stop and propose alternative (Jest).
- Default branch is not `main` and operator did not confirm CI trigger branch.

## Maintenance notes

- Plans 010–019 (correctness/security) should add regression tests that plug into this harness.
- Plan 024 adds characterization tests — extend `vitest.config.ts` if needed for `@/` imports in API route tests.
- Reviewers: confirm CI uses `--frozen-lockfile` and Node 20 matches Vercel runtime.
