import { Definition } from '@/types';

import Thesaurus from '../Thesaurus';

type DefinitionProps = {
    definition: Definition;
    index: number;
    isIntersecting?: boolean;
};

const DefinitionComponent = ({ definition, index, isIntersecting = true }: DefinitionProps) => {
    return (
        <li className="my-2">
            <div className="flex flex-col gap-2">
                <p className="lexicon-box text-sm leading-relaxed text-foreground">
                    {definition.definition?.length
                        ? definition.definition.split(' ').map((word, defIndex) => (
                              <span key={`${index}-${defIndex}`}>
                                  <span className="lexicon cursor-pointer decoration-2 underline-offset-4">
                                      {word}
                                  </span>{' '}
                              </span>
                          ))
                        : 'No definition found'}
                </p>
                {!!definition?.example?.length && (
                    <p className="border-l-2 border-border pl-3 text-sm text-muted-foreground">{definition.example}</p>
                )}
                {isIntersecting && (
                    <Thesaurus antonyms={definition.antonyms} synonyms={definition.synonyms} autoExpand={index === 0} />
                )}
            </div>
        </li>
    );
};

export default DefinitionComponent;
