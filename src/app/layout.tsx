import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

import AppWrapper from '@/components/organisms/Wrappers/AppWrapper';
import StoreProvider from '@/components/organisms/Wrappers/StoreProvider';
import { AppProviders } from '@/components/providers/app-providers';
import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME } from '@/constants';

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
    metadataBase: new URL('https://dictionary.thucde.dev'),
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`
    },
    applicationName: SITE_NAME,
    description: SITE_DESCRIPTION,
    openGraph: {
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        siteName: SITE_NAME,
        images: [
            {
                url: DEFAULT_OG_IMAGE,
                width: 2400,
                height: 1260
            }
        ],
        locale: 'en_US',
        type: 'website'
    },
    twitter: {
        card: 'summary_large_image',
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        images: [DEFAULT_OG_IMAGE]
    }
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable} ${geistSans.className}`}
        >
            <body>
                <StoreProvider>
                    <AppProviders>
                        <AppWrapper>{children}</AppWrapper>
                    </AppProviders>
                </StoreProvider>
            </body>
        </html>
    );
}
