import { cn } from '@/lib/utils';

type PageShellProps = React.ComponentProps<'div'> & {
    size?: 'default' | 'narrow';
};

export function PageShell({ className, size = 'default', ...props }: PageShellProps) {
    return (
        <div
            className={cn(
                'mx-auto px-4',
                size === 'default' ? 'max-w-6xl py-6 md:py-10' : 'max-w-3xl py-8 md:py-14',
                className
            )}
            {...props}
        />
    );
}
