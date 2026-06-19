# Plan 033: Spike — SEO sitemap for /search/[word]

> **Executor instructions**: Design/spike plan. Produce decision doc with URL strategy; optional small prototype. Update `plans/README.md` when complete.
>
> **Drift check (run first)**: `git diff --stat 89e2ecb..HEAD -- src/app/sitemap.ts src/app/search/[word]/page.tsx`

## Status

- **Priority**: P3
- **Effort**: M (spike → implementation may be L)
- **Risk**: MED
- **Depends on**: plans/023-search-direct-navigation.md (canonical URLs)
- **Category**: direction
- **Planned at**: commit `89e2ecb`, 2026-06-18
- **Findings**: DIRECTION-03

## Why this matters

`sitemap.ts` only lists `/`, `/privacy-policy`, `/terms-of-service`. Dynamic word pages `/search/[word]` are the SEO core but unlisted — crawlers discover them only via internal links.

## Current state

`src/app/sitemap.ts` — static 3 URLs only.

`search/[word]/page.tsx` has `generateMetadata` with OG images — pages are indexable if linked.

No word list source in DB (Supabase removed).

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Build   | `pnpm build` | exit 0 |

## Scope

**In scope**:
- `plans/spikes/033-search-sitemap-decision.md` covering:
  - Curated top-N words list (constants file)
  - vs build-time fetch from analytics
  - vs `generateSitemaps` dynamic segment (Next.js 15)
  - Crawl budget / thin content risk for AI-only entries
- Optional prototype: extend `sitemap.ts` with 20 curated example queries from `EXAMPLE_QUERIES` in `use-search-navigation.ts`

**Out of scope**:
- Full dictionary enumeration
- paid SEO tooling integration

## Git workflow

- Branch: `advisor/033-sitemap-spike`

## Steps

### Step 1: Research Next.js 15 sitemap patterns

Document `generateSitemaps` + `[word]` route if using segment sitemaps.

### Step 2: Propose word source

Options:
1. Static `CURATED_SITEMAP_WORDS` in `constants/`
2. Redux persisted recent searches (client-only — **reject**)
3. External CMS

### Step 3: Thin content policy

Dictionary hits → include; AI-only pages → exclude or `noindex`?

### Step 4: Implementation estimate

S/M/L for follow-up build plan if spike approves.

## Test plan

- Spike doc only

## Done criteria

- [ ] Decision doc with recommended approach + risks
- [ ] `plans/README.md` row 033 → DONE

## STOP conditions

- Operator wants no index on search pages — document and close.

## Maintenance notes

- Coordinate canonical URLs with plan 023.
