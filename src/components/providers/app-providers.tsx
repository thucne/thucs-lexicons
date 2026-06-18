'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/providers/theme-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
    );
}
