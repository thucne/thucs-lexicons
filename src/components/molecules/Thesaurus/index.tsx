import { useState, useEffect } from 'react';

import { Typography } from '@mui/material';
import { MinusIcon, PlusIcon } from '@/components/atoms/AppIcons';
import { PromiseStatus, SearchResults, ThesaurusType } from '@/types';
import { FREE_DICTIONARY_API } from '@/constants';
import { getFirstDefinition } from '@/utils';
import ThesaurusList, { ThesaurusItem, ThesaurusTypeProps } from './ThesaurusList';

import { StyledAccordion, StyledAccordionDetails, StyledAccordionSummary } from './styles';

type ThesaurusProps = {
    antonyms?: string[];
    synonyms?: string[];
    autoExpand?: boolean;
};

const Thesaurus = ({ antonyms = [], synonyms = [], autoExpand = false }: ThesaurusProps) => {
    const [expanded, setExpanded] = useState(autoExpand);
    const [antonymsList, setAntonymsList] = useState<ThesaurusItem[]>([]);
    const [synonymsList, setSynonymsList] = useState<ThesaurusItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchTherausus = async (type: ThesaurusTypeProps['type'], words: string[]) => {
            if (words.length > 0) {
                const wordsListPromises = words.map(async (word) => {
                    const response = await fetch(`${FREE_DICTIONARY_API}/${word}`);
                    return await response.json();
                });

                const results = await Promise.allSettled(wordsListPromises);

                const foundWords: ThesaurusItem[] = results
                    // filter out the rejected promises
                    .filter((result) => result.status === PromiseStatus.Fulfilled)
                    // the remaining promises are fulfilled, thus we can safely cast them to PromiseFulfilledResult that contains the value
                    .map((result) => (result as PromiseFulfilledResult<any>).value)
                    // if the word is not found in the dictionary, the return message would be an object {} instead of an array []
                    .filter((result: any) => Array.isArray(result))
                    // map the results to the ThesaurusItem type
                    .map((results: SearchResults) => {
                        return {
                            word: results[0].word,
                            definition: getFirstDefinition(results),
                            url: `/search/${results[0].word}`
                        };
                    });

                if (type === ThesaurusType.Antonyms) {
                    setAntonymsList(foundWords);
                } else {
                    setSynonymsList(foundWords);
                }
            }
        };

        const fetchAll = async () => {
            setIsLoading(true);

            await Promise.allSettled([
                fetchTherausus(ThesaurusType.Antonyms, antonyms),
                fetchTherausus(ThesaurusType.Synonyms, synonyms)
            ]);

            setIsLoading(false);
        };

        fetchAll();
    }, [synonyms, antonyms]);

    const shouldShowThesaurs = antonymsList.length > 0 || synonymsList.length > 0;

    if (isLoading) {
        return <Typography>Loading thesaurus...</Typography>;
    }

    if (!shouldShowThesaurs) {
        return null;
    }

    return (
        <StyledAccordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
            <StyledAccordionSummary
                expandIcon={
                    expanded ? (
                        <MinusIcon sx={{ fontSize: '0.9rem', transform: 'rotate(90deg)' }} />
                    ) : (
                        <PlusIcon sx={{ fontSize: '0.9rem' }} />
                    )
                }
                aria-controls="panel1d-content"
                id="panel1d-header"
            >
                <Typography>Thesaurus: synonyms, antonyms</Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
                <ThesaurusList
                    id={`word-thesaurus-${ThesaurusType.Antonyms}`}
                    type={ThesaurusType.Antonyms}
                    words={antonymsList}
                />
                <ThesaurusList
                    id={`word-thesaurus-${ThesaurusType.Synonyms}`}
                    type={ThesaurusType.Synonyms}
                    words={synonymsList}
                />
            </StyledAccordionDetails>
        </StyledAccordion>
    );
};

export default Thesaurus;