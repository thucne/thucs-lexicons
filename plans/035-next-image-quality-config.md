# Plan 035: Resolve Next Image quality warning before Next 16

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat fb2c1ca..HEAD -- src/components/organisms/Footer/index.tsx next.config.mjs`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: migration
- **Planned at**: commit `fb2c1ca`, 2026-06-19
- **Findings**: MIGRATION-01

## Why this matters

`pnpm build` and local dev currently warn that an image uses `quality="100"` but `images.qualities` is not configured. Next.js says this config will be required starting in Next 16. This is a small, low-risk fix now, and it keeps the app's normal verification output quiet so future agents do not miss more important warnings.

The warning was observed while loading `/search/perfect` locally after the QuickMeaning work:

```text
Image with src "/thucdedev-banner.png" is using quality "100" which is not configured in images.qualities. This config will be required starting in Next.js 16.
```

## Current state

`src/components/organisms/Footer/index.tsx` (lines 55–64 as of `fb2c1ca`) renders the footer logo with explicit `quality={100}`:

```tsx
<Image
    src={bannerSrc}
    alt="Thucde.dev Logo"
    width={200}
    height={50}
    draggable={false}
    quality={100}
    style={{ objectFit: 'contain' }}
    loading="lazy"
/>
```

`next.config.mjs` (lines 1–4 as of `fb2c1ca`) has no `images` configuration:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true
};

export default nextConfig;
```

The repo uses Next.js 15.5.19 now (`package.json` line 21), but the warning explicitly points to Next 16 readiness.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Lint    | `pnpm lint` | exit 0 |
| Build   | `pnpm build` | exit 0 and no `images.qualities` warning |
| Manual  | `pnpm dev` then open `/search/serendipity` | footer logo renders in light and dark themes |

## Scope

**In scope**:
- `src/components/organisms/Footer/index.tsx`
- `next.config.mjs`

**Out of scope**:
- Any redesign of the footer.
- Any change to banner image assets.
- Upgrading Next.js.
- Theme-provider or hydration behavior beyond preserving the current `mounted` guard.

## Git workflow

- Branch: `advisor/035-next-image-quality-config`
- Commit: `Resolve Next image quality warning`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Choose the smallest compatibility fix

Prefer one of these two options:

1. **Recommended**: keep `quality={100}` and add an explicit allow-list in `next.config.mjs`:

    ```js
    /** @type {import('next').NextConfig} */
    const nextConfig = {
        reactStrictMode: true,
        images: {
            qualities: [100]
        }
    };

    export default nextConfig;
    ```

2. If the visual difference is not important, remove `quality={100}` from `Footer/index.tsx` and rely on Next's default image quality.

Use option 1 unless product/design review says the explicit quality is unnecessary.

**Verify**: `pnpm build` → exit 0 and no `images.qualities` warning.

### Step 2: Preserve the hydration fix

Do not remove or rewrite the current `mounted` guard in `Footer/index.tsx`:

```tsx
const [mounted, setMounted] = useState(false);
const { resolvedTheme } = useTheme();
const bannerSrc = mounted && resolvedTheme === 'dark' ? THUCDEDEV_BANNER_PNG_DARK : THUCDEDEV_BANNER_PNG;
```

This guard prevents the dark-theme banner from causing a server/client `<Image src/srcSet>` hydration mismatch.

**Verify**: `pnpm lint` → exit 0.

### Step 3: Manual browser sanity check

Run `pnpm dev`, open `/search/serendipity`, and check:

- The footer logo appears.
- Toggling dark/light theme switches the logo without a hydration error overlay.
- The terminal no longer prints the `images.qualities` warning for the footer banner.

**Verify**: manual check passes. Stop the dev server after checking unless the operator asked to keep it running.

## Test plan

- No unit tests are required for this migration-only config fix.
- `pnpm lint` and `pnpm build` are the automated gates.
- Manual browser check covers the theme-specific footer logo behavior.

## Done criteria

- [ ] `pnpm build` exits 0 without the `images.qualities` warning.
- [ ] `pnpm lint` exits 0.
- [ ] Footer logo still renders in light and dark themes.
- [ ] No hydration overlay appears when loading `/search/serendipity` in dark mode.
- [ ] `plans/README.md` row 035 → DONE.

## STOP conditions

- `images.qualities` is not accepted by the installed Next 15.5.19 config type or build runtime — remove `quality={100}` instead and document why.
- Fixing the warning appears to require changing image assets or footer layout — stop and report; that is out of scope.
- The hydration mismatch returns after the change — stop and preserve the current mounted-guard behavior.

## Maintenance notes

- If more `next/image` instances add custom `quality` values later, include those values in `images.qualities`.
- When upgrading to Next 16, keep this plan's build warning check in the upgrade test notes.
