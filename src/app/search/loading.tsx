import { Skeleton } from '@/components/ui/skeleton';

const LoadingSearch = () => {
    return (
        <div className="flex items-center gap-2 px-4 py-6 text-sm text-muted-foreground">
            <Skeleton className="size-5 rounded-full" />
            Opening the meaning explorer…
        </div>
    );
};

export default LoadingSearch;
