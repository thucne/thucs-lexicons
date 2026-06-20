# thucne dictionary

**Last updated: 2026-06-19**

thucne dictionary is a stateless AI dictionary for fast word, phrase, comparison, pronunciation, and related-word exploration.

- No login, account, or saved-word persistence.
- Free Dictionary API is the primary source for canonical English dictionary entries.
- OpenAI is used only as a clearly labeled fallback for phrases, slang, misspellings, idioms, and unsupported terms.
- The UI uses Next.js 15, React 19, Tailwind CSS v4, shadcn/Base UI primitives, and Geist typography.
- Redux is used as a session cache for search results; SWR handles client-side lookup state.

Keywords: Next.js 15, React 19, TypeScript, Tailwind CSS v4, shadcn, Redux, SWR, Free Dictionary API, OpenAI.

## Getting Started

Install dependencies

```bash
pnpm i

# alternatives
npm i
yarn i
# or
bun install
```

Then, run the development server:

```bash
pnpm dev

# alternatives
npm run dev
yarn dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Feedback

Feedback is much appreciated!
