'use client';

import { useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { KbdHint } from '@/components/ui/kbd-hint';
import { useSearchNavigation } from '@/hooks/use-search-navigation';
import { cn } from '@/lib/utils';

type SearchBarProps = {
    autoFocus?: boolean;
    defaultValue?: string;
    size?: 'medium' | 'large';
    onOpenCommand?: () => void;
    onSubmitted?: () => void;
    commandFirst?: boolean;
    editable?: boolean;
};

const SearchBar = ({
    autoFocus = false,
    defaultValue = '',
    size = 'medium',
    onOpenCommand,
    onSubmitted,
    commandFirst = false,
    editable = false
}: SearchBarProps) => {
    const searchRef = useRef<HTMLInputElement>(null);
    const { search, setSearch, submitSearch } = useSearchNavigation(defaultValue);
    const isCommandLauncher = Boolean(onOpenCommand && commandFirst && !editable);
    const isReadOnly = isCommandLauncher && !autoFocus;

    useEffect(() => {
        if (autoFocus) {
            searchRef.current?.focus();
        }
    }, [autoFocus]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submitSearch();
        onSubmitted?.();
    };

    const handleFocus = () => {
        if (isCommandLauncher) {
            onOpenCommand?.();
            searchRef.current?.blur();
        }
    };

    const handleClick = () => {
        if (isCommandLauncher) {
            onOpenCommand?.();
        }
    };

    const groupHeight = size === 'large' ? 'h-11 text-base' : 'h-9 text-sm';

    return (
        <form onSubmit={handleSubmit} className="relative w-full">
            <InputGroup className={cn(groupHeight, isCommandLauncher && 'cursor-pointer')}>
                <InputGroupAddon align="inline-start">
                    <Search className="text-muted-foreground size-4" aria-hidden />
                </InputGroupAddon>
                <InputGroupInput
                    ref={searchRef}
                    id="search-input"
                    name="search"
                    placeholder="Search a word, phrase, or comparison"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={handleFocus}
                    onClick={handleClick}
                    readOnly={isReadOnly}
                    autoFocus={autoFocus}
                    className={cn(isCommandLauncher && 'cursor-pointer')}
                />
                <InputGroupAddon align="inline-end">
                    {search && !isReadOnly ? (
                        <InputGroupButton type="submit" aria-label="Search thucne dictionary">
                            <Search className="size-4" />
                        </InputGroupButton>
                    ) : (
                        onOpenCommand && <KbdHint onClick={onOpenCommand} />
                    )}
                </InputGroupAddon>
            </InputGroup>
        </form>
    );
};

export default SearchBar;
