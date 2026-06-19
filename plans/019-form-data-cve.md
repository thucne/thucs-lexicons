# Plan 019: Resolve form-data CVE in OpenAI dependency chain

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- package.json pnpm-lock.yaml`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: security
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: SECURITY-04

## Why this matters

`pnpm audit` reports vulnerabilities in `form-data@4.0.0` via `openai` → `@types/node-fetch` → `form-data`. Path: `.>openai>@types/node-fetch>form-data`. Advisory recommends `form-data@4.0.6`.

## Current state

`package.json`: `"openai": "^4.103.0"`

`pnpm-lock.yaml`: `form-data@4.0.0` pinned in lockfile.

`pnpm audit` action: update `form-data` target `4.0.6`.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Audit   | `pnpm audit` | no form-data high/critical |
| Build   | `pnpm build` | exit 0 |
| Test    | `pnpm test` | exit 0 |

## Scope

**In scope**:
- `package.json` — `pnpm.overrides` for `form-data` if needed
- `pnpm-lock.yaml` — regenerated via install

**Out of scope**:
- Upgrading OpenAI major version unless required
- Other audit findings (minimatch — plan 031)

## Git workflow

- Branch: `advisor/019-form-data-cve`

## Steps

### Step 1: Try pnpm update openai

`pnpm update openai@latest` — check if lockfile pulls `form-data@4.0.6`.

**Verify**: `pnpm why form-data` → version ≥ 4.0.6

### Step 2: If still vulnerable, add override

In `package.json`:

```json
"pnpm": {
  "overrides": {
    "form-data": "4.0.6"
  }
}
```

Run `pnpm install`.

**Verify**: `pnpm audit --audit-level=high` → no form-data issues

### Step 3: Regression smoke

`pnpm build && pnpm test` → exit 0

## Test plan

- Audit command is the gate; no new unit tests required.

## Done criteria

- [ ] `form-data` resolved to ≥ 4.0.6 in lockfile
- [ ] `pnpm audit` no longer flags form-data CVEs from openai chain
- [ ] `pnpm build` passes
- [ ] `plans/README.md` row 019 → DONE

## STOP conditions

- Override breaks `openai` package — stop and report `pnpm test` / build error.
- Only low-severity remains — document and stop for operator decision.

## Maintenance notes

- Re-run audit after any `openai` version bump.
