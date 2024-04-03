import React from 'react';
import { Definition } from '@/types';

import { Box, Typography } from '@mui/material';

type DefinitionProps = {
    definition: Definition;
};

const DefinitionComponent = ({ definition }: DefinitionProps) => {
    return (
        <Box component="li" my={0.5}>
            <Typography className="font-medium">{definition.definition}</Typography>
            {!!definition?.example?.length && (
                <Typography variant="caption" className="italic">
                    <Box component="span" className="font-bold">
                        Example:
                    </Box>{' '}
                    {definition.example}
                </Typography>
            )}
        </Box>
    );
};

export default DefinitionComponent;
