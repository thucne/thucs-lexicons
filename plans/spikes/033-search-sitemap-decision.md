# Plan 033 decision: sitemap for `/search/[word]`

## Current state

`src/app/sitemap.ts` lists only static pages. Search result pages are canonicalized by plan 023 as `/search/[word]`, and `generateMetadata` already produces page-specific Open Graph data.

## Options

| Option | Notes | Risk |
| --- | --- | --- |
| Curated `CURATED_SITEMAP_WORDS` | Small constants list of high-quality dictionary-backed terms. Easy to review and test. | Manual maintenance. |
| Build-time analytics export | Pull top queries from an external source. | Requires a source system and privacy review. |
| `generateSitemaps` dynamic segment | Scales when there is a large trusted word corpus. | No corpus exists after Supabase removal. |
| Client recent searches | Reject. Client-only and user-specific. | Not stable or crawlable. |

## Thin-content policy

Only include pages expected to have dictionary-backed content. AI-only or exploratory queries should not be bulk-added to the sitemap until there is an editorial policy, because they risk thin or unstable indexed content.

## Recommendation

Start with a curated static list and keep it small, for example 20-50 entries. Put the list in a constants file and expand it only with terms verified to return dictionary results. Use `encodeURIComponent` when producing `/search/[word]` URLs.

## Follow-up implementation estimate

Small. Add a curated list, extend `sitemap.ts`, and add a unit test or snapshot-like helper test for encoded phrase URLs.
