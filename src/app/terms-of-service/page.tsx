import type { Metadata } from 'next';

import { PageShell } from '@/components/ui/page-shell';

export const metadata: Metadata = {
    title: 'Terms of Service | Lexicons',
    description: 'Terms for using Lexicons, a stateless dictionary at dictionary.thucde.dev.'
};

const sections = [
    {
        title: 'About the Service',
        body: 'Lexicons is a stateless English dictionary at dictionary.thucde.dev. It provides word and phrase lookup, pronunciation, example usage, related-word exploration, quick meanings on hover, and command-palette search. The service is free to use and does not require an account.'
    },
    {
        title: 'Acceptable Use',
        body: 'Use Lexicons lawfully and for personal reference. Do not attempt to disrupt the website, overload its APIs, scrape it at abusive rates, or interfere with third-party providers that power lookups.'
    },
    {
        title: 'No Accounts or Saved Data',
        body: 'Lexicons does not offer login, user accounts, favorites, or saved word lists. Search results are not written to a Lexicons database. During a browser session, results may be held in memory to support navigation; this cache is cleared when you close the tab or browser.'
    },
    {
        title: 'Third-Party Sources',
        body: 'Dictionary entries come primarily from the Free Dictionary API. When a query is not covered there—such as slang, idioms, phrases, or likely misspellings—Lexicons may send the query to OpenAI for a clearly labeled fallback explanation. Those providers operate under their own terms and availability.'
    },
    {
        title: 'Accuracy and AI Content',
        body: 'All content is provided as-is without warranty. Dictionary data reflects third-party sources. AI-generated explanations are labeled in the interface and may be incomplete or incorrect; verify important uses independently.'
    },
    {
        title: 'Changes',
        body: 'These terms may be updated as the service changes. The effective date at the top of this page reflects the latest revision.'
    },
    {
        title: 'Contact',
        body: 'Questions about these terms can be sent to contact@thucde.dev.'
    }
];

const TermsOfService = () => {
    return (
        <PageShell size="narrow">
            <article className="max-w-2xl space-y-8">
                <header className="space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
                    <p className="text-muted-foreground">Last updated: June 18, 2026</p>
                </header>
                {sections.map((section) => (
                    <section key={section.title} className="space-y-2">
                        <h2 className="text-xl font-semibold">{section.title}</h2>
                        <p className="leading-relaxed text-muted-foreground">{section.body}</p>
                    </section>
                ))}
            </article>
        </PageShell>
    );
};

export default TermsOfService;
