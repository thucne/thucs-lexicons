import React, { PropsWithChildren } from 'react';
import { Definition } from '@/types';

import { Box, Typography } from '@mui/material';
import Thesaurus from '../Thesaurus';

type DefinitionProps = {
    definition: Definition;
    index: number;
    isIntersecting?: boolean;
};

const DefinitionComponent = ({ definition, index, isIntersecting = true }: DefinitionProps) => {
    return (
        <Box component="li" my={0.5}>
            <div className="flex flex-col gap-2">
                <Typography className="lexicon-box font-medium">
                    {definition.definition?.length
                        ? definition.definition?.split(' ').map((word, defIndex) => {
                              return [
                                  <span
                                      key={`${index}-${defIndex}-lexicon`}
                                      className="lexicon cursor-pointer decoration-2 underline-offset-4"
                                  >
                                      {word}
                                  </span>,
                                  <span key={`${index}-${defIndex}-space`}> </span>
                              ];
                          })
                        : 'No definition found'}
                </Typography>
                {!!definition?.example?.length && (
                    <Typography variant="caption" className="italic">
                        <Box component="span" className="font-bold">
                            Example:
                        </Box>{' '}
                        {definition.example}
                    </Typography>
                )}
                {isIntersecting && (
                    <Thesaurus antonyms={definition.antonyms} synonyms={definition.synonyms} autoExpand={index === 0} />
                )}
            </div>
        </Box>
    );
};

export default DefinitionComponent;
