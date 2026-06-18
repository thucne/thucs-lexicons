'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import ThemeSelect from '@/components/molecules/ThemeSelect';
import SearchBar from '@/components/organisms/NavigationBar/SearchBar';
import { useCommandSearch } from '@/components/providers/command-search-provider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';

const NavigationBar = () => {
    const pathname = usePathname();
    const { openCommand } = useCommandSearch();
    const isHome = pathname === '/';

    return (
        <header className="sticky top-0 z-50 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center justify-between gap-4">
                <Link href="/" className="text-lg font-semibold tracking-tight md:ml-5">
                    Lexicons
                </Link>

                <div className={`hidden w-full max-w-[480px] ${isHome ? 'sm:block' : 'block'}`}>
                    <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                        <SearchBar onOpenCommand={openCommand} commandFirst />
                    </Suspense>
                </div>

                <div className="flex items-center gap-1">
                    {!isHome && (
                        <Sheet>
                            <SheetTrigger
                                render={
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="sm:hidden"
                                        aria-label="Open search"
                                    />
                                }
                            >
                                <Search className="size-4" />
                            </SheetTrigger>
                            <SheetContent side="top" className="pt-6">
                                <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                                    <SearchBar autoFocus editable />
                                </Suspense>
                            </SheetContent>
                        </Sheet>
                    )}
                    <ThemeSelect />
                </div>
            </div>
        </header>
    );
};

export default NavigationBar;
