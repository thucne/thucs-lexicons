import Audio from '@/components/molecules/Audio';
import { SearchResult } from '@/types';
import { getDisplayPhonetics, normalizePhoneticText } from '@/utils/phonetics';
import { cn } from '@/lib/utils';

type PronunciationListProps = {
    entry: SearchResult;
    maxVariants?: number;
    offset?: number;
    className?: string;
};

const PronunciationList = ({ entry, maxVariants, offset = 0, className }: PronunciationListProps) => {
    const variants = getDisplayPhonetics(entry, { max: maxVariants, offset });

    if (!variants.length) {
        return null;
    }

    return (
        <div
            className={cn(
                'text-muted-foreground flex flex-col gap-1 font-mono text-sm sm:flex-row sm:flex-wrap sm:items-center',
                className
            )}
        >
            {variants.map((phonetic, index) => {
                const key =
                    normalizePhoneticText(phonetic.text) || phonetic.audio?.trim() || `phonetic-${offset + index}`;

                return (
                    <div key={key} className="flex items-center gap-1 sm:contents">
                        {index > 0 && (
                            <span aria-hidden className="text-muted-foreground mx-1 hidden sm:inline">
                                ·
                            </span>
                        )}
                        <Audio phonetic={phonetic} showPhonetic={Boolean(phonetic.text?.trim())} className="gap-1" />
                    </div>
                );
            })}
        </div>
    );
};

export default PronunciationList;
