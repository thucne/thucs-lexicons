# Plan 003: Home page marketing surfaces

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for plan 003 in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 74aad0a..HEAD -- src/components/organisms/HomePage/index.tsx`

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/001-shadcn-foundation.md
- **Category**: direction
- **Planned at**: commit `74aad0a`, 2026-06-18

## Why this matters

The homepage is the first impression. It currently stacks MUI `Paper`, `Chip`, and `Typography` with repetitive `sx` border/radius/shadow blocks (`HomePage/index.tsx:52-60`, `82-90`). Example queries and capability cards lack hover/focus affordances. Migrating to shadcn `Card`, `Badge`, and `Button` gives consistent elevation, keyboard-accessible example links, and a cleaner path off MUI on a low-risk, mostly-static page.

## Current state

`src/components/organisms/HomePage/index.tsx` structure:

1. Hero chip: “No account. No saved words. Just lookup.”
2. H1 + subtitle
3. `Paper` wrapping `SearchBar autoFocus size="large"`
4. Row of example `Chip` links → `/search/${encodeURIComponent(example)}`
5. Sidebar `Paper` with three capabilities (`Dictionary First`, `Phrase Friendly`, `Meaning Explorer`)

Uses `AppGrid` for responsive 7/5 column split.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Add UI | `npx shadcn@latest add button` (if not from 001) | exit 0 |
| Lint | `pnpm lint` | exit 0 |
| Build | `pnpm build` | exit 0 |

## Scope

**In scope**:
- `src/components/organisms/HomePage/index.tsx` only

**Out of scope**:
- `SearchBar` internals (plan 002) — import as-is
- `AppGrid` atom (keep or replace with CSS grid in this file only)
- Result page, API routes

## Steps

### Step 1: Replace layout shell with Tailwind grid

Convert outer layout to:

```tsx
<div className="mx-auto max-w-6xl px-4 py-8 md:py-14">
  <div className="grid gap-8 md:grid-cols-12">
    <div className="md:col-span-7">...</div>
    <div className="md:col-span-5">...</div>
  </div>
</div>
```

Remove MUI `Container`, `Box` wrappers.

**Verify**: `pnpm build` → exit 0.

### Step 2: Hero section

- Top pill: shadcn `Badge` variant `secondary` with Lucide `Search` icon + label text
- H1: `className="text-4xl font-semibold tracking-tight md:text-5xl"` (match MUI h1 clamp intent)
- Subtitle: `text-muted-foreground text-lg max-w-xl`

**Verify**: Visual parity with light Geist page — no MUI Typography in hero.

### Step 3: Search card

Wrap `SearchBar` in shadcn `Card` + `CardContent` with `p-4`:

```tsx
<Card className="shadow-sm">
  <CardContent className="p-4">
    <Suspense fallback={<Skeleton className="h-10 w-full" />}>
      <SearchBar autoFocus size="large" />
    </Suspense>
  </CardContent>
</Card>
```

**Verify**: Search still autofocuses on homepage load.

### Step 4: Example queries

Replace MUI `Chip` links with shadcn `Badge` variant `outline` or `Button` variant `outline` size `sm` as `Link`:

```tsx
<Button variant="outline" size="sm" className="rounded-full" asChild>
  <Link href={`/search/${encodeURIComponent(example)}`}>{example}</Link>
</Button>
```

Wrap in `flex flex-wrap gap-2`.

Add `hover:bg-accent` for clear affordance.

**Verify**: Each example link resolves (e.g. `affect vs effect`).

### Step 5: Capabilities sidebar card

Replace sidebar `Paper` with `Card` using `className="bg-muted/40"`:

- `CardHeader` + `CardTitle`: “Built for lookup flow”
- Each capability: `Separator` between items (shadcn), title `font-medium`, body `text-sm text-muted-foreground`

**Verify**: `grep -c '@mui/material' src/components/organisms/HomePage/index.tsx` → `0`.

## Test plan

- Manual: homepage at `/` — layout responsive at 375px and 1280px
- `pnpm lint && pnpm build` → exit 0

## Done criteria

- [ ] `HomePage/index.tsx` has zero `@mui/material` imports
- [ ] All four example links work
- [ ] `SearchBar` still renders inside Card
- [ ] `pnpm build` exits 0
- [ ] `plans/README.md` row 003 → DONE

## STOP conditions

- `SearchBar` still requires MUI theme context and breaks — keep MUI providers in layout (expected); only HomePage drops MUI imports.
- Plan 002 changed `SearchBar` props API — adapt calls, do not fork SearchBar.

## Maintenance notes

- Homepage is the visual reference for Card density — match padding in plan 004 ResultPage cards.
