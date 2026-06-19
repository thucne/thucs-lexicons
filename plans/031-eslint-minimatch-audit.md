# Plan 031: Triage eslint minimatch audit findings

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- package.json pnpm-lock.yaml`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: MED
- **Depends on**: plans/007-verification-baseline.md
- **Category**: migration
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: DEPENDENCIES-02

## Why this matters

`pnpm audit` flags `minimatch` vulnerabilities via `eslint` → `eslint-config-next` → `@typescript-eslint/*` trees. Dev-only dependency but should be tracked; upgrading eslint/typescript-eslint may resolve.

## Current state

Paths from audit:
- `.>eslint>minimatch`
- `.>eslint-config-next>@typescript-eslint/parser>@typescript-eslint/typescript-estree>minimatch`

`eslint` and `eslint-config-next@15.5.19` in devDependencies.

Audit suggests `@typescript-eslint/parser` target `8.61.1`.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Audit   | `pnpm audit` | document remaining |
| Lint    | `pnpm lint` | exit 0 |
| Build   | `pnpm build` | exit 0 |

## Scope

**In scope**:
- `package.json` / lockfile — bump eslint ecosystem if compatible
- Document residual risk in plan completion note or `plans/README.md`

**Out of scope**:
- Replacing eslint with biome
- Production runtime deps

## Git workflow

- Branch: `advisor/031-eslint-minimatch-audit`

## Steps

### Step 1: Baseline audit output

`pnpm audit --json > /tmp/audit-before.json` (local only)

### Step 2: Attempt safe upgrades

`pnpm update eslint-config-next @typescript-eslint/parser @typescript-eslint/eslint-plugin --latest` within Next 15 compatibility.

Check Next.js docs for supported typescript-eslint versions.

### Step 3: pnpm overrides as last resort

Only if upgrade fails and severity is high:

```json
"pnpm": { "overrides": { "minimatch": "^9.0.5" } }
```

**Verify**: `pnpm lint && pnpm build` → exit 0

### Step 4: Record outcome

If dev-only and unfixable without breaking Next lint, mark REJECTED with audit ID reference.

## Test plan

- lint + build gates

## Done criteria

- [ ] Audit re-run; minimatch findings reduced or documented as dev-only accepted risk
- [ ] `pnpm lint` passes
- [ ] `plans/README.md` row 031 → DONE or REJECTED with rationale

## STOP conditions

- eslint 9 breaks `next lint` — revert and document.

## Maintenance notes

- Re-check on Next.js minor upgrades.
