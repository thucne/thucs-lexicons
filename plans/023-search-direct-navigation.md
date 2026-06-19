# Plan 023: Navigate search directly to word route

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- src/hooks/use-search-navigation.ts src/app/search/page.tsx src/components/organisms/NavigationBar/SearchBar.tsx`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: PERFORMANCE-04

## Why this matters

`useSearchNavigation.submitSearch` pushes to `/search?word=...`, then `src/app/search/page.tsx` issues `permanentRedirect` to `/search/[word]`. Every search incurs an extra round-trip (client navigation → server redirect → final page).

## Current state

`use-search-navigation.ts` (lines 28–40):

```ts
router.push(createUrl('/search', newParams));
// createUrl('/search', newParams) → /search?word=foo
```

`search/page.tsx` (lines 29–31):

```ts
if (word) {
    permanentRedirect(`/search/${encodeURIComponent(word)}`);
}
```

Canonical word URLs are `/search/[word]` (`search/[word]/page.tsx`).

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Build   | `pnpm build` | exit 0 |
| Lint    | `pnpm lint` | exit 0 |

## Scope

**In scope**:
- `src/hooks/use-search-navigation.ts`
- Callers: `SearchBar`, `CommandSearch`, `HomePage` hero search — verify all use hook
- Keep `/search?word=` redirect in `search/page.tsx` for bookmarked legacy URLs

**Out of scope**:
- Removing `/search` page entirely
- SEO sitemap (plan 033)

## Git workflow

- Branch: `advisor/023-search-direct-navigation`

## Steps

### Step 1: Update submitSearch to push canonical path

```ts
if (nextSearch) {
    router.push(`/search/${encodeURIComponent(nextSearch)}`);
} else {
    router.push('/search');
}
```

Remove query-param building for successful searches.

### Step 2: Audit all navigation entry points

Grep `createUrl('/search'` and `/search?word` — align to hook or shared helper.

**Verify**: `rg "createUrl\\('/search'" src` → only legacy or empty-search cases

### Step 3: Keep permanentRedirect for external links

`/search?word=x` still works via `search/page.tsx`.

**Verify**: manual — submit from home goes directly to `/search/word` without intermediate URL in network tab

## Test plan

- Unit test `submitSearch` calls `router.push` with `/search/${encodeURIComponent('break the ice')}`

## Done criteria

- [ ] Primary search flow navigates directly to `/search/[word]`
- [ ] Legacy `?word=` URLs still redirect
- [ ] `pnpm build` passes
- [ ] `plans/README.md` row 023 → DONE

## STOP conditions

- Command palette relies on query params for state — stop and preserve params on `/search/[word]` only.

## Maintenance notes

- Plan 033 sitemap should list `/search/[word]` URLs not query form.
