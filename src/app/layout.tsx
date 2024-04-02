import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// For Material UI integration
import ThemeProvider from '@/components/organisms/Wrappers/ThemeProvider';
import StoreProvider from '@/components/organisms/Wrappers/StoreProvider';
import AppWrapper from '@/components/organisms/Wrappers/AppWrapper';

const inter = Inter({ subsets: ['vietnamese', 'latin'] });

export const metadata: Metadata = {
    title: "My Lexicon",
    description: 'This app is used to store and manage vocabulary.',
    openGraph: {
        images: [
            {
                url: 'https://res.cloudinary.com/katyperrycbt/image/upload/v1711553890/j0qgiav9nyeigteenjie.jpg', // Must be an absolute URL
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
