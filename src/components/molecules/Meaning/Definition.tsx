import React from 'react';
import { Definition } from '@/types';

import { Box, Typography } from '@mui/material';
import Thesaurus from '../Thesaurus';

type DefinitionProps = {
    definition: Definition;
    index: number;
};

const DefinitionComponent = ({ definition, index }: DefinitionProps) => {
    return (
        <Box component="li" my={0.5}>
            <div className="flex flex-col gap-2">
                <Typography className="font-medium">{definition.definition}</Typography>
                {!!definition?.example?.length && (
                    <Typography variant="caption" className="italic">
                        <Box component="span" className="font-bold">
                            Example:
                        </Box>{' '}
                        {definition.example}
                    </Typography>
                )}
                <Thesaurus
                    antonyms={definition.antonyms}
                    synonyms={definition.synonyms}
                    autoExpand={index === 0}
                />
            </div>
        </Box>
    );
};

export default DefinitionComponent;
