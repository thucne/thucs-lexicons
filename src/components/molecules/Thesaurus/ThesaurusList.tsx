import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ThesaurusType } from '@/types';
import { cn } from '@/lib/utils';

export type ThesaurusItem = {
    word: string;
    definition: string;
    url: string;
};

export type ThesaurusTypeProps = {
    type: ThesaurusType;
    words: ThesaurusItem[];
    id: string;
};

const ThesaurusList = ({ type, words, id }: ThesaurusTypeProps) => {
    if (words.length === 0) {
        return null;
    }

    return (
        <div className="mb-4">
            <p className="text-sm font-semibold">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
            <div className="mt-2 flex flex-wrap gap-2">
                {words.map((word, index) => (
                    <Tooltip key={`${id}-${word.word}-${index}`}>
                        <TooltipTrigger
                            render={
                                <Link
                                    href={word.url}
                                    className={cn(
                                        buttonVariants({ variant: 'outline', size: 'sm' }),
                                        'rounded-full'
                                    )}
                                />
                            }
                        >
                            {word.word}
                        </TooltipTrigger>
                        <TooltipContent>{word.definition || 'Open related word'}</TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </div>
    );
};

export default ThesaurusList;
