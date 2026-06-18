import type { Metadata } from 'next';

import { PageShell } from '@/components/ui/page-shell';

export const metadata: Metadata = {
    title: 'Privacy Policy | Lexicons',
    description: 'How Lexicons handles dictionary searches without accounts or saved word lists.'
};

const sections = [
    {
        title: 'Overview',
        body: 'Lexicons is a stateless dictionary at dictionary.thucde.dev. It is designed for lookup without sign-in, profiles, or saved word lists.'
    },
    {
        title: 'What We Do Not Store',
        body: 'Lexicons does not maintain user accounts, collect email addresses, or keep a database of your searches or favorites. We do not sell personal information.'
    },
    {
        title: 'How Searches Work',
        body: 'When you look up a word or phrase, Lexicons sends your query to the Free Dictionary API. If that source cannot cover the query, the query may also be sent to OpenAI to produce a clearly labeled fallback explanation. During a browser session, recent results may be cached in memory so you can move between pages without repeating the same request; this cache is not saved to disk and is cleared when the session ends.'
    },
    {
        title: 'Local Browser Preferences',
        body: 'Lexicons may store your theme choice (light, dark, or system) in your browser so the setting persists between visits. This preference is not linked to an identity and contains no search history.'
    },
    {
        title: 'Server and Hosting Logs',
        body: 'Lexicons is hosted on Vercel. Like most web applications, standard server and platform logs may record information such as IP address, browser type, requested URLs, timestamps, and error details. These logs support reliability and security; Lexicons does not use them to build user profiles or saved search histories.'
    },
    {
        title: 'Third-Party Services',
        body: 'Free Dictionary API and OpenAI receive the queries needed to fulfill lookups and handle that data under their own privacy policies. Review those providers’ policies if you need details on how they process requests.'
    },
    {
        title: 'Contact',
        body: 'Questions about this policy can be sent to contact@thucde.dev.'
    }
];

const PrivacyPolicy = () => {
    return (
        <PageShell size="narrow">
            <article className="max-w-2xl space-y-8">
                <header className="space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
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

export default PrivacyPolicy;
