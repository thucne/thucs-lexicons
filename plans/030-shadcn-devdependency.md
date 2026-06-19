# Plan 030: Move shadcn CLI to devDependencies

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- package.json pnpm-lock.yaml`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: migration
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: DEPENDENCIES-01

## Why this matters

`shadcn` CLI (`^4.11.0`) is listed under **dependencies** but is only used at dev time to add UI components. It bloats production install and pulls transitive deps (e.g. `cross-spawn` audit finding via `@dotenvx/dotenvx`).

## Current state

`package.json` line 27: `"shadcn": "^4.11.0"` in `dependencies`.

`rg "from 'shadcn'|require\\('shadcn" src` → 0 (CLI only).

`components.json` exists for CLI config.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Install | `pnpm install` | exit 0 |
| Build   | `pnpm build` | exit 0 |

## Scope

**In scope**:
- `package.json` — move `shadcn` to `devDependencies`
- `pnpm-lock.yaml` — regenerate

**Out of scope**:
- Removing shadcn UI components from `src/components/ui/`
- cross-spawn override (optional follow-up)

## Git workflow

- Branch: `advisor/030-shadcn-devdependency`

## Steps

### Step 1: Move package

`pnpm remove shadcn && pnpm add -D shadcn@^4.11.0`

### Step 2: Verify CLI still works

`pnpm dlx shadcn@latest --help` or `npx shadcn --help` → exit 0

### Step 3: Production install check

`pnpm install --prod` in temp or verify Vercel only bundles app deps — `pnpm build` sufficient.

**Verify**: `pnpm build` → exit 0

## Test plan

- Build gate; document in README that component adds use `pnpm dlx shadcn@latest add ...`

## Done criteria

- [ ] `shadcn` only in devDependencies
- [ ] `pnpm build` passes
- [ ] `plans/README.md` row 030 → DONE

## STOP conditions

- Vercel build invokes shadcn at build time — stop and document why it must stay in dependencies.

## Maintenance notes

- AGENTS.md already says components live in `src/components/ui/` — CLI is dev-only.
