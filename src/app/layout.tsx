import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// For Material UI integration
import AppWrapper from '@/components/organisms/Wrappers/AppWrapper';
import StoreProvider from '@/components/organisms/Wrappers/StoreProvider';
import ThemeProvider from '@/components/organisms/Wrappers/ThemeProvider';
import { DEFAULT_OG_IMAGE } from '@/constants';

const inter = Inter({ subsets: ['vietnamese', 'latin'] });

export const metadata: Metadata = {
    metadataBase: new URL('https://dictionary.thucde.dev'),
    title: 'thucne dictionary | Free Dictionary',
    description: 'A free dictionary app with a simple and intuitive interface, powered by the Free Dictionary API and OpenAI.',
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
