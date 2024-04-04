import { ThesaurusType } from '@/types';
import { Box, Tooltip, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';

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
        <Box>
            <Typography variant="h6">{type.charAt(0).toUpperCase() + type.slice(1)}</Typography>
            <Box component="ul" my={0}>
                {words.map((word, index) => {
                    return (
                        <Box key={`${id}-${word.word}-${index}`} component="li">
                            <Typography>
                                <Tooltip title="Go this word">
                                    <Typography component={Link} href={word.url} className="underline">
                                        {word.word}
                                    </Typography>
                                </Tooltip>{' '}
                                <Typography component="span" className="italic">
                                    {word.definition}
                                </Typography>
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default ThesaurusList;
