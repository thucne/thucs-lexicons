'use client';

import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command';
import { EXAMPLE_QUERIES, useSearchNavigation } from '@/hooks/use-search-navigation';

type CommandSearchProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const CommandSearch = ({ open, onOpenChange }: CommandSearchProps) => {
    const { search, setSearch, submitSearch } = useSearchNavigation();

    const handleSelect = (value: string) => {
        setSearch(value);
        submitSearch(value);
        onOpenChange(false);
    };

    return (
        <CommandDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Search thucne dictionary"
            description="Search a word, phrase, or comparison"
        >
            <Command>
                <CommandInput
                    placeholder="Search a word, phrase, or comparison"
                    value={search}
                    onValueChange={setSearch}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            submitSearch();
                            onOpenChange(false);
                        }
                    }}
                />
                <CommandList>
                    <CommandEmpty>Type a word or pick an example below.</CommandEmpty>
                    <CommandGroup heading="Examples">
                        {EXAMPLE_QUERIES.map((query) => (
                            <CommandItem key={query} value={query} onSelect={() => handleSelect(query)}>
                                {query}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </Command>
        </CommandDialog>
    );
};

export default CommandSearch;
