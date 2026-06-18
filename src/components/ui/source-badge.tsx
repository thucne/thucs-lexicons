import { cva, type VariantProps } from 'class-variance-authority';
import { Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const sourceBadgeVariants = cva('rounded-full border-transparent', {
    variants: {
        variant: {
            dictionary: 'bg-status-dictionary text-status-dictionary-foreground',
            ai: 'bg-status-ai text-status-ai-foreground'
        }
    },
    defaultVariants: {
        variant: 'dictionary'
    }
});

const variantLabels: Record<NonNullable<VariantProps<typeof sourceBadgeVariants>['variant']>, string> = {
    dictionary: 'Dictionary API',
    ai: 'AI Generated'
};

type SourceBadgeProps = VariantProps<typeof sourceBadgeVariants> & {
    className?: string;
};

export function SourceBadge({ variant = 'dictionary', className }: SourceBadgeProps) {
    return (
        <Badge variant="outline" className={cn(sourceBadgeVariants({ variant }), className)}>
            {variant === 'ai' && <Sparkles className="size-3" />}
            {variantLabels[variant ?? 'dictionary']}
        </Badge>
    );
}
