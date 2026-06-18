'use client';

import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { detectMacPlatform } from '@/utils/platform';

type KbdHintProps = {
    className?: string;
    onClick?: () => void;
};

export function KbdHint({ className, onClick }: KbdHintProps) {
    const [isMac, setIsMac] = useState(false);

    useEffect(() => {
        setIsMac(detectMacPlatform());
    }, []);

    const label = `${isMac ? '⌘' : 'Ctrl'} K`;

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                className={cn('rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', className)}
                aria-label="Open command palette"
            >
                <Badge variant="outline" className="font-mono text-xs font-normal">
                    {label}
                </Badge>
            </button>
        );
    }

    return (
        <Badge variant="outline" className={cn('font-mono text-xs font-normal', className)}>
            {label}
        </Badge>
    );
}
