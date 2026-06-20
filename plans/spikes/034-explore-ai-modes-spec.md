# Plan 034 spec: Explore with AI modes

## Current entry points

- Homepage examples in `HomePage`.
- Result sidebar links for context, compare, and phrase prompts.
- Command/search flow routes everything through `/search/[word]`.
- AI is currently a silent fallback when dictionary coverage is missing.

## Mode matrix

| Mode | Trigger | Prompt delta | Dictionary first? |
| --- | --- | --- | --- |
| Standard | Default search | Current schema-aligned definition prompt. | Yes |
| Explain Simply | Sidebar or command action | Prefer plain language, fewer senses, short examples. | Yes, then AI on request |
| Phrase & Idioms | Sidebar phrase link | Focus on idiomatic meaning, usage context, and example phrases. | Yes |
| Compare | Sidebar compare link | Explain contrast between two terms and usage boundaries. | No when query is explicitly comparative |

## UI placement

MVP should not add a large mode switch to the main search box. Keep the dictionary-first path quiet and add explicit AI actions near existing sidebar links or empty states. This preserves the product's dictionary feel while making AI intentional.

## API sketch

Extend `/api/openai/search` with an optional `mode` query:

```text
/api/openai/search?input=break%20the%20ice&mode=phrase
```

Use a small prompt-template map server-side. Every mode must keep the plan 014 response wrapper:

```json
{ "definitions": [] }
```

## Cost and rate-limit notes

All modes should share the plan 016 OpenAI rate-limit bucket at first. If modes become high-traffic features, split budgets by mode only after production metrics show a real need.

## MVP recommendation

Ship one explicit "Ask AI" action on empty dictionary states and route sidebar phrase/compare links through mode-aware queries. Do not add a persistent global AI toggle yet.

## Non-goals

- No auth or saved preferences.
- No new model family.
- No bulk AI-generated sitemap pages.
