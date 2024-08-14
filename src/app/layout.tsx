import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// For Material UI integration
import ThemeProvider from '@/components/organisms/Wrappers/ThemeProvider';
import StoreProvider from '@/components/organisms/Wrappers/StoreProvider';
import AppWrapper from '@/components/organisms/Wrappers/AppWrapper';
import { DEFAULT_OG_IMAGE } from '@/constants';

const inter = Inter({ subsets: ['vietnamese', 'latin'] });

export const metadata: Metadata = {
    metadataBase: new URL('https://lexicon-app.at.thucde.dev'),
    title: 'My Lexicons',
    description: `Search for word's definitions, synonyms, antonyms, and more...`,
    openGraph: {
        images: [
            {
                url: DEFAULT_OG_IMAGE, // Must be an absolute URL
                width: 2400,
                height: 1260
            }
        ],
        locale: 'en_US',
        type: 'website'
    }
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <script src="https://accounts.google.com/gsi/client" async></script>
            <body className={inter.className} suppressHydrationWarning={true}>
                <StoreProvider>
                    <ThemeProvider>
                        <AppWrapper>{children}</AppWrapper>
                    </ThemeProvider>
                </StoreProvider>
            </body>
        </html>
    );
}
