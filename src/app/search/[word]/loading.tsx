import { Skeleton } from '@/components/ui/skeleton';

const LoadingLexicon = () => {
    return (
        <div className="flex items-center gap-2 px-4 py-6 text-sm text-muted-foreground">
            <Skeleton className="size-5 rounded-full" />
            Exploring this entry…
        </div>
    );
};

export default LoadingLexicon;
