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
        <header className="bg-background/85 supports-[backdrop-filter]:bg-background/65 fixed inset-x-0 top-0 z-50 border-b px-4 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3">
                <Link href="/" className="text-base font-semibold tracking-tight sm:text-lg">
                    thucne dictionary
                </Link>

                <div className="hidden min-w-0 max-w-[480px] flex-1 sm:block">
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
