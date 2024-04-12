import { useState, useEffect } from 'react';

import { Typography } from '@mui/material';
import { MinusIcon, PlusIcon } from '@/components/atoms/AppIcons';
import { PromiseStatus, SearchResults, SearchResultsSupabase, ThesaurusType } from '@/types';
import { FREE_DICTIONARY_API } from '@/constants';
import { getFirstDefinition } from '@/utils';
import ThesaurusList, { ThesaurusItem, ThesaurusTypeProps } from './ThesaurusList';

import { StyledAccordion, StyledAccordionDetails, StyledAccordionSummary } from './styles';
import { useAppDispatch } from '@/redux/store';
import { persistWordToDatabaseAndStore } from '@/redux/actions/lexicon';
import _ from 'lodash';

type ThesaurusProps = {
    antonyms?: string[];
    synonyms?: string[];
    autoExpand?: boolean;
};

const Thesaurus = ({ antonyms = [], synonyms = [], autoExpand = false }: ThesaurusProps) => {
    const dispatch = useAppDispatch();
    const [expanded, setExpanded] = useState(autoExpand);
    const [antonymsList, setAntonymsList] = useState<ThesaurusItem[]>([]);
    const [synonymsList, setSynonymsList] = useState<ThesaurusItem[]>([]);
    const [fetched, setFetched] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchTherausus = async (type: ThesaurusTypeProps['type'], words: string[]) => {
            if (words.length > 0) {
                const responseFromSupabase = await fetch('/api/freedictionaryapi/get?word=' + words.join(',')).then(
                    (res) => res.json()
                );

                const wordsNeedToFetch = words.filter(
                    (word) => !responseFromSupabase.find((result: SearchResultsSupabase) => result.word === word)
                );

                const wordsListPromises = wordsNeedToFetch.map(async (word) => {
                    const response = await fetch(`${FREE_DICTIONARY_API}/${word}`);
                    return await response.json();
                });

                const results = await Promise.allSettled(wordsListPromises);

                const fullfilledResults = results
                    // filter out the rejected promises
                    .filter((result) => result.status === PromiseStatus.Fulfilled)
                    // the remaining promises are fulfilled, thus we can safely cast them to PromiseFulfilledResult that contains the value
                    .map((result) => (result as PromiseFulfilledResult<any>).value)
                    // if the word is not found in the dictionary, the return message would be an object {} instead of an array []
                    .filter((result: any) => Array.isArray(result));

                const persistLexicons: SearchResultsSupabase[] = fullfilledResults.map((result: SearchResults) => ({
                    word: result[0].word,
                    searchResults: result
                }));

                dispatch(persistWordToDatabaseAndStore(persistLexicons));

                const concatResults = _.concat(responseFromSupabase, fullfilledResults);

                const mappedWords: ThesaurusItem[] = concatResults
                    // map the results to the ThesaurusItem type
                    .map((lexicon: SearchResultsSupabase) => {
                        return {
                            word: lexicon.word,
                            definition: getFirstDefinition(lexicon.searchResults),
                            url: `/search/${lexicon.word}`
                        };
                    });

                if (type === ThesaurusType.Antonyms) {
                    setAntonymsList(mappedWords);
                } else {
                    setSynonymsList(mappedWords);
                }
            }
        };

        const fetchAll = async () => {
            setIsLoading(true);

            await Promise.allSettled([
                fetchTherausus(ThesaurusType.Antonyms, antonyms.slice(0, 5)), // to not overload the API, we only fetch the first 5 words
                fetchTherausus(ThesaurusType.Synonyms, synonyms.slice(0, 5))
            ]);

            setIsLoading(false);
        };

        if (!isLoading && !fetched) {
            fetchAll().finally(() => setFetched(true));
        }
    }, [synonyms, antonyms, isLoading, fetched, dispatch]);

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
