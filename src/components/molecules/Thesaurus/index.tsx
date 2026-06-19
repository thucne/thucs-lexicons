import { useEffect, useState } from 'react';

import { ThesaurusType } from '@/types';
import { getFirstDefinition, getFreeDictionaryLexicons } from '@/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import ThesaurusList, { ThesaurusItem, ThesaurusTypeProps } from './ThesaurusList';

type ThesaurusProps = {
    antonyms?: string[];
    synonyms?: string[];
    autoExpand?: boolean;
};

const toThesaurusItems = async (words: string[]) => {
    const results = await getFreeDictionaryLexicons(words.slice(0, 5));

    return results.map(
        (result): ThesaurusItem => ({
            word: result[0].word,
            definition: getFirstDefinition(result),
            url: `/search/${encodeURIComponent(result[0].word)}`
        })
    );
};

const Thesaurus = ({ antonyms = [], synonyms = [], autoExpand = false }: ThesaurusProps) => {
    const [expanded, setExpanded] = useState(autoExpand ? ['thesaurus'] : []);
    const [antonymsList, setAntonymsList] = useState<ThesaurusItem[]>([]);
    const [synonymsList, setSynonymsList] = useState<ThesaurusItem[]>([]);
    const [fetched, setFetched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            setIsLoading(true);

            const [nextAntonyms, nextSynonyms] = await Promise.all([
                toThesaurusItems(antonyms),
                toThesaurusItems(synonyms)
            ]);

            setAntonymsList(nextAntonyms);
            setSynonymsList(nextSynonyms);
            setIsLoading(false);
            setFetched(true);
        };

        if (!isLoading && !fetched && (antonyms.length > 0 || synonyms.length > 0)) {
            fetchAll();
        }
    }, [synonyms, antonyms, isLoading, fetched]);

    const shouldShowThesaurus = antonymsList.length > 0 || synonymsList.length > 0;

    if (isLoading) {
        return (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Skeleton className="size-3.5 rounded-full" />
                Loading related words…
            </div>
        );
    }

    if (!shouldShowThesaurus) {
        return null;
    }

    return (
        <Accordion value={expanded} onValueChange={setExpanded} className="rounded-lg border">
            <AccordionItem value="thesaurus">
                <AccordionTrigger aria-controls="word-thesaurus-content" id="word-thesaurus-header">
                    Related words
                </AccordionTrigger>
                <AccordionContent id="word-thesaurus-content" className="px-4 pb-4">
                    <ThesaurusList
                        id={`word-thesaurus-${ThesaurusType.Antonyms}`}
                        type={ThesaurusType.Antonyms as ThesaurusTypeProps['type']}
                        words={antonymsList}
                    />
                    <ThesaurusList
                        id={`word-thesaurus-${ThesaurusType.Synonyms}`}
                        type={ThesaurusType.Synonyms as ThesaurusTypeProps['type']}
                        words={synonymsList}
                    />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default Thesaurus;
