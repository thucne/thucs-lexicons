# Plan 008: DX tooling — .env.example and format:check

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- .gitignore package.json .env.example`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none (benefits from plan 007 for CI integration)
- **Category**: dx
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: DX-01, DX-03

## Why this matters

New contributors cannot discover required environment variables — there is no `.env.example`. The `.gitignore` line `.env*` (line 37) ignores **all** `.env*` files including `.env.example`, so even if someone creates the file it won't commit. The `format` script only writes (`prettier --write`) with no CI-checkable `format:check`, so formatting drift won't fail PRs.

## Current state

`.gitignore` (lines 28–37):

```
# local env files
.env*.local
...
.env*
```

The broad `.env*` pattern blocks `.env.example`.

`package.json` scripts:

```json
"format": "prettier \"**/*.{ts,tsx,json}\" --write"
```

Env vars used in codebase (from recon):
- `OPENAI_API_KEY` — `src/app/api/openai/search/route.ts:3`
- `NEXT_PUBLIC_DOMAIN` — `src/hooks/use-lexicon.tsx:11`, `src/app/sitemap.ts:3`

No secret values should appear in `.env.example` — placeholders only.

## Commands you will need

| Purpose      | Command                    | Expected on success |
|--------------|----------------------------|---------------------|
| Format check | `pnpm format:check`        | exit 0              |
| Lint         | `pnpm lint`                | exit 0              |
| Typecheck    | `pnpm typecheck`           | exit 0 (after 007)  |

## Scope

**In scope**:
- `.gitignore` — narrow `.env*` to allow `.env.example`
- `.env.example` (create)
- `package.json` — add `format:check` script
- `.github/workflows/ci.yml` — add `format:check` step (if plan 007 landed)

**Out of scope**:
- Populating real secrets
- Vercel env sync
- README env docs (plan 009)

## Git workflow

- Branch: `advisor/008-dx-tooling`
- Commit message example: `Add .env.example and format:check script`
- Do NOT push unless instructed.

## Steps

### Step 1: Fix .gitignore to allow .env.example

Replace line `.env*` with explicit ignores:

```
.env
.env.local
.env.development
.env.production
.env*.local
```

Keep `.env*.local` line. Add negation if preferred:

```
!.env.example
```

**Verify**: `git check-ignore -v .env.example` → not ignored (exit 1 from check-ignore means file is trackable)

### Step 2: Create .env.example

```env
# Server-only — required for AI search routes
OPENAI_API_KEY=

# Public site URL (no trailing slash) — used for absolute API URLs in SWR
NEXT_PUBLIC_DOMAIN=http://localhost:3000
```

**Verify**: `git add .env.example` succeeds; file contains no real secrets

### Step 3: Add format:check script

```json
"format:check": "prettier \"**/*.{ts,tsx,json}\" --check"
```

**Verify**: `pnpm format:check` → exit 0

### Step 4: Wire format:check into CI (if exists)

If `.github/workflows/ci.yml` exists from plan 007, add `- run: pnpm format:check` after lint.

**Verify**: full CI command sequence passes locally

## Test plan

- No unit tests required.
- `pnpm format:check` is the gate.
- Manually confirm `.env.example` is not gitignored.

## Done criteria

- [ ] `.env.example` exists and is tracked by git
- [ ] `.gitignore` no longer blocks `.env.example`
- [ ] `pnpm format:check` exits 0
- [ ] `plans/README.md` row 008 → DONE

## STOP conditions

- Other `.env` variants (e.g. `.env.staging`) need tracking — stop and ask operator which patterns to allow.
- `format:check` fails on >50 files — run `pnpm format` once, commit formatting separately, then re-verify.

## Maintenance notes

- When new env vars are added to the app, update `.env.example` in the same PR.
- Consider adding `format:check` to pre-commit later — out of scope here.
