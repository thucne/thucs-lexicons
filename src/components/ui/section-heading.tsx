import { cn } from '@/lib/utils';

export function SectionHeading({ className, ...props }: React.ComponentProps<'h3'>) {
    return <h3 className={cn('text-base font-medium', className)} {...props} />;
}
