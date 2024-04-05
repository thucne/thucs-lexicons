import { useRef } from 'react';

import { Box, Typography } from '@mui/material';

import { Meaning } from '@/types';
import Grid from '@/components/atoms/AppGrid';

import Definition from './Definition';
import Thesaurus from '../Thesaurus';
import { useIntersectionStatus } from '@/hooks/use-intersection-observer';

type MeaningProps = {
    meaning: Meaning;
    index: number;
};

const MeaningComponent = ({ meaning, index }: MeaningProps) => {
    const meaningRef = useRef<HTMLDivElement>(null);

    const isIntersecting = useIntersectionStatus(meaningRef, { threshold: 0.5, unobserveOnIntersect: true });

    return (
        <Grid container spacing={2} ref={meaningRef}>
            <Grid xs={12}>
                <Typography className="font-bold italic">{meaning.partOfSpeech}</Typography>
            </Grid>

            <Grid xs={12}>
                <Box component="ul" my={0}>
                    {meaning.definitions.map((definition, definitionIndex) => {
                        return (
                            <Definition
                                key={`${meaning.partOfSpeech}-definition-${definitionIndex}`}
                                definition={definition}
                                index={index + definitionIndex}
                                isIntersecting={isIntersecting}
                            />
                        );
                    })}
                </Box>
            </Grid>

            {isIntersecting && (
                <Grid xs={12}>
                    <Thesaurus antonyms={meaning.antonyms} synonyms={meaning.synonyms} autoExpand={index === 0} />
                </Grid>
            )}
        </Grid>
    );
};

export default MeaningComponent;
