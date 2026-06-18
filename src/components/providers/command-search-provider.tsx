'use client';

import dynamic from 'next/dynamic';
import { Suspense, createContext, useCallback, useContext, useEffect, useState } from 'react';

import { detectMacPlatform } from '@/utils/platform';

const CommandSearch = dynamic(() => import('@/components/organisms/NavigationBar/CommandSearch'), {
    ssr: false
});

type CommandSearchContextValue = {
    openCommand: () => void;
};

const CommandSearchContext = createContext<CommandSearchContextValue>({
    openCommand: () => {}
});

export function useCommandSearch() {
    return useContext(CommandSearchContext);
}

export function CommandSearchProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [isMac, setIsMac] = useState(false);

    const openCommand = useCallback(() => setOpen(true), []);

    useEffect(() => {
        setIsMac(detectMacPlatform());
    }, []);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            const modifier = isMac ? e.metaKey : e.ctrlKey;

            if (modifier && e.key === 'k') {
                e.preventDefault();
                e.stopPropagation();
                setOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isMac]);

    return (
        <CommandSearchContext.Provider value={{ openCommand }}>
            {children}
            <Suspense fallback={null}>
                <CommandSearch open={open} onOpenChange={setOpen} />
            </Suspense>
        </CommandSearchContext.Provider>
    );
}
