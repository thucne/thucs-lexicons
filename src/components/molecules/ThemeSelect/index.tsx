'use client';

import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const ThemeSelect = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleChange = (mode: string) => {
        setTheme(mode);
    };

    const getButtonIcon = () => {
        if (!mounted) {
            return <span className="size-4" aria-hidden />;
        }

        if (theme === 'system') {
            return <Monitor className="size-4" />;
        }

        if (resolvedTheme === 'dark') {
            return <Moon className="size-4" />;
        }

        return <Sun className="size-4" />;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Toggle theme" />}>
                {getButtonIcon()}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleChange('light')} data-selected={theme === 'light'}>
                    <Sun className="size-4" />
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleChange('dark')} data-selected={theme === 'dark'}>
                    <Moon className="size-4" />
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleChange('system')} data-selected={theme === 'system'}>
                    <Monitor className="size-4" />
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ThemeSelect;
